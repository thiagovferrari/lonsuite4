/// <reference types="vite/client" />

import { GoogleGenAI, Type } from '@google/genai';
import type { Asset, EvidenceLevel } from '../types';

/** Named parameter initialization per SDK contract. */
const getClient = (): GoogleGenAI | null => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('GoogleGenAI init failed:', e);
    return null;
  }
};

/** Robust JSON parser that strips common markdown fences. */
const safeJsonParse = <T = unknown>(text: string): T | null => {
  if (!text) return null;
  try {
    const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(clean) as T;
  } catch {
    return null;
  }
};

const MODEL = 'gemini-1.5-flash';

// ─── AI usage tracking (persisted in localStorage) ───────────────────────────
const AI_USAGE_KEY = 'lon_suite_ai_calls';
export const incrementAIUsage = (): void => {
  try {
    const n = parseInt(localStorage.getItem(AI_USAGE_KEY) || '0', 10);
    localStorage.setItem(AI_USAGE_KEY, String(n + 1));
  } catch { /* silent */ }
};
export const getAIUsage = (): number => {
  try { return parseInt(localStorage.getItem(AI_USAGE_KEY) || '0', 10); }
  catch { return 0; }
};

export interface AssetAnalysis {
  title: string;
  tags: string[];
  summary: string;
  scientificContext: string;
  evidenceLevel: EvidenceLevel;
  publicationYear?: string;
  keyFindings?: string;
}

export const analyzeAsset = async (
  base64Data: string,
  mimeType: string,
  expertise: string,
): Promise<AssetAnalysis> => {
  const fallback: AssetAnalysis = {
    title: 'Ativo Manual',
    tags: ['Manual'],
    summary: 'Processado em modo offline.',
    scientificContext: 'N/A',
    evidenceLevel: 'Baixo',
  };

  try {
    const ai = getClient();
    if (!ai) return fallback;
    incrementAIUsage();

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          {
            text: `Você é o motor de inteligência científica Lonq OS. Analise este arquivo médico para a especialidade: ${expertise}.

REGRAS OBRIGATÓRIAS:
1. Responda ESTRITAMENTE em Português do Brasil.
2. Extraia o título clínico exato se houver.
3. Tags devem ser especialidades ou termos técnicos.
4. Summary deve ser um resumo executivo de alta densidade científica.
5. Determine evidenceLevel como 'Alto', 'Moderado' ou 'Baixo'.
6. keyFindings devem ser os 3 pontos mais importantes do arquivo.

Retorne apenas JSON válido.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            scientificContext: { type: Type.STRING },
            evidenceLevel: { type: Type.STRING },
            publicationYear: { type: Type.STRING },
            keyFindings: { type: Type.STRING },
          },
          required: ['title', 'summary', 'tags'],
        },
      },
    });

    const parsed = safeJsonParse<Partial<AssetAnalysis>>(response.text || '');
    if (!parsed) return fallback;

    const levels: EvidenceLevel[] = ['Alto', 'Moderado', 'Baixo'];
    return {
      title: parsed.title || 'Documento Clínico',
      tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : ['Medicina'],
      summary: parsed.summary || 'Arquivo indexado.',
      scientificContext: parsed.scientificContext || 'Análise Lonq.',
      evidenceLevel: levels.includes(parsed.evidenceLevel as EvidenceLevel)
        ? (parsed.evidenceLevel as EvidenceLevel)
        : 'Baixo',
      publicationYear: parsed.publicationYear || String(new Date().getFullYear()),
      keyFindings: parsed.keyFindings || 'Dados consolidados no Vault.',
    };
  } catch (error) {
    console.error('Gemini analyzeAsset error:', error);
    return fallback;
  }
};

/** Semantic search across Assets. Returns asset IDs in relevance order. */
export const searchAssetsWithAI = async (query: string, assets: Asset[]): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai || assets.length === 0) return [];
    incrementAIUsage();

    const slim = assets.map((a) => ({
      id: a.id,
      title: a.title,
      tags: a.tags,
      summary: a.summary,
      evidenceLevel: a.evidenceLevel,
      scientificContext: a.scientificContext,
      keyFindings: a.keyFindings,
    }));

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Você é um assistente de busca semântica para médicos. O médico pesquisou por: "${query}".

REGRAS DE BUSCA SEMÂNTICA MÉDICA:
- Considere sinônimos médicos (ex: "coração" = cardiologia, cardíaco, cardiovascular, miocárdio)
- Considere nomes comerciais vs genéricos de medicamentos
- Considere abreviações médicas (ex: HAS = hipertensão, DM = diabetes)
- Considere termos relacionados (ex: "pele" encontra dermatologia, melanoma, lesão cutânea)
- Considere a intenção do médico, não apenas o termo exato

Arquivos disponíveis:
${JSON.stringify(slim)}

Retorne APENAS um array JSON com os IDs ESTREITAMENTE RELEVANTES, ordenados por relevância. Se nada relevante, retorne [].`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    });

    const parsed = safeJsonParse<string[]>(response.text || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Gemini searchAssets error:', error);
    return [];
  }
};

