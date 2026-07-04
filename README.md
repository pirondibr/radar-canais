# Radar de Canais Potenciais — Versão Web

Ferramenta web (100% estática) que aplica a **Teoria dos Motores Psicológicos**
para descobrir os canais de marketing com maior **potencial**, **adoção de mercado**
e **oportunidade** para qualquer produto.

- **Frontend**: formulário detalhado do produto.
- **IA (Claude via OpenRouter)**: lê a descrição e infere os *motores psicológicos*
  (com pesos) e as *variáveis contextuais*.
- **Motor determinístico** (`engine.js`): faz todo o cálculo da metodologia
  (Artigos 1–9), de forma reproduzível.
- **Relatório**: renderizado na página e disponível para **download em HTML**.

Roda inteiramente no navegador — ideal para **GitHub Pages**.

---

## Arquivos

| Arquivo         | Função                                                        |
|-----------------|---------------------------------------------------------------|
| `index.html`    | Página e formulário de entrada                                |
| `styles.css`    | Estilos do formulário/config                                  |
| `engine.js`     | Núcleo da metodologia (matriz, execução, contexto, algoritmo) |
| `openrouter.js` | Chamada ao OpenRouter + prompt de extração                    |
| `report.js`     | Geração do HTML do relatório (+ CSS)                           |
| `app.js`        | Orquestração (form → IA → cálculo → render → download)        |

---

## Como usar localmente

Como o projeto usa módulos ES (`import`), abra via um servidor local
(não abra o `index.html` com duplo clique — o `file://` bloqueia módulos):

```bash
cd "versao web"
python -m http.server 8000
```

Acesse `http://localhost:8000` e:

1. Cole sua **chave OpenRouter** (salva só no navegador).
2. Escolha o modelo Claude (padrão: Sonnet 4.5).
3. Descreva o produto e clique em **Analisar canais**.

---

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `radar-canais`).
2. Suba os arquivos desta pasta para a **raiz** do repositório:

   ```bash
   cd "versao web"
   git init
   git add .
   git commit -m "Radar de canais - versão web"
   git branch -M main
   git remote add origin https://github.com/pirondibr/radar-canais.git
   git push -u origin main
   ```

3. No GitHub: **Settings → Pages → Build and deployment**
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `root`
4. Aguarde ~1 min. O site fica em:
   `https://pirondibr.github.io/radar-canais/`

> Se preferir, coloque estes arquivos em uma subpasta `/docs` e aponte o Pages para `/docs`.

---

## Sobre a chave da API (importante)

- A chave **não** fica no código nem no repositório. Ela é digitada no frontend e
  guardada apenas no `localStorage` do navegador de quem usa.
- A requisição vai **direto do navegador** para o OpenRouter.
- Como o site é público, **qualquer pessoa que abrir precisa colocar a própria chave**.
  Isso evita expor a sua. Você coloca a sua manualmente ao usar.
- Recomendação: no OpenRouter, defina um **limite de crédito** na chave para segurança.

---

## Modelos disponíveis (OpenRouter, jul/2026)

- `anthropic/claude-sonnet-4.5` — **padrão**, ótimo equilíbrio
- `anthropic/claude-sonnet-5` — mais capaz
- `anthropic/claude-sonnet-4.6`
- `anthropic/claude-haiku-4.5` — mais rápido e barato
- `~anthropic/claude-sonnet-latest` — sempre a Sonnet mais recente

---

## Metodologia

O cálculo segue o **Algoritmo Universal de Compatibilidade de Canais**:

```
Empresa → Produto → Motores Psicológicos → Variáveis Contextuais
→ Compatibilidade → Potencial Teórico → Mercado Real → Oportunidade → Estratégia
```

- **Potencial** = compatibilidade psicológica canal × motores, ajustada pelo contexto.
- **Mercado** = potencial filtrado pela execução (velocidade × previsibilidade ÷ dificuldade ÷ competição).
- **Oportunidade** = Potencial − Mercado (canais fortes que o mercado ainda não explora).
