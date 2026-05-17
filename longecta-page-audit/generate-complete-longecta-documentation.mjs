import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const rootDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const auditDir = path.join(rootDir, 'longecta-page-audit');
const screenshotDir = path.join(auditDir, 'screenshots-complete');
fs.mkdirSync(screenshotDir, { recursive: true });

const baseUrl = process.env.LONGECTA_BASE_URL || 'http://127.0.0.1:5173';
const skipLiveCapture = process.env.LONGECTA_SKIP_LIVE_CAPTURE === '1';
const chromePath = fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : 'google-chrome';

const pages = [
  {
    id: 'planos',
    path: '/planos',
    name: 'Planos Lon Suite',
    family: 'Lon Suite',
    purpose: 'Página comercial de conversão para a plataforma Lon Suite, apresentando planos, valor percebido, segurança e proposta de assinatura.',
    audience: 'Médicos, clínicas e equipes que precisam organizar acervo científico, imagens, PDFs, casos e materiais com IA e governança.',
    centralCopy: 'A memória científica da prática vira patrimônio organizado, pesquisável e pronto para produzir casos, aulas e materiais.',
    strategy: 'Funciona como página de monetização da plataforma. Ela traduz tecnologia em valor médico: organização, segurança, inteligência, produtividade e continuidade.',
    businessRole: 'Converter interesse em assinatura ou conversa comercial, além de separar o produto Lon Suite das frentes de serviço Longecta.',
    structure: [
      'Hero com promessa de patrimônio científico e CTA para planos.',
      'Blocos de benefícios ligados a acervo, busca, casos e segurança.',
      'Tabela ou cards de planos com hierarquia de valor.',
      'Seções de confiança, uso médico e diferenciação contra arquivos soltos.',
      'Fechamento com chamada para entrada na plataforma.',
    ],
    assets: ['Imagens editoriais de médicos usando laptop, celular e acervo científico.', 'Mockups visuais de plataforma e contexto clínico premium.'],
    rebuild: ['Manter uma promessa simples: acervo médico organizado com IA.', 'Preservar comparação entre planos e diferenciais por perfil de uso.', 'Conectar sempre com segurança, busca e produção científica.'],
  },
  {
    id: 'detalhes-planos',
    path: '/detalhes-dos-planos',
    name: 'Detalhes dos Planos',
    family: 'Lon Suite',
    purpose: 'Página de aprofundamento para explicar o que está por trás dos planos e reduzir objeções antes da assinatura.',
    audience: 'Usuários que já entenderam o produto, mas precisam justificar valor, segurança, escopo e benefícios antes de contratar.',
    centralCopy: 'Não é armazenamento de arquivos: é uma estrutura para transformar acervo em inteligência, produção e memória científica.',
    strategy: 'Educar a decisão. A página aumenta confiança, explica camadas do produto e prepara o usuário para escolher plano com menos dúvida.',
    businessRole: 'Reduzir fricção no fechamento, apoiar vendas consultivas e servir como material explicativo para leads mais racionais.',
    structure: [
      'Explicação ampliada sobre acervo, segurança e inteligência.',
      'Detalhamento de recursos e casos de uso.',
      'Blocos de comparação contra processos manuais.',
      'Perguntas e objeções frequentes.',
      'CTA de retorno aos planos.',
    ],
    assets: ['Imagens de médicos, tecnologia e organização científica.', 'Elementos visuais de confiança, segurança e produtividade.'],
    rebuild: ['Explicar recursos em linguagem de resultado, não de feature.', 'Repetir o vínculo entre acervo organizado e produção científica.', 'Manter ponte clara para a página de planos.'],
  },
  {
    id: 'solucoes',
    path: '/solucoes',
    name: 'Nossas Soluções',
    family: 'Longecta',
    purpose: 'Hub comercial da Longecta. Organiza o portfólio por contexto de compra: médico, clínica e congresso.',
    audience: 'Médicos especialistas, clínicas, coordenadores científicos, sociedades e organizadores que ainda não sabem qual frente contratar.',
    centralCopy: 'Um portfólio para cada forma de autoridade médica.',
    strategy: 'A página não vende uma peça isolada. Ela apresenta a Longecta como operação híbrida de plataforma, serviço, curadoria, design e inteligência.',
    businessRole: 'Roteador de demanda e qualificação. Deve levar o visitante para Método, Congressos, Speaker Kit, Materiais ou planos conforme o objetivo.',
    structure: [
      'Hero de portfólio com promessa de autoridade médica.',
      'Três entradas principais: Para você, Para sua clínica e Para seu congresso.',
      'Explicação do modelo híbrido por camadas.',
      'Cards de soluções por segmento e CTAs específicos.',
      'Bloco final de escolha do ponto de partida.',
    ],
    assets: ['longecta-solutions-you.png', 'longecta-solutions-clinic.png', 'longecta-solutions-congress.png'],
    rebuild: ['Recriar os três caminhos comerciais.', 'Listar produtos como módulos com objetivo e melhor uso.', 'Preservar a tese de plataforma + serviço + inteligência.'],
  },
  {
    id: 'materiais',
    path: '/materiais',
    name: 'Materiais Longecta',
    family: 'Longecta',
    purpose: 'Mostruário visual e prova de execução para materiais físicos, cenografia, palco, estandes, sinalização e kit técnico.',
    audience: 'Organizadores de eventos, sociedades médicas, patrocinadores, produtoras e decisores que precisam visualizar padrão premium.',
    centralCopy: 'Mostruário visual para ambientes científicos premium.',
    strategy: 'Reposicionar “artes” como sistema visual de ambiente científico. Isso protege margem e mostra que a Longecta atua entre estratégia, design e produção.',
    businessRole: 'Reduzir risco percebido e vender pacotes visuais de evento, sponsor e palco sem assumir impressão, montagem ou marcenaria.',
    structure: [
      'Hero focado em materiais e ambientes premium.',
      'Mostruário com exemplos de sistema de peças, palco e estande.',
      'Lista de serviços: cenografia, 3D, totens, patrocinadores e kit técnico.',
      'Processo do briefing técnico aos arquivos finais.',
      'Valor agregado: percepção, aprovação, consistência e redução de improviso.',
    ],
    assets: ['longecta-materials-stage.png', 'longecta-materials-stand.png', 'longecta-materials-system.png'],
    rebuild: ['Declarar o que a Longecta faz e o que não faz.', 'Mostrar processo técnico para fornecedores.', 'Usar imagens grandes para prova visual.'],
  },
  {
    id: 'publicity',
    path: '/publicity',
    name: 'Longecta Publicity',
    family: 'Longecta',
    purpose: 'Página premium para captação, autoridade pública e posicionamento de líderes médicos, cursos, congressos e sociedades.',
    audience: 'Médicos palestrantes, donos de cursos, donos de congressos, sociedades médicas e lideranças que precisam captar com autoridade.',
    centralCopy: 'A estrutura premium para líderes médicos captarem com autoridade.',
    strategy: 'Criar uma categoria acima de marketing: publicity médico estratégico. A página vende sistema de percepção e captação, não posts.',
    businessRole: 'Abrir conversas consultivas de alto valor para cursos, congressos, palestrantes e sociedades médicas.',
    structure: [
      'Hero black premium com promessa de captação e autoridade.',
      'Públicos-alvo: palestrantes, cursos, congressos e sociedades.',
      'Sistema em quatro camadas: estratégia, plataforma, design e execução.',
      'Lista de entregáveis executivos.',
      'Diagnóstico e download de dossiê executivo.',
    ],
    assets: ['longecta-publicity-product-black.png', 'longecta-publicity-doctor-phone.png', 'longecta-publicity-congress-stage.png', 'longecta-publicity-strategy-room.png'],
    rebuild: ['Manter estética black premium.', 'Preservar frase “não vendemos posts”.', 'Conectar captação com produto, serviço, consultoria e plataforma.'],
  },
  {
    id: 'systems',
    path: '/systems',
    name: 'Longecta Systems',
    family: 'Longecta',
    purpose: 'Página para vender sistemas, plataformas, integrações e IA aplicada a operações médicas premium.',
    audience: 'Congressos, cursos, comunidades, sociedades médicas e operações que precisam de tecnologia sob medida ou módulos prontos.',
    centralCopy: 'Sistemas sob medida para negócios médicos de alto valor.',
    strategy: 'Mostrar que a Longecta começa pelo negócio, não pelo código. A tecnologia aparece como consequência de arquitetura, diagnóstico e operação real.',
    businessRole: 'Captar projetos de plataforma, portal, área de membros, CRM, dashboard, IA e integração.',
    structure: [
      'Hero black premium com promessa de sistemas para negócios médicos.',
      'Públicos e necessidades: congressos, cursos, sociedades e operações premium.',
      'Modos de solução: produto pronto, sob medida, integrações e IA aplicada.',
      'Processo de diagnóstico, arquitetura, protótipo, desenvolvimento e implantação.',
      'CTA para diagnóstico Longecta Systems.',
    ],
    assets: ['longecta-systems-hero.png', 'longecta-systems-command.png', 'longecta-systems-workshop.png'],
    rebuild: ['Preservar tese “não começamos pelo código”.', 'Explicar modalidades de produto pronto e sistema sob medida.', 'Usar visual escuro para tecnologia premium.'],
  },
  {
    id: 'progress',
    path: '/progress',
    name: 'Longecta Progress',
    family: 'Longecta',
    purpose: 'Página de timeline para explicar a experiência Longecta do diagnóstico ao próximo ciclo de crescimento.',
    audience: 'Leads que precisam entender processo, sequência, etapas e como a Longecta acompanha evolução de projetos.',
    centralCopy: 'A experiência Longecta organizada como progresso estratégico.',
    strategy: 'Transformar serviço consultivo em jornada visual. A página reduz incerteza sobre “como funciona” e reforça continuidade.',
    businessRole: 'Apoiar vendas consultivas, onboarding e entendimento do método de trabalho.',
    structure: [
      'Hero com promessa de evolução.',
      'Linha do tempo da entrada ao próximo ciclo.',
      'Etapas de diagnóstico, estratégia, execução, aprovação e memória.',
      'Blocos de valor para o cliente entender cadência.',
      'CTAs para Método, Soluções, Congressos e Planos.',
    ],
    assets: ['Elementos infográficos, timeline e cards de progresso.'],
    rebuild: ['Recriar uma timeline clara.', 'Mostrar entregas por fase.', 'Conectar jornada com Método Longecta.'],
  },
  {
    id: 'metodo',
    path: '/metodo',
    name: 'Método Longecta',
    family: 'Longecta',
    purpose: 'Página-mãe de posicionamento da Longecta como estrutura híbrida de autoridade médica.',
    audience: 'Médicos, clínicas, professores, palestrantes, instituições e eventos com repertório disperso e pouco reaproveitado.',
    centralCopy: 'Transformamos conhecimento médico em autoridade pública, presença e crescimento.',
    strategy: 'Criar categoria. A Longecta não é apenas software, agência ou IA: é uma operação de acervo, curadoria, design, serviço e inteligência.',
    businessRole: 'Elevar preço percebido, justificar recorrência e educar o mercado para produtos modulares.',
    structure: [
      'Hero conceitual com promessa de autoridade.',
      'Problema: repertório disperso e valor invisível.',
      'Pilares: plataforma, serviço e inteligência contextual.',
      'Método em etapas: envio, organização, IA, acabamento, aprovação e memória.',
      'Diferenciação contra IA avulsa, Drive e agência tradicional.',
    ],
    assets: ['Imagens editoriais de acervo, médico, tecnologia e bastidores.'],
    rebuild: ['Preservar a tese de categoria híbrida.', 'Explicar claramente as camadas do método.', 'Usar como ponte para Congressos e Planos.'],
  },
  {
    id: 'congressos',
    path: '/congressos',
    name: 'Longecta Congressos',
    family: 'Longecta',
    purpose: 'Landing vertical para transformar congressos médicos em marcas científicas de valor.',
    audience: 'Organizadores, sociedades, coordenadores científicos, patrocinadores e comissões de congressos médicos.',
    centralCopy: 'Transformamos congressos médicos em marcas científicas que vendem valor.',
    strategy: 'Defender a tese “congresso como marca científica”. A página vende planejamento, campanha, patrocinador, experiência e legado.',
    businessRole: 'Captar tickets maiores e recorrência anual por evento: pré-evento, campanha, operação, relatório e próxima edição.',
    structure: [
      'Hero com imagem de palco e promessa de marca científica.',
      'Dor: congresso relevante, comunicação abaixo do potencial.',
      'Linha do tempo T-180 a D+45.',
      'Pilares: posicionamento, sistema visual, campanha, programa científico, patrocinadores e legado.',
      'Portfólio de produtos e FAQ.',
    ],
    assets: ['longecta-congress-stage.png', 'longecta-congress-speaker.png', 'longecta-congress-networking.png', 'longecta-congress-expo.png'],
    rebuild: ['Recriar timeline T-180 a D+45.', 'Manter portfólio de produtos para congressos.', 'Vincular patrocinadores, speakers e legado.'],
  },
  {
    id: 'speaker-kit',
    path: '/speaker-visibility-kit',
    name: 'Speaker Visibility Kit',
    family: 'Longecta',
    purpose: 'Produto de entrada para ativar palestrantes como ativos de alcance e prestígio em congressos.',
    audience: 'Organizadores, sociedades, eventos patrocinados e equipes de comunicação com corpo docente forte e pouco ativado.',
    centralCopy: 'Transforme palestrantes em ativos de divulgação, autoridade e inscrição.',
    strategy: 'Produto simples de entender, fácil de aprovar e com impacto visível. Resolve uma dor clara: palestrantes subutilizados.',
    businessRole: 'Entrada comercial para vender Longecta Congressos, Communication 360, Sponsor Report e Event Brain.',
    structure: [
      'Hero com promessa direta para palestrantes.',
      'Benefícios para speaker, congresso e audiência.',
      'Workflow de coleta, kit, aprovação, publicação e legado.',
      'Entregáveis: cards, mini bio, legendas, LinkedIn, stories e hub.',
      'Comparação antes/depois e CTA para diagnóstico.',
    ],
    assets: ['longecta-speakers-hero.jpg', 'longecta-speakers-audience.jpg', 'longecta-speakers-backstage.jpg'],
    rebuild: ['Manter foco em kit por palestrante.', 'Listar entregáveis compartilháveis.', 'Mostrar workflow operacional por status.'],
  },
  {
    id: 'palestrantes',
    path: '/palestrantes',
    name: 'Longecta para Palestrantes',
    family: 'Longecta',
    purpose: 'Página para posicionar médicos palestrantes como marcas científicas de alto valor.',
    audience: 'Speakers médicos, professores, moderadores e especialistas que desejam mais convites, presença e materiais profissionais.',
    centralCopy: 'Transforme palestrantes médicos em marcas científicas de alto valor.',
    strategy: 'A página amplia o Speaker Kit para uma solução de posicionamento pessoal, ativos comerciais e presença antes/depois do palco.',
    businessRole: 'Captar médicos individuais e também vender solução para congressos que precisam valorizar corpo docente.',
    structure: [
      'Hero com imagem de palestrante e promessa de marca científica.',
      'Problemas de apresentação pública fraca.',
      'Sistema: posicionamento, perfil executivo, kit de congresso e ativos comerciais.',
      'Fluxo de diagnóstico, território, ativos e distribuição.',
      'Entregáveis e CTA para diagnóstico.',
    ],
    assets: ['longecta-speakers-hero.jpg', 'longecta-speakers-backstage.jpg', 'longecta-speakers-audience.jpg'],
    rebuild: ['Preservar tese de speaker como ativo.', 'Explicar diferença entre nome forte e apresentação forte.', 'Conectar com Publicity e Congressos.'],
  },
  {
    id: 'patrocinadores',
    path: '/patrocinadores',
    name: 'Longecta para Patrocinadores',
    family: 'Longecta',
    purpose: 'Página para elevar a percepção de patrocinadores em sites, materiais, redes e pós-evento.',
    audience: 'Organizadores de congressos e equipes comerciais que precisam vender, valorizar e renovar patrocínios.',
    centralCopy: 'Patrocinador precisa ser percebido como parte do valor científico.',
    strategy: 'Mostrar que patrocínio bom é contexto, não poluição visual. A marca aparece melhor quando conectada à programação, palestrantes e legado.',
    businessRole: 'Gerar demanda para Sponsor Visibility Kit, Materiais, Sponsor Report e Congress Communication.',
    structure: [
      'Hero com promessa de patrocinador como valor científico.',
      'Tese: patrocinador sustenta o congresso, speaker sustenta atenção.',
      'Sistema de percepção para site, materiais, redes e relatório.',
      'Mapa de presença por ponto de contato.',
      'CTA para diagnóstico e kit de visibilidade.',
    ],
    assets: ['longecta-sponsors-hero.jpg', 'longecta-sponsors-materials.jpg'],
    rebuild: ['Preservar tese de contexto científico.', 'Listar pontos de presença.', 'Conectar com Materials e Sponsor Visibility Kit.'],
  },
  {
    id: 'sponsor-visibility',
    path: '/sponsor-visibility-kit',
    name: 'Sponsor Visibility Kit',
    family: 'Longecta',
    purpose: 'Página de pacote operacional para organizar entregas de visibilidade de patrocinadores antes, durante e depois do evento.',
    audience: 'Organizadores e equipes comerciais que precisam demonstrar valor entregue a patrocinadores.',
    centralCopy: 'Um kit para transformar presença de patrocinador em percepção, entrega e prova.',
    strategy: 'Tangibilizar o valor do patrocinador em entregáveis concretos: site, materiais, redes, ativações e relatório.',
    businessRole: 'Produto vendável de escopo claro, com upsell natural para Materiais, Sponsor Report e Congressos.',
    structure: [
      'Hero com promessa de kit de visibilidade.',
      'Descrição de entregas por canal.',
      'Antes/durante/depois do evento.',
      'Checklist de peças e relatório.',
      'CTA para diagnóstico de patrocinadores.',
    ],
    assets: ['longecta-sponsors-hero.jpg', 'longecta-sponsors-materials.jpg'],
    rebuild: ['Manter formato de kit com entregáveis.', 'Explicar canais e momentos.', 'Evidenciar relatório pós-evento.'],
  },
  {
    id: 'doctor-next-level',
    path: '/doctor-next-level',
    name: 'Doctor Next Level',
    family: 'Longecta Academy',
    purpose: 'Página de lançamento do curso e plataforma para médicos aprenderem o mercado de congressos, cursos, palestras, autoridade e receita educacional.',
    audience: 'Médicos especialistas, professores, preceptores, palestrantes e donos de cursos que querem fazer nome e gerar novas oportunidades.',
    centralCopy: 'O curso para médicos que querem dominar congressos, cursos e autoridade científica.',
    strategy: 'Criar uma nova frente educacional da Longecta. Em vez de vender apenas serviço, a marca ensina médicos a enxergar e atuar no mercado de educação médica.',
    businessRole: 'Produto escalável de curso/plataforma, capaz de gerar receita direta, educar o mercado e nutrir leads para Publicity, Congressos e Systems.',
    structure: [
      'Hero com médico em palco e promessa de próximo nível.',
      'Seção de mercado invisível da educação médica.',
      'Oportunidades: congressos, cursos, palestras e marca médica.',
      'Currículo com 8 módulos.',
      'Plataforma com aulas, templates, playbooks e exemplos.',
      'Mapa de valor, perfis de aluno, diferenciais e lista de interesse.',
    ],
    assets: ['doctor-next-level-hero.png', 'doctor-next-level-platform.png'],
    rebuild: ['Preservar os 8 módulos do curso.', 'Explicar que é curso + plataforma.', 'Conectar com Longecta Publicity, Congressos e Método.'],
  },
];

