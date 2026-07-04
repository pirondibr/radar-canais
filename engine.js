/*
 * engine.js — Núcleo da metodologia "Fórmula de Potencial de Canais".
 * Porte fiel de engine.py para o navegador.
 *
 * Algoritmo Universal de Compatibilidade de Canais (Artigos 1 a 9):
 *   Empresa -> Produto -> Motores Psicológicos -> Variáveis Contextuais
 *   -> Motores Ajustados -> Compatibilidade -> Potencial Teórico
 *   -> Execução (Mercado Real) -> Oportunidade -> Estratégia
 *
 * As pessoas não compram produtos. As pessoas compram motores psicológicos.
 * Os canais são ambientes que maximizam determinados motores.
 */

// ---------------------------------------------------------------------------
// 1. TAXONOMIA DE MOTORES PSICOLÓGICOS (Artigo 2)
// ---------------------------------------------------------------------------
export const MOTORES = {
  necessidade: "Sobrevivência", urgencia: "Sobrevivência", seguranca: "Sobrevivência",
  economia: "Sobrevivência", conveniencia: "Sobrevivência",
  confianca: "Confiança", autoridade: "Confiança", prova_social: "Confiança",
  proximidade: "Confiança", reputacao: "Confiança",
  aspiracao: "Crescimento", ganho_financeiro: "Crescimento", escala: "Crescimento",
  performance: "Crescimento", liberdade: "Crescimento",
  comunidade: "Social", status: "Social", reconhecimento: "Social",
  influencia: "Social", pertencimento: "Social",
  identidade: "Identidade", proposito: "Identidade", significado: "Identidade",
  expressao: "Identidade", valores: "Identidade",
  curiosidade: "Descoberta", descoberta: "Descoberta", inovacao: "Descoberta",
  surpresa: "Descoberta", tendencia: "Descoberta",
  transformacao: "Transformação", autoestima: "Transformação",
  educacao: "Cognitivo", entretenimento: "Cognitivo", networking: "Cognitivo",
};

export const MOTOR_LABEL = {
  necessidade: "Necessidade", urgencia: "Urgência", seguranca: "Segurança",
  economia: "Economia", conveniencia: "Conveniência", confianca: "Confiança",
  autoridade: "Autoridade", prova_social: "Prova Social", proximidade: "Proximidade",
  reputacao: "Reputação", aspiracao: "Aspiração", ganho_financeiro: "Ganho Financeiro",
  escala: "Escala", performance: "Performance", liberdade: "Liberdade",
  comunidade: "Comunidade", status: "Status", reconhecimento: "Reconhecimento",
  influencia: "Influência", pertencimento: "Pertencimento", identidade: "Identidade",
  proposito: "Propósito", significado: "Significado", expressao: "Expressão",
  valores: "Valores", curiosidade: "Curiosidade", descoberta: "Descoberta",
  inovacao: "Inovação", surpresa: "Surpresa", tendencia: "Tendência",
  transformacao: "Transformação", autoestima: "Autoestima", educacao: "Educação",
  entretenimento: "Entretenimento", networking: "Networking",
};

