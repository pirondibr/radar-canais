/*
 * openrouter.js — Integração com a API OpenRouter (Claude).
 *
 * O LLM NÃO faz a matemática. Ele apenas traduz a descrição em linguagem
 * natural do produto para os inputs estruturados que o motor determinístico
 * (engine.js) espera: motores psicológicos + pesos e variáveis contextuais.
 * Assim a metodologia dos 9 artigos permanece rigorosa e reproduzível.
 */

import { MOTOR_LABEL, CONTEXTO_OPCOES } from "./engine.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Modelos Claude disponíveis no OpenRouter (verificado em 07/2026).
export const MODELOS = [
  { id: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5 (recomendado)" },
  { id: "anthropic/claude-sonnet-5", label: "Claude Sonnet 5 (mais capaz)" },
  { id: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
  { id: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5 (rápido/barato)" },
  { id: "~anthropic/claude-sonnet-latest", label: "Claude Sonnet (sempre a mais recente)" },
];

export const MODELO_PADRAO = MODELOS[0].id;

function construirPrompt() {
  const motoresLista = Object.entries(MOTOR_LABEL)
    .map(([k, v]) => `${k} (${v})`)
    .join(", ");

  const contextoLista = Object.entries(CONTEXTO_OPCOES)
    .map(([k, vals]) => `${k}: ${vals.join(" | ")}`)
    .join("\n");

  return `Você é um estrategista de marketing especialista na metodologia "Teoria dos Motores Psicológicos".

PREMISSA CENTRAL: As pessoas não compram produtos, compram MOTORES PSICOLÓGICOS. Os canais de marketing são ambientes que maximizam determinados motores.

Sua tarefa: ler a descrição de um produto/empresa e devolver um JSON ESTRUTURADO com os motores psicológicos (com pesos) e as variáveis contextuais. NÃO calcule canais — apenas identifique motores e contexto.

MÉTODO (Artigo 5 — 5 perguntas):
1. O que a pessoa REALMENTE compra? (transformação, alívio, status...)
2. Qual emoção existe ANTES da compra?
3. Qual emoção existe DEPOIS da compra?
4. É comprado por DOR (resolver problema) ou DESEJO (tornar-se algo)?
5. É um produto CONHECIDO ou SURPREENDENTE?

MOTORES VÁLIDOS (use exatamente estas chaves):
${motoresLista}

Regras dos motores:
- Escolha entre 3 e 7 motores mais relevantes.
- Atribua um peso de 0 a 10 a cada (10 = motor primário dominante).
- Inclua sempre pelo menos os 3 motores primários com peso alto (8-10).

VARIÁVEIS CONTEXTUAIS (Artigo 7 — escolha exatamente um valor de cada, use as chaves exatas):
${contextoLista}

Guia rápido de contexto:
- idade: faixa etária predominante do comprador.
- modelo: B2C (consumidor final) ou B2B (empresas).
- alcance: local (bairro/cidade), regional (estado) ou nacional.
- ticket: baixo (<R$500), medio (R$500-5000), alto (>R$5000). Se não souber, estime pelo tipo de produto.
- visualidade: o produto pode ser demonstrado visualmente (antes/depois, estética)? baixa/media/alta.
- confianca_risco: quanto custa errar na compra? baixo/medio/alto/muito_alto (saúde, cirurgia = alto/muito_alto).
- surpresa: o produto causa efeito "uau"/novidade? baixa/media/alta.
- dor_desejo: comprado para PARAR de sofrer (dor), tornar-se algo (desejo), ou misto.
- potencial_organico: o nicho gera conteúdo naturalmente (estética, fitness = alto; ERP = baixo)?

FORMATO DE SAÍDA — responda APENAS com JSON válido, sem markdown, sem comentários:
{
  "nicho": "string",
  "empresa": "string",
  "produto": "string",
  "compra_real": "o que a pessoa realmente compra (1 frase)",
  "emocao_antes": "1-3 palavras",
  "emocao_depois": "1-3 palavras",
  "motores": { "chave_motor": peso_inteiro_0a10, ... },
  "contexto": {
    "idade": "...", "modelo": "...", "alcance": "...", "ticket": "...",
    "visualidade": "...", "confianca_risco": "...", "surpresa": "...",
    "dor_desejo": "...", "potencial_organico": "..."
  },
  "observacao": "1-2 frases sobre por que estes motores/canais fazem sentido para este produto",
  "justificativa": "raciocínio curto (2-4 frases) explicando as escolhas de motores e contexto"
}`;
}

function extrairJSON(texto) {
  // Remove cercas de código e captura o primeiro objeto {...}.
  let t = texto.trim();
  t = t.replace(/^```(?:json)?/i, "").replace(/```$/,"").trim();
  const inicio = t.indexOf("{");
  const fim = t.lastIndexOf("}");
  if (inicio === -1 || fim === -1) {
    throw new Error("A resposta do modelo não continha um JSON válido.");
  }
  return JSON.parse(t.slice(inicio, fim + 1));
}

/**
 * Chama a API OpenRouter e devolve o objeto Produto estruturado.
 * @param {object} opts { apiKey, modelo, descricaoUsuario }
 */
export async function extrairProduto({ apiKey, modelo, descricaoUsuario }) {
  const body = {
    model: modelo || MODELO_PADRAO,
    temperature: 0.2,
    messages: [
      { role: "system", content: construirPrompt() },
      { role: "user", content: descricaoUsuario },
    ],
  };

  let resp;
  try {
    resp = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": location.origin,
        "X-Title": "Radar de Canais Potenciais",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error("Falha de rede ao contatar o OpenRouter. Verifique sua conexão.");
  }

  if (!resp.ok) {
    let detalhe = "";
    try { detalhe = (await resp.json())?.error?.message || ""; } catch (_) {}
    if (resp.status === 401) throw new Error("API key inválida ou não autorizada (401). Confira a chave.");
    if (resp.status === 402) throw new Error("Créditos insuficientes no OpenRouter (402).");
    if (resp.status === 429) throw new Error("Limite de requisições atingido (429). Tente novamente em instantes.");
    throw new Error(`Erro do OpenRouter (${resp.status}). ${detalhe}`);
  }

  const data = await resp.json();
  const conteudo = data?.choices?.[0]?.message?.content;
  if (!conteudo) throw new Error("Resposta vazia do modelo.");

  const parsed = extrairJSON(conteudo);
  return normalizarProduto(parsed);
}

// Garante que motores/contexto vêm no formato certo e dentro dos valores válidos.
function normalizarProduto(p) {
  const motores = {};
  for (const [k, v] of Object.entries(p.motores || {})) {
    const peso = Math.max(0, Math.min(10, Number(v) || 0));
    if (MOTOR_LABEL[k] && peso > 0) motores[k] = peso;
  }
  if (Object.keys(motores).length === 0) {
    throw new Error("O modelo não identificou motores válidos. Detalhe melhor a descrição do produto.");
  }

  const contexto = {};
  for (const [variavel, valores] of Object.entries(CONTEXTO_OPCOES)) {
    const valor = p.contexto?.[variavel];
    contexto[variavel] = valores.includes(valor) ? valor : valores[Math.floor(valores.length / 2)];
  }

  return {
    nicho: p.nicho || "-",
    empresa: p.empresa || "-",
    produto: p.produto || "Produto",
    compra_real: p.compra_real || "-",
    emocao_antes: p.emocao_antes || "-",
    emocao_depois: p.emocao_depois || "-",
    motores,
    contexto,
    observacao: p.observacao || "",
    justificativa: p.justificativa || "",
  };
}