const now = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeZone: 'America/Sao_Paulo',
}).format(new Date());

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const list = items => `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

const metric = (label, value) => `
  <div class="metric">
    <b>${escapeHtml(label)}</b>
    <span>${escapeHtml(value)}</span>
  </div>
`;

const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();

const stripTags = html => normalize(String(html || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
const attr = (tag, name) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
};
const collectMatches = (html, regex, mapper) => {
  const out = [];
  let match;
  while ((match = regex.exec(html)) && out.length < 60) out.push(mapper(match));
  return out.filter(Boolean);
};

const captured = [];

for (const item of pages) {
  const url = `${baseUrl}${item.path}`;
  const screenshotPath = path.join(screenshotDir, `${item.id}-hero.png`);
  if (skipLiveCapture) {
    captured.push({
      ...item,
      title: item.name,
      height: 'captura ao vivo ignorada',
      headings: item.structure.map((text, index) => ({ level: index === 0 ? 'H1' : 'H2', text })),
      ctas: ['Diagnóstico', 'Entrar em contato', 'Ver solução relacionada'],
      images: item.assets.map(asset => ({ src: asset, alt: '' })),
      bodySample: `${item.centralCopy} ${item.purpose} ${item.strategy}`,
      screenshotPath: '',
    });
    continue;
  }
  const profileDir = path.join(auditDir, `.chrome-profile-${item.id}`);
  fs.rmSync(profileDir, { recursive: true, force: true });
  fs.mkdirSync(profileDir, { recursive: true });
  execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profileDir}`,
    '--window-size=1440,980',
    '--virtual-time-budget=2500',
    `--screenshot=${screenshotPath}`,
    url,
  ], { stdio: 'ignore' });

  let dom = '';
  try {
    dom = execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profileDir}-dom`,
      '--window-size=1440,980',
      '--virtual-time-budget=2500',
      '--dump-dom',
      url,
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    dom = '';
  }

  const headings = collectMatches(dom, /<(h[123])[^>]*>([\s\S]*?)<\/\1>/gi, match => ({
    level: match[1].toUpperCase(),
    text: stripTags(match[2]),
  })).filter(h => h.text).slice(0, 42);
  const ctas = collectMatches(dom, /<(a|button)[^>]*>([\s\S]*?)<\/\1>/gi, match => stripTags(match[2])).filter(Boolean).slice(0, 60);
  const images = collectMatches(dom, /<img[^>]*>/gi, match => ({
    src: attr(match[0], 'src'),
    alt: attr(match[0], 'alt'),
  })).filter(img => img.src).slice(0, 24);
  const bodySample = stripTags(dom.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '').slice(0, 3200);
  captured.push({
    ...item,
    title: 'Lon Suite 4.0',
    height: 'capturada por Chrome headless',
    headings,
    ctas,
    images,
    bodySample,
    screenshotPath,
  });
}

const toc = captured.map((item, index) => `
  <tr>
    <td>${index + 1}</td>
    <td>${escapeHtml(item.name)}</td>
    <td>${escapeHtml(item.family)}</td>
    <td>${escapeHtml(item.purpose)}</td>
  </tr>
