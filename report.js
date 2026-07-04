/*
 * report.js — Gera o HTML do relatório a partir do resultado de engine.analisar().
 * Porte de relatorio.py. Exporta:
 *   - REPORT_CSS      : CSS do relatório (injetado na página e no download)
 *   - renderSecao()   : HTML de um produto (para exibir na página)
 *   - gerarStandalone(): documento HTML completo e autossuficiente (para download)
 */

import { MOTOR_LABEL, MOTORES } from "./engine.js";

function e(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function cor(v) {
  if (v >= 75) return "#22c55e";
  if (v >= 50) return "#84cc16";
  if (v >= 30) return "#eab308";
  if (v >= 15) return "#f97316";
  return "#ef4444";
}

function corOportunidade(v) {
  if (v >= 30) return "#a855f7";
  if (v >= 15) return "#6366f1";
  if (v >= 0) return "#475569";
  return "#334155";
}

function barra(valor, corHex, larguraMax = 100) {
  const pct = Math.max(0, Math.min(100, (valor / larguraMax) * 100));
  return `<div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${corHex}"></div></div>`;
}

const g = (n) => (Number.isInteger(n) ? String(n) : String(n));

function blocoMotores(res) {
  return res.topMotores.map(([motor, peso]) => {
    const label = MOTOR_LABEL[motor] || motor;
    const classe = MOTORES[motor] || "-";
    return `
      <div class="motor-row">
        <div class="motor-name">${e(label)} <span class="motor-classe">${e(classe)}</span></div>
        <div class="motor-bar">${barra(peso, "#38bdf8", 10)}</div>
        <div class="motor-val">${peso}</div>
      </div>`;
  }).join("");
}

function tabelaRanking(canais, chave, corFn) {
  return canais.map((c, i) => {
    const pos = i + 1;
    const valor = c[chave];
    const corHex = corFn(valor);
    const medalha = { 1: "medal-1", 2: "medal-2", 3: "medal-3" }[pos] || "";
    return `
      <div class="rank-row">
        <div class="rank-pos ${medalha}">${pos}</div>
        <div class="rank-canal">
          <span class="canal-nome">${e(c.canal)}</span>
          <span class="canal-classe">${e(c.classe)}</span>
        </div>
        <div class="rank-bar">${barra(Math.abs(valor), corHex)}</div>
        <div class="rank-val" style="color:${corHex}">${g(valor)}</div>
      </div>`;
  }).join("");
}

// Matriz enxuta — apenas a camada de Potencial (verdade psicológica).
function tabelaPotencial(res) {
  const canais = [...res.canais].sort((a, b) => b.potencial - a.potencial);
  return canais.map((c) => `
      <tr>
        <td class="td-canal">${e(c.canal)}<span class="td-classe">${e(c.classe)}</span></td>
        <td>${g(c.base)}</td>
        <td>×${g(c.mult_contexto)}</td>
        <td class="td-strong" style="color:${cor(c.potencial)}">${g(c.potencial)}</td>
      </tr>`).join("");
}

// --- Camada avançada (Mercado/Oportunidade/Estratégia) — reservada para reativação futura ---
function tabelaCompleta(res) {
  const canais = [...res.canais].sort((a, b) => b.potencial - a.potencial);
  return canais.map((c) => {
    const x = c.execucao;
    const sinal = c.oportunidade >= 0 ? "+" : "";
    return `
      <tr>
        <td class="td-canal">${e(c.canal)}<span class="td-classe">${e(c.classe)}</span></td>
        <td>${g(c.base)}</td>
        <td>×${g(c.mult_contexto)}</td>
        <td class="td-strong" style="color:${cor(c.potencial)}">${g(c.potencial)}</td>
        <td class="td-strong" style="color:${cor(c.mercado)}">${g(c.mercado)}</td>
        <td class="td-strong" style="color:${corOportunidade(c.oportunidade)}">${sinal}${g(c.oportunidade)}</td>
        <td class="td-exec">${x.dificuldade}</td>
        <td class="td-exec">${x.velocidade}</td>
        <td class="td-exec">${x.previsibilidade}</td>
        <td class="td-exec">${x.competicao}</td>
      </tr>`;
  }).join("");
}

function blocoEstrategia(res) {
  const est = res.estrategia;
  const chips = (canais, chave) => {
    if (!canais.length) return '<span class="chip-empty">Sem canais recomendados nesta faixa</span>';
    return canais.map((c) => {
      const sinal = chave === "oportunidade" && c[chave] >= 0 ? "+" : "";
      return `<span class="chip"><b>${e(c.canal)}</b><span class="chip-val">${sinal}${g(c[chave])}</span></span>`;
    }).join("");
  };
  return `
    <div class="estrategia-grid">
      <div class="est-card est-curto">
        <div class="est-head"><span class="est-icon">⚡</span> Curto prazo</div>
        <div class="est-sub">Gera caixa agora — rápido e previsível</div>
        <div class="chips">${chips(est.curto, "mercado")}</div>
      </div>
      <div class="est-card est-medio">
        <div class="est-head"><span class="est-icon">◈</span> Médio prazo</div>
        <div class="est-sub">Gera vantagem — oportunidade subexplorada</div>
        <div class="chips">${chips(est.medio, "oportunidade")}</div>
      </div>
      <div class="est-card est-longo">
        <div class="est-head"><span class="est-icon">♛</span> Longo prazo</div>
        <div class="est-sub">Gera monopólio — marca, orgânico e autoridade</div>
        <div class="chips">${chips(est.longo, "oportunidade")}</div>
      </div>
    </div>`;
}

const CTX_LABELS = {
  idade: "Idade", modelo: "Modelo", alcance: "Alcance", ticket: "Ticket",
  visualidade: "Visualidade", confianca_risco: "Risco/Confiança",
  surpresa: "Surpresa", dor_desejo: "Dor↔Desejo", potencial_organico: "Pot. orgânico",
};

export function renderSecao(res, idx = 1) {
  const p = res.produto;
  const topCanal = res.rankingPotencial[0];
  const motorDominante = res.topMotores[0] ? (MOTOR_LABEL[res.topMotores[0][0]] || res.topMotores[0][0]) : "-";

  const contextoHtml = Object.entries(p.contexto).map(([k, v]) => `
    <span class="ctx-tag"><span class="ctx-k">${e(CTX_LABELS[k] || k)}</span><span class="ctx-v">${e(v)}</span></span>`
  ).join("");

  const justificativa = p.justificativa
    ? `<div class="ai-box"><div class="ai-tag">Análise da IA</div><p>${e(p.justificativa)}</p></div>` : "";

  return `
  <section class="produto" id="produto-${idx}">
    <div class="produto-header">
      <div class="produto-tag">Nicho: ${e(p.nicho)}</div>
      <h2>${e(p.produto)}</h2>
      <div class="produto-empresa">${e(p.empresa)}</div>
      ${p.observacao ? `<p class="produto-obs">${e(p.observacao)}</p>` : ""}
    </div>

    <div class="cards-row">
      <div class="mini-card">
        <div class="mini-label">O que realmente compra</div>
        <div class="mini-value">${e(p.compra_real)}</div>
      </div>
      <div class="mini-card">
        <div class="mini-label">Emoção antes → depois</div>
        <div class="mini-value">${e(p.emocao_antes)} <span class="seta">→</span> ${e(p.emocao_depois)}</div>
      </div>
      <div class="mini-card destaque">
        <div class="mini-label">Canal nº 1 em potencial</div>
        <div class="mini-value">${e(topCanal.canal)} <span class="op-badge pot">${g(topCanal.potencial)}</span></div>
      </div>
      <div class="mini-card">
        <div class="mini-label">Motor dominante</div>
        <div class="mini-value">${e(motorDominante)}</div>
      </div>
    </div>

    ${justificativa}

    <div class="panel">
      <h3>1 · Motores Psicológicos</h3>
      <div class="motores">${blocoMotores(res)}</div>
    </div>

    <div class="panel">
      <h3>2 · Ranking de Potencial <span class="h3-sub">o que deveria funcionar (verdade psicológica)</span></h3>
      <div class="ranking">${tabelaRanking(res.rankingPotencial, "potencial", cor)}</div>
    </div>

    <div class="panel">
      <h3>3 · Matriz de Potencial <span class="h3-sub">compatibilidade × contexto</span></h3>
      <div class="tabela-wrap">
        <table class="matriz">
          <thead><tr>
            <th>Canal</th>
            <th title="Compatibilidade psicológica pura canal × motores">Compat.</th>
            <th title="Multiplicador das variáveis contextuais">Contexto</th>
            <th>Potencial</th>
          </tr></thead>
          <tbody>${tabelaPotencial(res)}</tbody>
        </table>
      </div>
    </div>

    <div class="panel contexto-panel">
      <h3>Contexto aplicado</h3>
      <div class="contexto-tags">${contextoHtml}</div>
    </div>
  </section>`;
}

const LEGENDA = `
  <div class="legenda">
    <div class="row"><b>Potencial</b> — a <b>verdade psicológica</b> do produto: compatibilidade pura entre os motores e cada canal, ajustada pelo contexto (visualidade, ticket, risco, dor↔desejo...). Responde: <i>"se o mercado não existisse, qual canal seria naturalmente mais forte para este produto?"</i></div>
    <div class="row"><b>Compat.</b> = compatibilidade base canal × motores (0–100). <b>Contexto</b> = multiplicador das variáveis contextuais. <b>Potencial</b> = resultado normalizado (canal mais forte = 100).</div>
  </div>`;

// Documento HTML completo e autossuficiente (para download / salvar página).
export function gerarStandalone(resultados) {
  const data = new Date().toLocaleString("pt-BR");
  const secoes = resultados.map((r, i) => renderSecao(r, i + 1)).join("");
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Radar de Canais — Análise de Potencial</title>
<style>${REPORT_CSS}</style>
</head>
<body>
<header class="hero">
  <div class="eyebrow">Fórmula de Potencial de Canais</div>
  <h1>Radar de Canais Potenciais</h1>
  <p>As pessoas não compram produtos, compram motores psicológicos — e os canais
  são ambientes que maximizam esses motores. Este relatório mede o
  <b>Potencial</b>: qual canal é naturalmente mais forte para este produto.</p>
</header>
<div class="container">
  ${LEGENDA}
  ${secoes}
  <footer>Gerado em ${e(data)} · Camada de Potencial (verdade psicológica) · Metodologia: Motores Psicológicos (Artigos 1–3, 5–7, 9)</footer>
</div>
</body>
</html>`;
}

export const REPORT_CSS = `
:root{--bg:#0b1120;--panel:#111c33;--border:#1e2b45;--text:#e2e8f0;--muted:#94a3b8;--accent:#38bdf8}
*{box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:radial-gradient(1200px 600px at 20% -10%,#12203c 0,#0b1120 55%);color:var(--text);line-height:1.5;margin:0;padding:0 0 80px}
.container{max-width:1180px;margin:0 auto;padding:0 24px}
header.hero{padding:48px 24px 32px;text-align:center;border-bottom:1px solid var(--border);margin-bottom:32px;background:linear-gradient(180deg,rgba(56,189,248,.06),transparent)}
.hero .eyebrow{color:var(--accent);font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:12px}
.hero h1{font-size:34px;margin:10px 0 8px;font-weight:800;letter-spacing:-.5px}
.hero p{color:var(--muted);max-width:720px;margin:0 auto;font-size:15px}
.produto{margin-bottom:56px;scroll-margin-top:20px}
.produto-header{margin-bottom:22px}
.produto-tag{display:inline-block;background:rgba(56,189,248,.12);color:var(--accent);font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;margin-bottom:12px}
.produto-header h2{font-size:28px;font-weight:800;letter-spacing:-.5px;margin:0}
.produto-empresa{color:var(--muted);font-size:15px;margin-top:2px}
.produto-obs{color:#cbd5e1;margin-top:12px;max-width:820px;font-size:14px;border-left:3px solid var(--accent);padding-left:14px}
.ai-box{background:rgba(168,85,247,.07);border:1px solid rgba(168,85,247,.3);border-radius:14px;padding:16px 18px;margin-bottom:20px}
.ai-tag{color:#c084fc;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.ai-box p{margin:0;font-size:14px;color:#e2e8f0}
.cards-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.mini-card{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:16px}
.mini-card.destaque{border-color:rgba(34,197,94,.4);background:rgba(34,197,94,.06)}
.mini-card.destaque-op{border-color:rgba(168,85,247,.4);background:rgba(168,85,247,.06)}
.mini-label{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:8px}
.mini-value{font-size:15px;font-weight:600}
.seta{color:var(--accent)}
.op-badge{background:#a855f7;color:#fff;font-size:12px;padding:2px 8px;border-radius:10px;margin-left:6px}
.op-badge.pot{background:#22c55e;color:#04220f}
.panel{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:22px 24px;margin-bottom:20px}
.panel h3{font-size:16px;font-weight:700;margin:0 0 18px;display:flex;align-items:baseline;gap:10px}
.h3-sub{color:var(--muted);font-size:12px;font-weight:400}
.motores{display:flex;flex-direction:column;gap:10px}
.motor-row{display:grid;grid-template-columns:190px 1fr 34px;align-items:center;gap:12px}
.motor-name{font-size:14px;font-weight:600}
.motor-classe{color:var(--muted);font-size:11px;font-weight:400;display:block}
.motor-val{text-align:right;font-weight:700;color:var(--accent)}
.bar-track{background:#0a1224;border-radius:8px;height:12px;overflow:hidden;border:1px solid var(--border)}
.bar-fill{height:100%;border-radius:8px}
.rank-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:20px}
.ranking{display:flex;flex-direction:column;gap:9px}
.rank-row{display:grid;grid-template-columns:26px 1fr 70px 38px;align-items:center;gap:8px}
.rank-pos{width:24px;height:24px;border-radius:7px;background:#0a1224;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--muted);border:1px solid var(--border)}
.rank-pos.medal-1{background:#facc15;color:#3b2f00;border-color:#facc15}
.rank-pos.medal-2{background:#cbd5e1;color:#1e293b;border-color:#cbd5e1}
.rank-pos.medal-3{background:#d97706;color:#fff;border-color:#d97706}
.canal-nome{font-size:13px;font-weight:600;display:block}
.canal-classe{font-size:10px;color:var(--muted)}
.rank-val{text-align:right;font-weight:700;font-size:14px}
.tabela-wrap{overflow-x:auto}
table.matriz{width:100%;border-collapse:collapse;font-size:13px}
table.matriz th{text-align:right;color:var(--muted);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;text-transform:uppercase;letter-spacing:.4px}
table.matriz th:first-child{text-align:left}
table.matriz td{padding:9px 10px;border-bottom:1px solid #16233d;text-align:right}
table.matriz tr:hover td{background:rgba(56,189,248,.04)}
.td-canal{text-align:left!important;font-weight:600}
.td-classe{display:block;font-size:10px;color:var(--muted);font-weight:400}
.td-strong{font-weight:700}
.td-exec{color:var(--muted)}
.estrategia-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.est-card{border-radius:14px;padding:18px;border:1px solid var(--border)}
.est-curto{background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.3)}
.est-medio{background:rgba(99,102,241,.07);border-color:rgba(99,102,241,.3)}
.est-longo{background:rgba(168,85,247,.07);border-color:rgba(168,85,247,.3)}
.est-head{font-weight:700;font-size:15px;display:flex;align-items:center;gap:8px}
.est-icon{font-size:16px}
.est-sub{color:var(--muted);font-size:12px;margin:4px 0 14px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:#0a1224;border:1px solid var(--border);border-radius:10px;padding:6px 10px;font-size:13px;display:flex;align-items:center;gap:8px}
.chip-val{background:var(--border);border-radius:6px;padding:1px 7px;font-size:11px;color:var(--text);font-weight:700}
.chip-empty{color:var(--muted);font-size:13px;font-style:italic}
.contexto-panel{background:transparent}
.contexto-tags{display:flex;flex-wrap:wrap;gap:8px}
.ctx-tag{display:flex;flex-direction:column;background:#0a1224;border:1px solid var(--border);border-radius:10px;padding:6px 12px}
.ctx-k{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.ctx-v{font-size:13px;font-weight:600}
.legenda{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:18px 24px;margin-bottom:32px;font-size:13px;color:var(--muted)}
.legenda b{color:var(--text)}
.legenda .row{margin:4px 0}
footer{text-align:center;color:var(--muted);font-size:13px;margin-top:40px;padding-top:24px;border-top:1px solid var(--border)}
@media(max-width:900px){.cards-row{grid-template-columns:repeat(2,1fr)}.rank-grid,.estrategia-grid{grid-template-columns:1fr}.motor-row{grid-template-columns:140px 1fr 30px}}
`;
