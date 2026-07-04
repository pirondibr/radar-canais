/*
 * app.js — Orquestração do frontend.
 * Fluxo: formulário -> OpenRouter (Claude infere motores+contexto)
 *        -> engine.js (cálculo determinístico) -> report.js (render) -> download.
 */

import { analisar } from "./engine.js";
import { extrairProduto, MODELOS, MODELO_PADRAO } from "./openrouter.js";
import { renderSecao, gerarStandalone, REPORT_CSS } from "./report.js";

const KEY_STORAGE = "radar_openrouter_key";
const MODEL_STORAGE = "radar_openrouter_model";

// Injeta o CSS do relatório (mesmo do download) na página.
const styleEl = document.createElement("style");
styleEl.textContent = REPORT_CSS;
document.head.appendChild(styleEl);

const $ = (id) => document.getElementById(id);

// Estado: resultados acumulados na sessão.
let resultados = [];

// -------------------------------------------------------------------------
// Inicialização
// -------------------------------------------------------------------------
function init() {
  // Preenche o seletor de modelos.
  const sel = $("modelo");
  for (const m of MODELOS) {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label;
    sel.appendChild(opt);
  }
  sel.value = localStorage.getItem(MODEL_STORAGE) || MODELO_PADRAO;
  sel.addEventListener("change", () => localStorage.setItem(MODEL_STORAGE, sel.value));

  // Restaura a chave salva.
  const savedKey = localStorage.getItem(KEY_STORAGE);
  if (savedKey) {
    $("apiKey").value = savedKey;
    marcarChave(true);
  }
  $("apiKey").addEventListener("input", (ev) => {
    const v = ev.target.value.trim();
    if (v) { localStorage.setItem(KEY_STORAGE, v); marcarChave(true); }
    else { localStorage.removeItem(KEY_STORAGE); marcarChave(false); }
  });

  $("toggleKey").addEventListener("click", () => {
    const inp = $("apiKey");
    inp.type = inp.type === "password" ? "text" : "password";
  });

  $("analisar").addEventListener("click", onAnalisar);
  $("exemplo").addEventListener("click", preencherExemplo);
  $("download").addEventListener("click", baixarRelatorio);
  $("limpar").addEventListener("click", limpar);
}

function marcarChave(ok) {
  const badge = $("keyStatus");
  badge.textContent = ok ? "Chave configurada" : "Chave não configurada";
  badge.classList.toggle("ok", ok);
}

function setStatus(msg, tipo = "") {
  const el = $("statusMsg");
  el.textContent = msg;
  el.className = "status-msg" + (tipo ? " " + tipo : "");
}

function loading(on) {
  $("spinner").hidden = !on;
  $("analisar").disabled = on;
}

// -------------------------------------------------------------------------
// Ação principal
// -------------------------------------------------------------------------
async function onAnalisar() {
  const apiKey = $("apiKey").value.trim();
  const empresa = $("empresa").value.trim();
  const produto = $("produto").value.trim();
  const descricao = $("descricao").value.trim();

  if (!apiKey) return setStatus("Configure sua chave da API OpenRouter primeiro.", "error");
  if (!empresa || !produto) {
    return setStatus("Preencha ao menos a empresa e o produto.", "error");
  }

  const descricaoUsuario = montarDescricao();

  loading(true);
  setStatus("Analisando com a IA... identificando motores psicológicos e contexto.");

  try {
    const produtoEstruturado = await extrairProduto({
      apiKey,
      modelo: $("modelo").value,
      descricaoUsuario,
    });

    // Preserva o nome digitado pelo usuário quando fornecido.
    produtoEstruturado.empresa = empresa || produtoEstruturado.empresa;
    produtoEstruturado.produto = produto || produtoEstruturado.produto;

    const res = analisar(produtoEstruturado);
    resultados.push(res);
    renderResultados();

    setStatus("Análise concluída.", "ok");
    $("resultadoWrap").hidden = false;
    $("resultadoWrap").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Erro inesperado ao analisar.", "error");
  } finally {
    loading(false);
  }
}

function montarDescricao() {
  const partes = [
    `Empresa: ${$("empresa").value.trim()}`,
    `Produto: ${$("produto").value.trim()}`,
  ];
  const descricao = $("descricao").value.trim();
  if (descricao) partes.push(`Descrição: ${descricao}`);
  const publico = $("publico").value.trim();
  const ticket = $("ticket").value.trim();
  const regiao = $("regiao").value.trim();
  const extra = $("extra").value.trim();
  if (publico) partes.push(`Público-alvo: ${publico}`);
  if (ticket) partes.push(`Faixa de preço/ticket: ${ticket}`);
  if (regiao) partes.push(`Região de atuação: ${regiao}`);
  if (extra) partes.push(`Observações: ${extra}`);
  return partes.join("\n");
}

// -------------------------------------------------------------------------
// Render / download
// -------------------------------------------------------------------------
function renderResultados() {
  const cont = $("relatorio");
  cont.innerHTML = resultados.map((r, i) => renderSecao(r, i + 1)).join("");
  const n = resultados.length;
  $("resultCount").textContent = `${n} produto${n > 1 ? "s" : ""} analisado${n > 1 ? "s" : ""}`;
}

function baixarRelatorio() {
  if (!resultados.length) return;
  const html = gerarStandalone(resultados);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const nome = resultados.length === 1
    ? slug(resultados[0].produto.produto)
    : "radar-canais";
  a.href = url;
  a.download = `radar-${nome}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function limpar() {
  resultados = [];
  $("relatorio").innerHTML = "";
  $("resultadoWrap").hidden = true;
  setStatus("");
}

function slug(s) {
  return String(s).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "produto";
}

// -------------------------------------------------------------------------
// Exemplo
// -------------------------------------------------------------------------
function preencherExemplo() {
  $("empresa").value = "Clínica de estética facial (dentista)";
  $("produto").value = "Harmonização facial";
  $("descricao").value =
    "Procedimento estético de harmonização facial (preenchimento, botox, bioestimuladores) " +
    "realizado por dentista especializado. O cliente busca melhorar a aparência, elevar a " +
    "autoestima e se sentir mais bonito e admirado. Antes da compra sente insatisfação com a " +
    "própria imagem; depois sente confiança e beleza. É um procedimento com resultado muito " +
    "visual (antes/depois), ticket alto, comprado por desejo de transformação e status.";
  $("publico").value = "Mulheres 28-50 anos, classe A/B";
  $("ticket").value = "R$ 2.000 a R$ 6.000";
  $("regiao").value = "Cidade e região metropolitana";
  setStatus("Exemplo preenchido. Configure a chave e clique em Analisar.");
}

init();