// ---------------------------------------------------------------------------
// 2. TAXONOMIA DE CANAIS + MATRIZ CANAL × MOTOR (Artigos 3 e 6)
// ---------------------------------------------------------------------------
// horizonte: papel natural do canal (curto=caixa | medio=vantagem | longo=monopólio)
export const CANAIS = {
  "Google (SEO)": {
    classe: "Busca", horizonte: "longo",
    matriz: { necessidade: 10, urgencia: 8, confianca: 8, educacao: 9, economia: 7,
      autoridade: 8, proximidade: 6, seguranca: 7, aspiracao: 2, curiosidade: 1,
      transformacao: 3, comunidade: 1, status: 1, descoberta: 2, reputacao: 7 },
  },
  "Google Ads": {
    classe: "Busca", horizonte: "curto",
    matriz: { necessidade: 10, urgencia: 10, economia: 8, confianca: 8, proximidade: 7,
      seguranca: 7, conveniencia: 7, aspiracao: 2, transformacao: 3, curiosidade: 1, descoberta: 2 },
  },
  "Google Maps": {
    classe: "Busca", horizonte: "curto",
    matriz: { proximidade: 10, necessidade: 9, confianca: 9, urgencia: 8, reputacao: 8,
      prova_social: 8, conveniencia: 7, aspiracao: 1, curiosidade: 0, transformacao: 2 },
  },
  "Meta Ads": {
    classe: "Aspiração/Pago", horizonte: "curto",
    matriz: { aspiracao: 10, economia: 9, transformacao: 9, descoberta: 8, comunidade: 8,
      confianca: 7, curiosidade: 7, status: 7, ganho_financeiro: 8, autoridade: 6,
      necessidade: 5, identidade: 6, conveniencia: 6, surpresa: 6 },
  },
  "Instagram Orgânico": {
    classe: "Aspiração", horizonte: "longo",
    matriz: { transformacao: 10, aspiracao: 10, status: 9, identidade: 9, comunidade: 8,
      expressao: 8, tendencia: 7, confianca: 6, reconhecimento: 7, necessidade: 2, curiosidade: 5 },
  },
  "TikTok": {
    classe: "Descoberta", horizonte: "medio",
    matriz: { descoberta: 10, curiosidade: 10, tendencia: 9, entretenimento: 9, inovacao: 9,
      surpresa: 9, transformacao: 8, aspiracao: 6, confianca: 3, necessidade: 1 },
  },
  "YouTube": {
    classe: "Educação", horizonte: "longo",
    matriz: { educacao: 10, autoridade: 10, confianca: 9, significado: 9, aspiracao: 7,
      comunidade: 6, transformacao: 6, performance: 7, reputacao: 7, necessidade: 3 },
  },
  "Influenciadores": {
    classe: "Confiança", horizonte: "medio",
    // Influenciadores também são um ambiente de DESCOBERTA: mostram produtos
    // novos, surpreendentes e divertidos (unboxing, "olha isso", tendências).
    // Os artigos listam "Cama na caixa" como caso top de influenciador.
    matriz: { confianca: 10, prova_social: 9, aspiracao: 9, status: 8, identidade: 8,
      comunidade: 8, transformacao: 8, surpresa: 8, descoberta: 8, tendencia: 8,
      inovacao: 8, curiosidade: 8, reputacao: 7, entretenimento: 6 },
  },
  "LinkedIn": {
    classe: "Autoridade", horizonte: "medio",
    matriz: { autoridade: 10, status: 9, networking: 8, educacao: 8, escala: 8,
      ganho_financeiro: 8, economia: 7, performance: 7, reputacao: 7, transformacao: 2 },
  },
  "WhatsApp / Indicações": {
    classe: "Conversão/Confiança", horizonte: "medio",
    matriz: { confianca: 10, proximidade: 9, conveniencia: 9, prova_social: 9,
      comunidade: 7, urgencia: 7, seguranca: 6 },
  },
  "Podcasts": {
    classe: "Educação", horizonte: "longo",
    matriz: { educacao: 10, autoridade: 9, significado: 9, comunidade: 8, confianca: 8,
      proposito: 8, aspiracao: 6 },
  },
};

// ---------------------------------------------------------------------------
// 3. DADOS DE EXECUÇÃO (Artigo 4) — escala 1 a 10
// ---------------------------------------------------------------------------
export const EXECUCAO = {
  "Google (SEO)":          { dificuldade: 8, velocidade: 3, previsibilidade: 5, competicao: 6 },
  "Google Ads":            { dificuldade: 6, velocidade: 10, previsibilidade: 10, competicao: 8 },
  "Google Maps":           { dificuldade: 4, velocidade: 6, previsibilidade: 7, competicao: 5 },
  "Meta Ads":              { dificuldade: 5, velocidade: 10, previsibilidade: 9, competicao: 5 },
  "Instagram Orgânico":    { dificuldade: 9, velocidade: 1, previsibilidade: 4, competicao: 8 },
  "TikTok":                { dificuldade: 10, velocidade: 4, previsibilidade: 2, competicao: 7 },
  "YouTube":               { dificuldade: 9, velocidade: 1, previsibilidade: 5, competicao: 6 },
  "Influenciadores":       { dificuldade: 3, velocidade: 7, previsibilidade: 6, competicao: 5 },
  "LinkedIn":              { dificuldade: 6, velocidade: 5, previsibilidade: 6, competicao: 4 },
  "WhatsApp / Indicações": { dificuldade: 1, velocidade: 8, previsibilidade: 7, competicao: 3 },
  "Podcasts":              { dificuldade: 8, velocidade: 2, previsibilidade: 4, competicao: 4 },
};