`).join('');

const pagesHtml = captured.map((item, index) => {
  const visibleHeadings = item.headings.map(h => `${h.level}: ${h.text}`).slice(0, 18);
  const visibleCtas = [...new Set(item.ctas.map(normalize).filter(Boolean))]
    .filter(cta => cta.length <= 90)
    .slice(0, 20);
  const visibleImages = item.images.map(img => `${img.src}${img.alt ? ` - alt: ${img.alt}` : ''}`);
  const screenshot = pathToFileURL(item.screenshotPath).href;
  return `
    <section class="page-section">
      <div class="page-kicker">${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.family)}</div>
      <h2>${escapeHtml(item.name)}</h2>
      <p class="lead">${escapeHtml(item.purpose)}</p>
      ${item.screenshotPath ? `<img class="screenshot" src="${screenshot}" alt="Screenshot da página ${escapeHtml(item.name)}">` : '<div class="screenshot placeholder">Preview visual omitido nesta versão rápida. A seção abaixo documenta imagens, copy, estrutura e estratégia para reconstrução.</div>'}

      <div class="metrics">
        ${metric('Público', item.audience)}
        ${metric('Copy central', item.centralCopy)}
        ${metric('Papel de negócio', item.businessRole)}
        ${metric('Altura capturada', `${item.height}px de página renderizada`)}
      </div>

      <h3>Estratégia da página</h3>
      <p>${escapeHtml(item.strategy)}</p>

      <h3>Estrutura para reconstrução</h3>
      ${list(item.structure)}

      <h3>Imagens e linguagem visual</h3>
      ${list(item.assets)}

      <h3>Como reconstruir se o site for perdido</h3>
      ${list(item.rebuild)}

      <div class="two-col">
        <div>
          <h3>Headings encontrados</h3>
          ${list(visibleHeadings.length ? visibleHeadings : ['Nenhum heading capturado.'])}
        </div>
        <div>
          <h3>CTAs e navegação</h3>
          ${list(visibleCtas.length ? visibleCtas : ['Nenhum CTA capturado.'])}
        </div>
      </div>

      <h3>Arquivos de imagem usados na página</h3>
      ${list(visibleImages.length ? visibleImages : ['Nenhuma imagem HTML capturada.'])}

      <h3>Amostra textual extraída</h3>
      <p class="sample">${escapeHtml(item.bodySample)}</p>
    </section>
  `;
}).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Documentação Completa Longecta</title>
  <style>
    @page { size: A4; margin: 15mm 13mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, Arial, Helvetica, sans-serif;
      color: #141416;
      background: #fff;
      font-size: 10.7px;
      line-height: 1.48;
    }
    h1, h2, h3, p { margin: 0; }
    h1 {
      max-width: 760px;
      font-size: 40px;
      line-height: 0.98;
      font-weight: 300;
      letter-spacing: 0;
    }
    h2 {
      font-size: 25px;
      line-height: 1.04;
      font-weight: 500;
      letter-spacing: 0;
      margin-bottom: 9px;
    }
    h3 {
      font-size: 12.4px;
      line-height: 1.2;
      font-weight: 760;
      letter-spacing: .06em;
      text-transform: uppercase;
      margin: 15px 0 6px;
    }
    p { margin-bottom: 8px; }
    ul { margin: 6px 0 0 17px; padding: 0; }
    li { margin-bottom: 4px; }
    table { border-collapse: collapse; width: 100%; }
    th {
      text-align: left;
      text-transform: uppercase;
      letter-spacing: .08em;
      font-size: 8.6px;
      color: #696970;
      border-bottom: 1px solid #d9d9df;
      padding: 6px;
    }
    td {
      vertical-align: top;
      border-bottom: 1px solid #ececf0;
      padding: 7px 6px;
    }
    .cover {
      min-height: 267mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      break-after: page;
    }
    .eyebrow, .page-kicker {
      color: #8a7563;
      text-transform: uppercase;
      letter-spacing: .18em;
      font-weight: 800;
      font-size: 8.5px;
      margin-bottom: 13px;
    }
    .subtitle {
      max-width: 670px;
      margin-top: 20px;
      color: #56565c;
      font-size: 14.5px;
      line-height: 1.45;
    }
    .date {
      margin-top: 28px;
      color: #74747b;
    }
    .overview {
      break-after: page;
    }
    .overview h2 {
      margin-bottom: 14px;
    }
    .page-section {
      break-before: page;
      padding-top: 1mm;
    }
    .lead {
      max-width: 760px;
      color: #4b4b52;
      font-size: 12.8px;
      line-height: 1.45;
      margin-bottom: 12px;
    }
    .screenshot {
      width: 100%;
      height: 86mm;
      object-fit: cover;
      object-position: top;
      border: 1px solid #dedee4;
      border-radius: 7px;
      margin: 7px 0 12px;
    }
    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #6d6258;
      background: #f4efe8;
      padding: 12px;
    }
    .metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 8px 0 9px;
    }
    .metric {
      border: 1px solid #e6e2dc;
      border-radius: 7px;
      background: #fbfaf8;
      padding: 9px;
      min-height: 55px;
    }
    .metric b {
      display: block;
      color: #8a7563;
      text-transform: uppercase;
      letter-spacing: .1em;
      font-size: 8.4px;
      margin-bottom: 4px;
    }
    .metric span {
      color: #29292d;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .sample {
      color: #58585f;
      border-top: 1px solid #e7e7ec;
      padding-top: 8px;
      font-size: 9.5px;
      max-height: 32mm;
      overflow: hidden;
    }
    .callout {
      border-left: 3px solid #111113;
      padding-left: 12px;
      color: #44444a;
      max-width: 780px;
      margin: 18px 0;
      font-size: 12.5px;
    }
  </style>
</head>
<body>
  <section class="cover">
    <div class="eyebrow">Longecta · documentação de preservação</div>
    <h1>Documentação completa das páginas Longecta e Lon Suite</h1>
    <p class="subtitle">Inventário estratégico para reconstrução: propósito, copy, estrutura, público, imagens, CTAs, estratégia de negócio e amostra textual de cada página pública criada no site.</p>
    <p class="date">Gerado em ${escapeHtml(now)} · Fonte local: ${escapeHtml(baseUrl)}</p>
  </section>

  <section class="overview">
    <h2>Visão geral do ecossistema</h2>
    <p class="callout">O site funciona como um sistema comercial em camadas. A Lon Suite vende a plataforma de acervo científico. A Longecta vende método, autoridade, congressos, publicidade, sistemas, materiais, palestrantes, patrocinadores e agora educação escalável com o Doctor Next Level.</p>
    <table>
      <thead>
        <tr><th style="width:8%">#</th><th style="width:22%">Página</th><th style="width:16%">Família</th><th>Função</th></tr>
      </thead>
      <tbody>${toc}</tbody>
    </table>
  </section>

  ${pagesHtml}
</body>
</html>`;