/** Semantic search across Cases, with owner prioritization. */
export const searchCasesWithAI = async (
  query: string,
  cases: Asset[],
  currentUserId?: string,
): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai || cases.length === 0) return [];
    incrementAIUsage();

    const slim = cases.map((c) => ({
      id: c.id,
      title: c.title,
      tags: c.tags,
      blocks: (c.blocks || [])
        .filter((b) => ['text', 'title', 'subtitle', 'reference'].includes(b.type))
        .map((b) => (typeof b.content === 'string' ? b.content.substring(0, 150) : ''))
        .join(' '),
      ownerId: c.ownerId,
      accessCount: c.accessCount || 0,
    }));

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Você é um motor de busca semântica ultra-especializado em medicina. O médico pesquisou: "${query}".

REGRAS DE BUSCA:
- Considere sinônimos médicos, nomes comerciais vs genéricos, abreviações (HAS, DM, ICC, DPOC)
- Busque em título, tags e conteúdo dos blocos
- Considere a intenção clínica

PRIORIZAÇÃO:
${currentUserId ? `1. PRIMEIRO: cases do ownerId "${currentUserId}" relevantes\n` : ''}2. DEPOIS: demais cases por accessCount
3. Dentro de cada grupo, ordene por relevância semântica

Cases disponíveis:
${JSON.stringify(slim)}

Retorne APENAS um array JSON com os IDs ESTREITAMENTE RELEVANTES, na ordem correta. Se nada relevante, retorne [].`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    });

    const parsed = safeJsonParse<string[]>(response.text || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Gemini searchCases error:', error);
    return [];
  }
};

/** Generate semantic tags for a case based on its title and text content. */
export const generateCaseSemanticTags = async (
  title: string,
  blocksText: string,
): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai) return [];
    incrementAIUsage();

    const content = `${title}\n\n${blocksText}`.trim();
    if (content.length < 10) return [];

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Você é um especialista em taxonomia médica. Gere tags semânticas para busca.

REGRAS:
- Entre 5 e 15 tags
- Inclua: especialidade, órgãos/sistemas, sintomas, diagnósticos, termos técnicos
- Inclua SINÔNIMOS médicos (ex: "útero" → "uterino", "endometrial", "ginecologia")
- Inclua ABREVIAÇÕES comuns (HAS, DM, ICC, DPOC)
- Português do Brasil
- Tags curtas (1-3 palavras)

CONTEÚDO:
${content.substring(0, 2000)}

Retorne APENAS um array JSON de strings.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    });

    const parsed = safeJsonParse<string[]>(response.text || '[]');
    return Array.isArray(parsed) ? parsed.slice(0, 15) : [];
  } catch (error) {
    console.error('Gemini semanticTags error:', error);
    return [];
  }
};
