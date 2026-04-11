/// <reference types="vite/client" />

import { GoogleGenAI, Type } from "@google/genai";
import { Asset, Project } from "../types";

// Always use named parameter { apiKey } for initialization
const getClient = () => {
    try {
        return new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
    } catch (e) {
        return null;
    }
};

const safeJsonParse = (text: string) => {
    try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        return null;
    }
};

export interface InstagramPostResult {
    headline: string;
    caption: string;
    hashtags: string[];
}

export const analyzeAsset = async (base64Data: string, mimeType: string, expertise: string): Promise<{ title: string; tags: string[]; summary: string; scientificContext: string; evidenceLevel?: 'Alto'|'Moderado'|'Baixo'; publicationYear?: string; keyFindings?: string }> => {
  try {
    const ai = getClient();
    if (!ai) throw new Error("API Offline");

    // Use ai.models.generateContent directly and gemini-3-flash-preview for basic text/vision tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: `Você é o motor de inteligência científica Lonq OS. Analise este arquivo médico para a especialidade: ${expertise}. 
            REGRAS OBRIGATÓRIAS:
            1. Responda ESTRITAMENTE em Português do Brasil.
            2. Extraia o título clínico exato se houver.
            3. Tags devem ser especialidades ou termos técnicos.
            4. Summary deve ser um resumo executivo de alta densidade científica.
            5. Determine EvidenceLevel como 'Alto', 'Moderado' ou 'Baixo'.
            6. KeyFindings devem ser os 3 pontos mais importantes do arquivo.

            Retorne apenas JSON válido.` }
        ]
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
                keyFindings: { type: Type.STRING }
            },
            required: ["title", "summary", "tags"]
        }
      }
    });

    // Access .text property directly, do not call as a function
    const parsed = safeJsonParse(response.text || '');
    if (!parsed) throw new Error("Parse Error");

    return {
        title: parsed.title || "Documento Clínico",
        tags: Array.isArray(parsed.tags) ? parsed.tags : ["Medicina"],
        summary: parsed.summary || "Arquivo indexado.",
        scientificContext: parsed.scientificContext || "Análise Lonq.",
        evidenceLevel: (['Alto', 'Moderado', 'Baixo'].includes(parsed.evidenceLevel) ? parsed.evidenceLevel : 'Baixo') as any,
        publicationYear: parsed.publicationYear || new Date().getFullYear().toString(),
        keyFindings: parsed.keyFindings || "Dados consolidados no Vault."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { title: "Ativo Manual", tags: ["Manual"], summary: "Processado em modo offline.", scientificContext: "N/A", evidenceLevel: 'Baixo' };
  }
};

export const generateInstagramContent = async (asset: Asset): Promise<InstagramPostResult> => {
    try {
        const ai = getClient();
        if (!ai) throw new Error("API Offline");

        const prompt = `Crie um post de alto engajamento médico para Instagram baseado neste ativo:
        Título: ${asset.title}
        Resumo: ${asset.summary}
        Achados: ${asset.keyFindings}
        
        REGRAS:
        - Use tom profissional mas engajador.
        - Idioma: Português do Brasil.
        - JSON com campos: headline (gancho), caption (legenda), hashtags.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        caption: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['headline', 'caption', 'hashtags']
                }
            }
        });

        // Access .text property directly
        const parsed = safeJsonParse(response.text || '');
        return {
            headline: parsed?.headline || "Atualização Clínica",
            caption: parsed?.caption || "Novo ativo disponível.",
            hashtags: parsed?.hashtags || ["#medicina"]
        };
    } catch (error) {
        return {
            headline: "Dica do Dia",
            caption: "Confira o novo conteúdo no Vault.",
            hashtags: ["#medicina"]
        };
    }
};