const htmlPath = path.join(auditDir, 'documentacao-completa-longecta.html');
const pdfPath = path.join(auditDir, 'documentacao-completa-longecta.pdf');
const jsonPath = path.join(auditDir, 'documentacao-completa-longecta-data.json');
fs.writeFileSync(htmlPath, html);
fs.writeFileSync(jsonPath, JSON.stringify(captured, null, 2));

if (skipLiveCapture || process.env.LONGECTA_PDF_ENGINE === 'jspdf') {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 46;
  const usable = pageWidth - margin * 2;
  let y = margin;

  const addPageIfNeeded = (space = 40) => {
    if (y + space <= pageHeight - margin) return;
    doc.addPage();
    y = margin;
  };
  const writeWrapped = (text, size = 10.5, style = 'normal', gap = 7) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text || ''), usable);
    for (const line of lines) {
      addPageIfNeeded(size + 8);
      doc.text(line, margin, y);
      y += size + 4;
    }
    y += gap;
  };
  const writeTitle = (text, size = 22) => {
    addPageIfNeeded(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text || ''), usable);
    for (const line of lines) {
      doc.text(line, margin, y);
      y += size + 6;
    }
    y += 10;
  };
  const writeLabel = text => {
    addPageIfNeeded(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(126, 98, 72);
    doc.text(String(text || '').toUpperCase(), margin, y);
    doc.setTextColor(20, 20, 22);
    y += 18;
  };
  const writeBullets = items => {
    for (const item of items || []) {
      addPageIfNeeded(24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(String(item || ''), usable - 14);
      doc.text('-', margin, y);
      doc.text(lines, margin + 14, y);
      y += lines.length * 14 + 4;
    }
    y += 4;
  };

  writeLabel('Longecta - documentacao de preservacao');
  writeTitle('Documentacao completa das paginas Longecta e Lon Suite', 28);
  writeWrapped(`Gerado em ${now}. Inventario estrategico para reconstruir o site se necessario: proposito, copy, publico, estrategia, estrutura, assets e CTAs de cada pagina.`, 12);
  writeTitle('Visao geral', 18);
  writeWrapped('A Lon Suite vende a plataforma de acervo cientifico. A Longecta vende metodo, autoridade, congressos, publicidade, sistemas, materiais, palestrantes, patrocinadores e educacao escalavel com Doctor Next Level.', 11);
  writeTitle('Paginas documentadas', 15);
  writeBullets(captured.map((item, index) => `${index + 1}. ${item.name} (${item.family}) - ${item.purpose}`));

  for (const item of captured) {
    doc.addPage();
    y = margin;
    writeLabel(item.family);
    writeTitle(item.name, 22);
    writeWrapped(item.purpose, 11.5, 'bold');
    writeLabel('Publico principal');
    writeWrapped(item.audience);
    writeLabel('Copy central');
    writeWrapped(item.centralCopy, 11, 'bold');
    writeLabel('Estrategia');
    writeWrapped(item.strategy);
    writeLabel('Papel de negocio');
    writeWrapped(item.businessRole);
    writeLabel('Estrutura da pagina');
    writeBullets(item.structure);
    writeLabel('Imagens e linguagem visual');
    writeBullets(item.assets);
    writeLabel('Como reconstruir');
    writeBullets(item.rebuild);
    writeLabel('Headings/estrutura capturada');
    writeBullets((item.headings || []).slice(0, 12).map(h => `${h.level}: ${h.text}`));
    writeLabel('CTAs principais');
    writeBullets((item.ctas || []).slice(0, 10));
    writeLabel('Amostra textual');
    writeWrapped(item.bodySample, 9.5);
  }

  doc.save(pdfPath);
  console.log(JSON.stringify({ pdfPath, htmlPath, jsonPath, engine: 'jspdf' }, null, 2));
  process.exit(0);
}

execFileSync(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${path.join(auditDir, '.chrome-profile-pdf')}`,
  '--print-to-pdf-no-header',
  `--print-to-pdf=${pdfPath}`,
  pathToFileURL(htmlPath).href,
], { stdio: 'ignore' });

console.log(JSON.stringify({ pdfPath, htmlPath, jsonPath, screenshotDir }, null, 2));