// ---------------------------------------------------------------------------
// 4. VARIÁVEIS CONTEXTUAIS (Artigo 7) — multiplicadores por canal
// ---------------------------------------------------------------------------
export const CONTEXTO_MULT = {
  idade: {
    jovem:  { "TikTok": 1.35, "Instagram Orgânico": 1.20, "YouTube": 1.15, "Google (SEO)": 0.85, "Google Ads": 0.85 },
    adulto: { "Google (SEO)": 1.15, "Google Ads": 1.15, "Meta Ads": 1.15, "Instagram Orgânico": 1.10, "YouTube": 1.05 },
    maduro: { "Meta Ads": 1.30, "Google (SEO)": 1.15, "Google Ads": 1.15, "YouTube": 1.05, "TikTok": 0.70 },
    senior: { "Meta Ads": 1.30, "Google Ads": 1.15, "WhatsApp / Indicações": 1.25, "TikTok": 0.45, "Instagram Orgânico": 0.75 },
  },
  modelo: {
    B2C: { "TikTok": 1.20, "Instagram Orgânico": 1.20, "Meta Ads": 1.15, "LinkedIn": 0.40 },
    B2B: { "Google (SEO)": 1.20, "Google Ads": 1.15, "LinkedIn": 1.60, "Podcasts": 1.20, "TikTok": 0.45, "Instagram Orgânico": 0.75 },
  },
  alcance: {
    // Busca paga geograficamente segmentada é um dos ambientes mais fortes para
    // captar intenção local imediata (ex.: imobiliária, clínica). Por isso o Ads
    // recebe forte bônus em 'local' — perde só para o Maps (proximidade pura).
    local:    { "Google Maps": 1.60, "Google Ads": 1.40, "Google (SEO)": 1.20, "WhatsApp / Indicações": 1.25, "Meta Ads": 1.05, "TikTok": 0.80 },
    regional: { "Google Maps": 1.20, "Google Ads": 1.20, "Meta Ads": 1.10, "Instagram Orgânico": 1.05 },
    nacional: { "Google Maps": 0.20, "Meta Ads": 1.20, "TikTok": 1.25, "Instagram Orgânico": 1.15, "YouTube": 1.10 },
  },
  ticket: {
    baixo: { "TikTok": 1.20, "Meta Ads": 1.15, "Instagram Orgânico": 1.05, "YouTube": 0.85 },
    medio: { "Meta Ads": 1.10, "Google Ads": 1.05, "Instagram Orgânico": 1.05 },
    alto:  { "Google (SEO)": 1.10, "YouTube": 1.20, "Influenciadores": 1.15, "LinkedIn": 1.05, "WhatsApp / Indicações": 1.10, "TikTok": 0.85 },
  },
  visualidade: {
    baixa: { "Google (SEO)": 1.20, "Google Ads": 1.15, "LinkedIn": 1.10, "Instagram Orgânico": 0.75, "TikTok": 0.65 },
    media: { "Meta Ads": 1.05, "Instagram Orgânico": 1.05 },
    alta:  { "Instagram Orgânico": 1.30, "TikTok": 1.30, "Meta Ads": 1.15, "Influenciadores": 1.15, "Google (SEO)": 0.90 },
  },
  confianca_risco: {
    baixo:      {},
    medio:      { "Google (SEO)": 1.05, "Influenciadores": 1.05 },
    alto:       { "Google (SEO)": 1.15, "YouTube": 1.15, "Influenciadores": 1.10, "WhatsApp / Indicações": 1.15, "TikTok": 0.85 },
    muito_alto: { "Google (SEO)": 1.20, "YouTube": 1.20, "WhatsApp / Indicações": 1.25, "Google Maps": 1.10, "TikTok": 0.70 },
  },
  surpresa: {
    baixa: { "Google (SEO)": 1.10, "Google Ads": 1.05, "TikTok": 0.80 },
    media: { "Meta Ads": 1.05, "Instagram Orgânico": 1.05 },
    alta:  { "TikTok": 1.30, "Meta Ads": 1.15, "Influenciadores": 1.15, "Instagram Orgânico": 1.10, "Google (SEO)": 0.80 },
  },
  dor_desejo: {
    dor:    { "Google (SEO)": 1.20, "Google Ads": 1.20, "Google Maps": 1.15, "WhatsApp / Indicações": 1.05, "TikTok": 0.75 },
    misto:  { "Meta Ads": 1.05 },
    desejo: { "Instagram Orgânico": 1.25, "TikTok": 1.20, "Meta Ads": 1.15, "Influenciadores": 1.20, "Google (SEO)": 0.85 },
  },
  potencial_organico: {
    baixo: { "Meta Ads": 1.10, "Google Ads": 1.10, "Instagram Orgânico": 0.85, "TikTok": 0.85 },
    medio: {},
    alto:  { "Instagram Orgânico": 1.20, "TikTok": 1.20, "YouTube": 1.15, "Influenciadores": 1.10 },
  },
};