export const searchAssetsWithAI = async (query: string, assets: any[]): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai) return [];

    const slimAssets = assets.map(a => ({
      id: a.id,
      title: a.title,
      tags: a.tags,
      summary: a.summary,
      evidenceLevel: a.evidenceLevel,
      scientificContext: a.scientificContext,
      keyFindings: a.keyFindings,
      content: a.content ? a.content.substring(0, 200) : undefined,
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um assistente de busca semântica para médicos. O médico pesquisou por: "${query}".

REGRAS DE BUSCA SEMÂNTICA MÉDICA:
- Considere sinônimos médicos (ex: "coração" = cardiologia, cardíaco, cardiovascular, miocárdio)
- Considere nomes comerciais vs genéricos de medicamentos
- Considere abreviações médicas (ex: HAS = hipertensão, DM = diabetes)
- Considere termos relacionados (ex: "pele" encontra dermatologia, melanoma, lesão cutânea)
- Considere a intenção do médico, não apenas o termo exato
- Busque correspondências em título, tags, resumo, contexto científico e achados

Aqui estão os arquivos disponíveis:
${JSON.stringify(slimAssets)}

Retorne APENAS um array JSON com os IDs dos arquivos que são ESTREITAMENTE RELEVANTES à busca médica, ordenados por relevância. SEJA RESTRITO: se o arquivo não tratar especificamente do tema, da área ou intenção solicitada, não o inclua. Se não houver nada útil, retorne um array vazio ([]).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const parsed = safeJsonParse(response.text || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};

export const generateSmartTags = async (recentAssets: any[]): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai || recentAssets.length === 0) return ['Recentes'];

    const slimAssets = recentAssets.slice(0, 10).map(a => ({ title: a.title, tags: a.tags }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Baseado no histórico recente de arquivos acessados pelo usuário:
      ${JSON.stringify(slimAssets)}
      
      Gere até 5 tags curtas (máx 2 palavras cada) que representem os temas de interesse atuais do usuário (ex: "Cardiologia", "Exames Clínicos", "Pediatria").
      Retorne APENAS um array JSON de strings com as tags.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const parsed = safeJsonParse(response.text || '["Recentes"]');
    return Array.isArray(parsed) ? parsed.slice(0, 5) : ['Recentes'];
  } catch (error) {
    return ['Recentes', 'Mais vistos'];
  }
};

export const matchDemandToProject = async (intentTitle: string, description: string, projects: Project[]): Promise<string | null> => {
  try {
    if (projects.length === 0 || !intentTitle.trim()) return null;

    // Fast path: String matching heuristic to avoid AI latency
    const normalizedIntent = intentTitle.trim().toLowerCase();
    const exactMatch = projects.find(p => p.name.toLowerCase() === normalizedIntent);
    if (exactMatch) return exactMatch.id;
    
    const includesMatch = projects.find(p => p.name.toLowerCase().includes(normalizedIntent) || normalizedIntent.includes(p.name.toLowerCase()));
    if (includesMatch) return includesMatch.id;

    const ai = getClient();
    if (!ai) return null;


    const projectList = projects.map(p => ({ id: p.id, name: p.name, description: p.description }));
    const systemPrompt = `O usuário está criando uma tarefa (demanda) com o seguinte projeto alvo: "${intentTitle}" e descrição: "${description}".
    
Aqui estão os projetos existentes no banco de dados:
${JSON.stringify(projectList)}

Sua função é identificar qual projeto corresponde à intenção do usuário.
Retorne APENAS UM JSON contendo a propriedade "projectId" com o ID do projeto correspondente. Se nenhum projeto corresponder logicamente, retorne "projectId": "" (string vazia).
Exemplo: {"projectId": "xyz-123"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectId: { type: Type.STRING }
          }
        }
      }
    });

    const parsed = safeJsonParse(response.text || '{}');
    return parsed.projectId || null;
  } catch (error) {
    console.error("Match Project AI Error:", error);
    return null;
  }
};

export const summarizeProjectDemands = async (project: Project, recentDemands: any[]): Promise<string> => {
  try {
    const ai = getClient();
    if (!ai) return "Não foi possível gerar o resumo.";

    if (recentDemands.length === 0) return "Nenhuma demanda cadastrada para este projeto.";

    const slimDemands = recentDemands.map(d => ({ task: d.description, status: d.status }));
    const systemPrompt = `Você é o gerente executivo do projeto "${project.name}".
Gere um parágrafo único, forte, visual e profissional (máximo de 4-5 linhas) respondendo à pergunta implícita: "Em que pé este projeto está no momento?".
Analise as últimas demandas do time listadas abaixo e monte um status coerente. Mantenha em português brasileiro.
Demandas Recentes: ${JSON.stringify(slimDemands)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: systemPrompt
    });

    return response.text || "Resumo não disponível.";
  } catch (error) {
    console.error("Summarize Project AI Error:", error);
    return "Erro ao processar o resumo.";
  }
};

export const chatWithProjectAI = async (
  project: Project,
  message: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getClient();
    if (!ai) return "Sistema de IA offline no momento.";

    const systemPrompt = `Você é o especialista e assistente dedicado do projeto "${project.name}".
Diretrizes e Contexto do Projeto:
- Mantenha um tom profissional, direto e minimalista.
- Responda estritamente em Português do Brasil.
- Baseie suas respostas nas informações a seguir.

INFORMAÇÕES DO PROJETO:
Descrição/Resumo: ${project.description || 'Não definido'}
Data alvo/início: ${project.date || 'Não definido'}

Links:
${project.links.map(l => `- ${l.title}: ${l.url}`).join('\n') || 'Nenhum link cadastrado.'}

Cronograma/Tarefas:
${project.schedule.map(s => `- [${s.status}] (${s.date}) ${s.type}: ${s.title} - ${s.description}`).join('\n') || 'Sem tarefas no cronograma.'}

Design System:
- Cores: ${project.designSystem.colors.join(', ') || 'Nenhuma'}
- Tipografia: ${project.designSystem.typography || 'Padrão'}
- Regras Visuais: ${project.designSystem.notes || 'Nenhuma'}

Arquivos Indexados (nomes):
${project.attachments.map(a => `- ${a.name} (${a.type})`).join('\n') || 'Nenhum arquivo.'}

Por favor, ajude o usuário com tudo o que ele precisar em relação a este projeto.
Se algo não estiver nas informações acima, seja honesto e diga que não encontrou nos dados do projeto.`;

    // Map history to the format required by Gemini SDK
    const formattedHistory = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: `Entendido. Sou o assistente do projeto ${project.name}. Como posso ajudar?` }]},
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: formattedHistory
    });

    return response.text || "Desculpe, não consegui processar a resposta.";
  } catch (error) {
    console.error("Gemini Project Chat Error:", error);
    return "Ocorreu um erro ao comunicar com a IA do projeto.";
  }
};

