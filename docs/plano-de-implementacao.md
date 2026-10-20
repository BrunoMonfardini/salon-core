# Plano de implementação: salon-core

App de agendamento da barbearia em Angular 22 + pnpm, com o design system
[Argila](https://github.com/BrunoMonfardini/Argila) (`@brunomonfardini/ui`), seguindo o
[padrão de pipeline](https://github.com/BrunoMonfardini/Argila/blob/main/docs/padrao-de-pipeline.md)
da empresa e a estrutura de `.github` do
[ai-memory](https://github.com/akitaonrails/ai-memory/tree/main/.github).

> Status: **plano, ainda não executado.** O repositório clonado está vazio.

---

## 0. Decisões de base

| Tema             | Decisão                                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack            | Angular 22 standalone, zoneless, signals; Node 24 (`.nvmrc`), pnpm 10.34.5 (`packageManager`). Mesmas versões do Argila.                                                                    |
| Estrutura        | Monorepo de produto, como pede o padrão: `apps/web` agora, espaço para `apps/api` depois (agenda do barbeiro).                                                                              |
| Design system    | Só componentes e tokens do Argila. Nenhuma cor, espaçamento ou raio literal no CSS do produto.                                                                                              |
| Testes           | Jest + `jest-preset-angular` (ESM), cobertura mínima de 80%, JUnit em `reports/`.                                                                                                           |
| DRY              | `jscpd` com limite de 3%; dados da barbearia num único arquivo de config; lógica (links, disponibilidade, fluxo) em funções puras e serviços testados, nunca no template.                   |
| Pipeline         | `ci.yml` com `verify` + `pr-checks` do padrão Argila (o ci.yml do ai-memory é todo Rust/cargo e não serve como está). Do ai-memory copiamos o resto da pasta `.github`, adaptado (seção 2). |
| Idioma do código | Nomes de domínio em português quando forem termos do negócio (`profissional`, `horario`), como no Argila; convenções do Angular em inglês.                                                  |

---

## 1. Preparar o repositório

Rodar no Git Bash, dentro de `salon-core`.

1. Conferir ferramentas: `node -v` (24.19.0 ✅) e `pnpm -v` (10.34.5 ✅).
2. Criar o workspace Angular sem app padrão e o app em `apps/web`:
   ```bash
   pnpm dlx @angular/cli@22 new salon-core --directory . --create-application=false --package-manager=pnpm --skip-git
   pnpm ng generate application web --project-root=apps/web --routing --style=css --ssr=false
   ```
3. Arquivos de base copiados do Argila: `.nvmrc`, `.editorconfig`, `.gitattributes` (`* text=auto eol=lf`),
   `.prettierrc`, `.prettierignore`, `.gitignore` (`node_modules/`, `dist/`, `coverage/`, `reports/`, `.env`),
   `pnpm-workspace.yaml`, `commitlint.config.js`, `.jscpd.json`, `eslint.config.js`, `jest.config.mjs`, `jest.setup.ts`.
4. Trocar o Karma/Vitest gerado pelo Jest (remover target `test` do `angular.json`).
5. Scripts do contrato no `package.json`: `format:check`, `lint`, `typecheck`, `test`, `dup:check`, `build`, mais `dev`.
6. Husky + lint-staged + commitlint (hooks `pre-commit`, `commit-msg`, `pre-push`, iguais aos do Argila).
7. Instalar o Argila:
   - `.npmrc` com `@brunomonfardini:registry=https://npm.pkg.github.com` e `_authToken=${NODE_AUTH_TOKEN}`.
   - Exportar `NODE_AUTH_TOKEN` (token GitHub com `read:packages`). **Nunca commitar o token.**
   - `pnpm add @brunomonfardini/ui`
   - `angular.json` → `styles`: `argila.css`, `base.css`, `src/styles.css`.
   - `app.config.ts`: `provideArgIcons([...])` só com os ícones usados e `provideArgila({ segments: { barbearia: { style: 'argila', scheme: 'auto' } }, defaultSegment: 'barbearia' })`.
8. Primeiro commit na `main`: `chore: workspace angular com pnpm e argila`.

**Pronto quando:** `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm dup:check && pnpm build` passa localmente.

---

## 2. Pipeline (`.github`)

Combinação: esteira do padrão Argila + organização do ai-memory.

| Arquivo                               | Origem             | Adaptação                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workflows/ci.yml`                    | Argila             | `verify` (install frozen, format, lint, typecheck, test + resumo, dup, build) e `pr-checks` (commitlint). Job `verify` com `permissions: packages: read` e `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` para instalar o Argila. |
| `workflows/secret-scan.yml`           | ai-memory          | Gitleaks semanal no histórico completo + `workflow_dispatch`. Sem mudança além do `.gitleaks.toml`.                                                                                                                               |
| `workflows/deploy.yml`                | padrão Argila (§6) | Environments `staging` e `production` (aprovação manual). Destino a definir (Vercel, como o catálogo).                                                                                                                            |
| `dependabot.yml`                      | ai-memory + Argila | Ecossistemas `github-actions` **e** `npm`, mensal, limite de 5 PRs.                                                                                                                                                               |
| `pull_request_template.md`            | ai-memory          | Mesmas seções (O que mudou / Por quê / Plano de teste / Impacto), com os comandos `pnpm` no lugar de `cargo`.                                                                                                                     |
| `ISSUE_TEMPLATE/bug.md`, `feature.md` | ai-memory          | Traduzidos.                                                                                                                                                                                                                       |
| `CODEOWNERS`                          | ai-memory          | `* @BrunoMonfardini` (ajustar donos).                                                                                                                                                                                             |
| `rulesets/main.json`                  | Argila             | Exige `verify` e `pr-checks`, 1 aprovação, só rebase merge.                                                                                                                                                                       |
| `codeql/`                             | ai-memory          | **Fora** por ora: os modelos de lá são específicos do código Rust deles. Usar o CodeQL padrão do GitHub para JS/TS.                                                                                                               |

Boas práticas herdadas do ai-memory: `concurrency` cancelando execuções antigas de PR, `permissions: contents: read` no topo e actions fixadas por SHA com a versão em comentário.

Commit: `ci: esteira verify e pr-checks com secret scan`.

---

## 3. Arquitetura do app (onde mora o reuso)

```text
apps/web/src/app/
├── core/
│   ├── config/salon.config.ts          ← ÚNICA fonte: nome, texto, endereço, coordenadas, telefone
│   ├── models/                          ← Profissional, Servico, Horario, Agendamento, Produto
│   ├── data/                            ← interfaces (portas): ProfissionaisRepo, AgendaRepo, ProdutosRepo
│   │   └── mock/                        ← implementação em memória (fase 1)
│   └── booking/booking.store.ts         ← estado do fluxo em signals (profissional, data, horário, serviço, cliente)
├── shared/
│   ├── links/external-links.ts          ← funções puras: mapsEmbed, mapsRota, uber, noventaENove
│   ├── ui/page-section/                 ← wrapper de seção com título (reusado nas telas)
│   └── ui/booking-steps/                ← tracker: arg-stepper com os passos derivados das rotas
└── features/
    ├── home/                            ← Tela 1
    ├── booking/
    │   ├── booking.routes.ts            ← shell com o tracker + filhos
    │   ├── booking-shell/
    │   ├── profissional/                ← Tela 2
    │   ├── data-horario/                ← Tela 3
    │   ├── confirmacao/                 ← Tela 4
    │   └── step.guard.ts                ← um guard só: impede pular passo sem o anterior preenchido
    └── shop/                            ← página de produtos
```

Rotas (lazy por feature):

| Rota                    | Tela                       |
| ----------------------- | -------------------------- |
| `/`                     | 1. Início                  |
| `/agendar/profissional` | 2. Profissional            |
| `/agendar/horario`      | 3. Data, horário e serviço |
| `/agendar/confirmar`    | 4. Confirmação             |
| `/shop`                 | Shop                       |

Regras de DRY:

- Os passos do tracker (`['Profissional', 'Horário', 'Confirmação']`) vêm de `data` nas rotas de `booking.routes.ts`; o stepper e o guard leem dali. Adicionar um passo = uma linha.
- Endereço/coordenadas só em `salon.config.ts`; mapa, rota, Uber e 99 são gerados a partir dele.
- Telas consomem dados só pelas interfaces de `core/data`. Trocar mock por API real não mexe em componente.
- Formatação de data/hora/telefone usa os utilitários do Argila (`dates.ts`, `masks.ts`), sem reimplementar.

---

## 4. Telas

Cada tela = um commit `feat(...)` com teste e sem duplicação. Componentes do Argila indicados entre crases.

### Tela 1: Início (`features/home`)

- **Introdução reduzida**: 2–3 linhas sobre a barbearia (de `salon.config.ts`) em `arg-card`, ícone `scissors`.
- **CTA "Agendar horário"**: `arg-button` → `/agendar/profissional`.
- **Como chegar** (`arg-card` com ícone `map-pin`):
  - Mapa embutido com o ponto: iframe `https://www.google.com/maps?q=<endereço>&output=embed` (não exige API key). URL passa por `DomSanitizer` só a partir da config, nunca de entrada do usuário.
  - **Ver rota**: `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>`.
  - **Uber**: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=<lat>&dropoff[longitude]=<lng>&dropoff[nickname]=<nome>`.
  - **99**: deep link do app 99 com destino; fallback para o site se o app não abrir (validar o formato atual na execução, a 99 não documenta oficialmente).
  - Botões com `arg-link`/`arg-button` + ícone `external-link`, `target="_blank" rel="noopener"`.
- **Shop**: aba/atalho (`arg-tabs` ou card) com destaque de 3 produtos → `/shop`.
- Endereço inicial: **Rua França, 77 – Parque das Nações – SP** (coordenadas obtidas na execução e fixadas na config).

Testes: `external-links.spec.ts` (cada URL gerada, com caracteres especiais escapados), render da home com os 4 links.
Commits: `feat(core): config da barbearia`, `feat(shared): links de mapa, rota, uber e 99`, `feat(home): tela inicial com como chegar e atalho do shop`.

### Shop (`features/shop`)

- Grade de `arg-card` com imagem, nome, preço (`dollar`), `arg-badge` de "esgotado".
- Dados via `ProdutosRepo` (mock na fase 1). Venda/checkout fica fora do escopo inicial: botão "Tenho interesse" ou WhatsApp, a definir.

Commit: `feat(shop): vitrine de produtos`.

### Tela 2: Profissional (`features/booking/profissional`)

- Tracker no topo: `arg-stepper` (`current = 0`), no `booking-shell`, compartilhado pelas telas 2–4.
- Lista de profissionais: `arg-avatar` + nome + especialidades (`arg-tag`) + status `arg-badge` (**Disponível hoje** / **Próximo horário: …** / **Indisponível**).
- Indisponível fica desabilitado, não escondido. Seleção grava no `BookingStore` e avança.
- Estados: carregando (`arg-skeleton`) e vazio (`arg-empty-state`).

Testes: cálculo do status de disponibilidade (função pura), seleção atualiza o store.
Commits: `feat(booking): store do agendamento e guard de passos`, `feat(booking): tracker de etapas`, `feat(booking): escolha do profissional`.

### Tela 3: Data, horário e serviço (`features/booking/data-horario`)

- `arg-calendar` com `rules` bloqueando dias sem expediente/sem vaga do profissional escolhido.
- `fieldset[arg-time-slots]` com os horários livres do dia (`loading` enquanto busca).
- Serviços que **esse** profissional oferece (`arg-choice`), com duração e preço. A duração do serviço filtra os horários que cabem.
- Botão "Continuar" só habilita com data + horário + serviço.

Testes: geração de slots a partir do expediente, agenda ocupada e duração do serviço (incluindo bordas: último horário do dia, almoço, dia passado).
Commit: `feat(booking): escolha de data, horário e serviço`.

### Tela 4: Confirmação (`features/booking/confirmacao`)

- Resumo (`arg-card` + `arg-list`): profissional, serviço, data, horário, preço, endereço.
- Formulário: nome (`arg-field` + `input`) e telefone (`input[arg-mask]` de celular), validados com Reactive Forms.
- **Confirmar** → `AgendaRepo.criar({ profissionalId, inicio, fim, servico, cliente: { nome, telefone } })`.
  O nome e o telefone vão no título/descrição do evento na agenda do barbeiro.
- Sucesso: `arg-toast` + tela de concluído com "Adicionar à minha agenda" (arquivo `.ics`) e "Como chegar".
- Erro (horário tomado nesse meio-tempo): `arg-alert` e volta para a tela 3 mantendo o profissional.

Testes: validação do formulário, payload enviado ao repositório, tratamento de conflito.
Commit: `feat(booking): confirmação com nome e telefone do cliente`.

---

## 5. Agenda do barbeiro (integração real)

Fase 1 entrega tudo com `AgendaRepo` em memória: o fluxo funciona de ponta a ponta sem backend.

Fase 2 (precisa de decisão, ver seção 7): implementação real de `AgendaRepo`. **Não dá para gravar no Google Calendar do barbeiro direto do navegador** sem expor credenciais; o caminho é um backend (`apps/api` ou função serverless/Supabase) que:

1. lê a disponibilidade (free/busy) da agenda de cada profissional;
2. cria o evento com nome e telefone do cliente;
3. revalida o horário na hora de criar (evita dois clientes no mesmo horário).

Os componentes não mudam: só a injeção de `AgendaRepo` aponta para o adaptador HTTP.

---

## 6. Ordem de execução

| #   | Entrega                                  | Branch / PR                                         |
| --- | ---------------------------------------- | --------------------------------------------------- |
| 1   | Workspace, qualidade, Argila instalado   | `chore/workspace` (commit direto inicial na `main`) |
| 2   | `.github` completo, CI verde             | `ci/esteira`                                        |
| 3   | Core: config, modelos, repos mock, store | `feat/core`                                         |
| 4   | Tela 1 + links externos                  | `feat/tela-inicio`                                  |
| 5   | Shop                                     | `feat/shop`                                         |
| 6   | Shell + tracker + Tela 2                 | `feat/escolha-profissional`                         |
| 7   | Tela 3                                   | `feat/data-horario`                                 |
| 8   | Tela 4                                   | `feat/confirmacao`                                  |
| 9   | Deploy staging                           | `ci/deploy`                                         |
| 10  | Agenda real (fase 2)                     | `feat/agenda-google`                                |

Cada PR: um commit por feature, Conventional Commits em minúscula, `verify` e `pr-checks` verdes, cobertura ≥ 80%.

---

## 7. Pontos em aberto (decidir antes ou durante)

1. **Endereço**: "Parque das Nações" com Rua França 77 fica em **Santo André (SP)**, não na capital. Confirmar a cidade antes de fixar as coordenadas.
2. **Agenda do barbeiro**: Google Calendar? Cada barbeiro com a própria conta ou uma agenda por profissional numa conta da barbearia? Define o backend da fase 2.
3. **Token do GitHub Packages**: preciso de `NODE_AUTH_TOKEN` com `read:packages` na máquina para instalar o Argila, e o repositório `salon-core` precisa de acesso ao pacote nas Actions.
4. **Shop**: só vitrine, ou venda com pagamento? Onde ficam os produtos (mock, planilha, Supabase)?
5. **Profissionais, serviços, horários de expediente**: dados reais ou mock inicial?
6. **Deploy**: Vercel como o catálogo do Argila?
7. **Design system/paleta**: usar o estilo `argila` padrão ou outro dos sete (ex.: `neo-brutalista`) para a barbearia?