// Enumerações válidas — usadas também para validar a saída do LLM.
export const CONTEXTO_OPCOES = {
  idade: ["jovem", "adulto", "maduro", "senior"],
  modelo: ["B2C", "B2B"],
  alcance: ["local", "regional", "nacional"],
  ticket: ["baixo", "medio", "alto"],
  visualidade: ["baixa", "media", "alta"],
  confianca_risco: ["baixo", "medio", "alto", "muito_alto"],
  surpresa: ["baixa", "media", "alta"],
  dor_desejo: ["dor", "misto", "desejo"],
  potencial_organico: ["baixo", "medio", "alto"],
};

// ---------------------------------------------------------------------------
// 5. MOTOR DE CÁLCULO (Artigo 9 — etapas 4 a 8)
// ---------------------------------------------------------------------------
function multContexto(canal, contexto) {
  let mult = 1.0;
  for (const [variavel, valor] of Object.entries(contexto || {})) {
    const tabela = CONTEXTO_MULT[variavel];
    if (!tabela) continue;
    const opcao = tabela[valor];
    if (!opcao) continue;
    mult *= opcao[canal] ?? 1.0;
  }
  return mult;
}

function compatBase(canal, motores) {
  const matriz = CANAIS[canal].matriz;
  let raw = 0, maxRaw = 0;
  for (const [motor, peso] of Object.entries(motores)) {
    let score = matriz[motor];
    if (score === undefined && motor === "autoestima") score = matriz["transformacao"] ?? 0;
    if (score === undefined) score = 0;
    raw += peso * score;
    maxRaw += peso * 10;
  }
  return maxRaw === 0 ? 0 : (raw / maxRaw) * 100;
}

const round1 = (x) => Math.round(x * 10) / 10;

export function analisar(produto) {
  const canais = [];

  for (const canal of Object.keys(CANAIS)) {
    const base = compatBase(canal, produto.motores);
    const mult = multContexto(canal, produto.contexto);
    const potencialRaw = base * mult;

    const exe = EXECUCAO[canal];
    // Fatores de execução comprimidos (a execução MODULA o potencial).
    const velF = 0.60 + 0.40 * (exe.velocidade / 10);      // 0.64 .. 1.00
    const prevF = 0.60 + 0.40 * (exe.previsibilidade / 10); // 0.64 .. 1.00
    const difF = 1.30 - 0.60 * (exe.dificuldade / 10);      // 0.70 .. 1.24
    const compF = 1.20 - 0.50 * (exe.competicao / 10);      // 0.70 .. 1.15
    const fatorExec = velF * prevF * difF * compF;

    canais.push({
      canal, classe: CANAIS[canal].classe, horizonte: CANAIS[canal].horizonte,
      base: round1(base), mult_contexto: Math.round(mult * 100) / 100,
      potencial_raw: potencialRaw, fator_exec: fatorExec, execucao: exe,
    });
  }

  // Normalização relativa dentro do produto (melhor canal = 100).
  const maxPotRaw = Math.max(...canais.map((c) => c.potencial_raw)) || 1;
  for (const c of canais) {
    c.potencial = round1((c.potencial_raw / maxPotRaw) * 100);
    c.mercado_raw = c.potencial * c.fator_exec;
  }
  const maxMercRaw = Math.max(...canais.map((c) => c.mercado_raw)) || 1;
  for (const c of canais) {
    c.mercado = round1((c.mercado_raw / maxMercRaw) * 100);
    c.oportunidade = round1(c.potencial - c.mercado); // Oportunidade = Potencial - Mercado
  }

  const rankingPotencial = [...canais].sort((a, b) => b.potencial - a.potencial);
  const rankingMercado = [...canais].sort((a, b) => b.mercado - a.mercado);
  const rankingOportunidade = [...canais].sort((a, b) => b.oportunidade - a.oportunidade);
  const topMotores = Object.entries(produto.motores).sort((a, b) => b[1] - a[1]);

  return {
    produto, topMotores, canais,
    rankingPotencial, rankingMercado, rankingOportunidade,
    estrategia: montarEstrategia(canais),
  };
}

function montarEstrategia(canais) {
  const GATE = 25.0;
  const buckets = { curto: [], medio: [], longo: [] };
  for (const c of canais) {
    if (c.potencial >= GATE) buckets[c.horizonte].push(c);
  }
  buckets.curto.sort((a, b) => b.mercado - a.mercado);
  buckets.medio.sort((a, b) => b.oportunidade - a.oportunidade);
  buckets.longo.sort((a, b) => b.oportunidade - a.oportunidade);
  return {
    curto: buckets.curto.slice(0, 4),
    medio: buckets.medio.slice(0, 4),
    longo: buckets.longo.slice(0, 4),
  };
}