export const searchCasesWithAI = async (
  query: string,
  cases: any[],
  currentUserId?: string
): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai || cases.length === 0) return [];

    const slimCases = cases.map(c => ({
      id: c.id,
      title: c.title,
      tags: c.tags,
      blocks: (c.blocks || [])
        .filter((b: any) => b.type === 'text' || b.type === 'title' || b.type === 'subtitle' || b.type === 'reference')
        .map((b: any) => b.content?.substring(0, 150))
        .join(' '),
      ownerId: c.ownerId,
      accessCount: c.accessCount || 0,
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um motor de busca semântica ultra-especializado em medicina. O médico pesquisou: "${query}".

REGRAS DE BUSCA SEMÂNTICA MÉDICA:
- Considere sinônimos médicos (ex: "coração" = cardiologia, cardíaco, cardiovascular, miocárdio)
- Considere nomes comerciais vs genéricos de medicamentos
- Considere abreviações médicas (ex: HAS = hipertensão, DM = diabetes)
- Considere termos relacionados (ex: "pele" encontra dermatologia, melanoma, lesão cutânea)
- Considere a intenção do médico, não apenas o termo exato
- Busque correspondências em título, tags e conteúdo dos blocos

REGRA DE PRIORIZAÇÃO:
${currentUserId ? `1. PRIMEIRO: Cases do ownerId "${currentUserId}" que são relevantes à busca (SEMPRE no topo)` : ''}
2. DEPOIS: Demais cases ordenados por accessCount (mais acessos = mais relevante)
3. Dentro de cada grupo, ordene por relevância semântica

Cases disponíveis:
${JSON.stringify(slimCases)}

Retorne APENAS um array JSON com os IDs dos cases que são ESTREITAMENTE RELEVANTES à busca, já na ordem correta de priorização. SEJA RESTRITO: se o case não tratar diretamente dos termos ou intenção clínica da pesquisa, NÃO o inclua. Se não houver nada útil, retorne um array vazio ([]).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const parsed = safeJsonParse(response.text || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("AI Case Search Error:", error);
    return [];
  }
};

export const generateCaseSemanticTags = async (
  title: string,
  blocksText: string
): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai) return [];
    const content = `${title}\n\n${blocksText}`.trim();
    if (content.length < 10) return [];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um especialista em taxonomia médica. Analise o conteúdo clínico abaixo e gere tags semânticas que ajudem na busca.

REGRAS:
- Gere entre 5 a 15 tags
- Inclua: especialidade médica, órgãos/sistemas afetados, sintomas, diagnósticos, termos técnicos
- Inclua SINÔNIMOS médicos (ex: se fala de "útero", inclua "uterino", "endometrial", "ginecologia", "aparelho reprodutor")
- Inclua ABREVIAÇÕES comuns (ex: HAS, DM, ICC, DPOC)
- Inclua termos que um médico pensaria ao buscar este caso, mesmo que não estejam no texto
- Português do Brasil
- Apenas tags curtas (1-3 palavras cada)

CONTEÚDO:
${content.substring(0, 2000)}

Retorne APENAS um array JSON de strings.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const parsed = safeJsonParse(response.text || '[]');
    return Array.isArray(parsed) ? parsed.slice(0, 15) : [];
  } catch (error) {
    console.error("Semantic Tag Generation Error:", error);
    return [];
  }
};
