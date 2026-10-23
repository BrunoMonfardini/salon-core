# Layout das telas

Como cada tela do app está montada: estrutura, componentes do Argila, estados e navegação. Os wireframes mostram o celular (a largura de referência); no desktop, a coluna central cresce até `64rem` e as grades viram várias colunas.

Ao mudar uma tela, atualize a seção dela aqui no mesmo PR.

## Sumário

1. [Base comum](#1-base-comum)
2. [Mapa de navegação](#2-mapa-de-navegação)
3. [Início](#3-início)
4. [Shop](#4-shop)
5. [Moldura do agendamento](#5-moldura-do-agendamento)
6. [Passo 1: profissional](#6-passo-1-profissional)
7. [Passo 2: serviço, data e horário](#7-passo-2-serviço-data-e-horário)
8. [Passo 3: confirmação](#8-passo-3-confirmação)

---

## 1. Base comum

### Aparência

Segmento `barbearia` do Argila, em [`core/ui/argila.ts`](../apps/web/src/app/core/ui/argila.ts):

| Eixo                    | Valor                                                          |
| ----------------------- | -------------------------------------------------------------- |
| Design system           | `transparente` (vidro)                                         |
| Modo de cor             | `dark`, fixo                                                   |
| Cores de marca          | primária `ardosia`, secundária `petroleo`, destaque `mostarda` |
| Opacidade da superfície | `0.65`                                                         |
| Fundo                   | `degrade`: manchas leves das cores de marca                    |

### Classes de layout

Definidas uma vez em [`styles.css`](../apps/web/src/styles.css). Nenhuma tela repete esse CSS.

| Classe             | O que faz                                                               |
| ------------------ | ----------------------------------------------------------------------- |
| `pagina`           | Coluna central (até `64rem`) com respiro lateral no celular             |
| `pilha`            | Empilha os filhos com `--arg-space-6` entre eles                        |
| `grade`            | Cards lado a lado (mínimo `16rem`), um por linha no celular             |
| `acoes`            | Botões e links em linha, quebrando quando não cabem                     |
| `texto-secundario` | Texto de apoio na cor `--arg-color-text-muted`                          |
| `com-icone`        | Ícone ao lado do texto num título, com respiro                          |
| `so-leitor`        | Texto só para leitor de tela (o `.arg-sr-only` do Argila é encapsulado) |

### Regras para todas as telas

- **Um `h1` por tela.** Seções usam `h2`, títulos de card usam `h3` (no fluxo de agendamento, o card fica em `h2` porque a seção não tem título próprio).
- **Link externo** abre em outra aba com `rel="noopener"` e o texto "(abre em outra aba)" em `so-leitor`.
- **Carregando** mostra `arg-skeleton` no formato do conteúdo, com `aria-busy="true"` na lista.
- **Nada de cor, espaço ou raio literal:** só tokens `--arg-*`.

---

## 2. Mapa de navegação

```text
                 ┌──────────────┐
                 │   Início  /  │
                 └──┬────────┬──┘
     Agendar horário│        │Ver todos os produtos
                    ▼        ▼
┌───────────────────────┐  ┌───────────┐
│ /agendar/profissional │  │ /shop     │
└──────────┬────────────┘  └───────────┘
           │ escolhe o profissional
           ▼
┌───────────────────────┐
│ /agendar/horario      │◄─────────────┐
└──────────┬────────────┘              │ horário foi tomado:
           │ Continuar                 │ "Escolher outro horário"
           ▼                           │
┌───────────────────────┐              │
│ /agendar/confirmar    │──────────────┘
└──────────┬────────────┘
           │ Confirmar agendamento
           ▼
     Concluído (mesma rota) ──► Início
```

- `/agendar` redireciona para `/agendar/profissional`.
- Rota desconhecida volta ao início.
- O `passoGuard` não deixa abrir um passo sem os anteriores: manda para o primeiro que falta.

---

## 3. Início

**Rota:** `/` · **Componente:** [`features/home/home.ts`](../apps/web/src/app/features/home/home.ts)

Sem produtos na tela inicial: só o acesso ao Shop, para não poluir.

```text
┌────────────────────────────────────┐
│ ╔═ banner ═══════════════════════╗ │
│ ║ ░░▒▒ arte azul (banner.jpg) ▒▒░║ │
│ ║ ░▒▒░░▒▒░░▒▒░░▒▒░░▒▒░░▒▒░░▒▒░░▒ ║ │
│ ║                                ║ │
│ ║ Salon Barbearia           (h1) ║ │
│ ║ Corte, barba e acabamento no   ║ │
│ ║ capricho, com hora marcada...  ║ │
│ ║ ┌────────────────────────────┐ ║ │
│ ║ │     📅  Agendar horário     │ ║ │  ← primário, ponta a ponta
│ ║ └────────────────────────────┘ ║ │
│ ╚════════════════════════════════╝ │
│                                    │
│ ┌─ card (inteiro clicável) ──────┐ │
│ │ ✨ Shop                   (h2) │ │  ← leva a /shop
│ │ Produtos que usamos na         │ │
│ │ barbearia. Separe o seu e      │ │
│ │ pague na hora.                 │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌─ card ─────────────────────────┐ │
│ │ 📍 Como chegar            (h2) │ │
│ │ Rua França, 77 - Parque das    │ │
│ │ Nações, Santo André - SP       │ │
│ │ [📍 Ver rota no Maps]          │ │
│ │ [🚗 Chamar Uber] [🚗 Chamar 99] │ │  ← secundários, com ícone
│ │ ┌────────────────────────────┐ │ │
│ │ │                            │ │ │
│ │ │        mapa (4:3)          │ │ │  ← raio dos cards, no fim
│ │ │                            │ │ │
│ │ └────────────────────────────┘ │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

| Bloco       | Componentes                                                                                                                                       | Dados                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Banner      | `section.banner`, `a[arg-button] variant="primary" size="lg"` com `banner__acao`                                                                  | `nome` e `resumo` de `SALON_CONFIG` |
| Shop        | `article[arg-card]` com `a[arg-card-link]`                                                                                                        | Fixo; os produtos ficam em `/shop`  |
| Como chegar | `section[arg-card]` ([`ComoChegar`](../apps/web/src/app/features/home/como-chegar/como-chegar.ts)), `a[arg-button] variant="secondary"`, `iframe` | `comoChegarLinks(SALON_CONFIG)`     |

**Banner** ([`home.css`](../apps/web/src/app/features/home/home.css)):

- A arte fica em [`public/img/banner.jpg`](../apps/web/public/img/banner.jpg) (533 × 1600 px), copiada sem recompressão.
- Ela **nunca é ampliada**: aparece no tamanho original, alinhada ao topo. Em tela larga, cópias espelhadas preenchem os lados, e a borda espelhada encaixa na original, sem emenda.
- Um véu do fundo (`--arg-color-background` com transparência, mais forte embaixo) garante o contraste do texto.
- O botão de agendar ocupa a largura toda do banner.

**Ícones dos botões:** `map-pin` para a rota e `car` (do Argila) para Uber e 99.

---

## 4. Shop

**Rota:** `/shop` · **Componente:** [`features/shop/shop.ts`](../apps/web/src/app/features/shop/shop.ts)

```text
┌────────────────────────────────────┐
│ Voltar ao início                   │  ← arg-link muted
│                                    │
│ Shop                          (h1) │
│ Produtos que usamos na barbearia.  │
│ Separe o seu e pague na hora do    │
│ atendimento.                       │
│                                    │
│ ┌─ card ─────────────────────────┐ │
│ │ Pomada modeladora         (h3) │ │
│ │ Fixação média, efeito seco.    │ │
│ │ R$ 45,00                       │ │
│ └────────────────────────────────┘ │
│ ┌─ card ─────────────────────────┐ │
│ │ Shampoo antiqueda              │ │
│ │ Uso diário, 250 ml.            │ │
│ │ R$ 52,00   [Esgotado]          │ │  ← arg-badge neutral
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

| Estado       | O que aparece                                            |
| ------------ | -------------------------------------------------------- |
| Carregando   | 3 `arg-skeleton shape="rect"` na grade                   |
| Com produtos | Todos, inclusive os esgotados (com o selo)               |
| Vazio        | `section[arg-empty-state]` "Nenhum produto por enquanto" |

**Card de produto** ([`shared/ui/produto-card`](../apps/web/src/app/shared/ui/produto-card/produto-card.ts)), igual aqui e no início: `article[arg-card]` com nome (`h3`), descrição, preço por `formatCents` e `arg-badge` "Esgotado" quando indisponível.

Sem carrinho nem pagamento online: o cliente paga na barbearia.

---

## 5. Moldura do agendamento

**Rotas:** `/agendar/*` · **Componente:** [`features/booking/booking-shell.ts`](../apps/web/src/app/features/booking/booking-shell.ts)

Envolve os três passos. Só o miolo troca de um passo para outro.

```text
┌────────────────────────────────────┐
│ Voltar ao início                   │
│                                    │
│  ●───────────○───────────○         │  ← arg-stepper
│ Profissional  Horário  Confirmação │
│                                    │
│ ┌────────────────────────────────┐ │
│ │                                │ │
│ │     <router-outlet />          │ │  ← tela do passo
│ │                                │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

- Os rótulos e as rotas vêm de [`passos.ts`](../apps/web/src/app/features/booking/passos.ts): adicionar um passo é uma linha lá.
- O passo atual vem da URL. O tracker é `navigable`: tocar num passo anterior volta para ele, e o guard decide se o passo pode abrir.
- As escolhas ficam no [`BookingStore`](../apps/web/src/app/core/booking/booking.store.ts): mudar uma escolha limpa as que dependem dela.

---

## 6. Passo 1: profissional

**Rota:** `/agendar/profissional` · **Componente:** [`profissional/escolha-profissional.ts`](../apps/web/src/app/features/booking/profissional/escolha-profissional.ts)

```text
│ Escolha o profissional        (h1) │
│ Veja quem tem horário e toque para │
│ escolher.                          │
│                                    │
│ ┌─ card (inteiro clicável) ──────┐ │
│ │ (RA)  Rafael              (h2) │ │  ← arg-avatar + botão arg-card-link
│ │ Degradê · Barba                │ │
│ │ [Disponível hoje às 10:30]     │ │  ← arg-badge success
│ └────────────────────────────────┘ │
│ ┌─ card ─────────────────────────┐ │
│ │ (TH)  Thiago                   │ │
│ │ Tesoura · Pigmentação          │ │
│ │ [Disponível hoje às 10:30]     │ │
│ │ [Escolhido]                    │ │  ← selo primary se já escolhido
│ └────────────────────────────────┘ │
│ ┌─ card ─────────────────────────┐ │
│ │ (DI)  Diego                    │ │
│ │ Barba                          │ │
│ │ [Próximo horário: sábado,      │ │  ← arg-badge info
│ │  24/10 às 08:00]               │ │
│ └────────────────────────────────┘ │
```

| Status do profissional    | Selo                                          | Card               |
| ------------------------- | --------------------------------------------- | ------------------ |
| Tem vaga hoje             | `success` "Disponível hoje às HH:mm"          | Clicável           |
| Próxima vaga em outro dia | `info` "Próximo horário: dia, dd/mm às HH:mm" | Clicável           |
| Sem vaga em 14 dias       | `neutral` "Sem horários nos próximos 14 dias" | Botão desabilitado |

- O status considera o **serviço mais curto** do profissional (o mais otimista). O passo 2 refina pelo serviço escolhido.
- Cálculo em [`core/agenda/disponibilidade.ts`](../apps/web/src/app/core/agenda/disponibilidade.ts) e texto em [`status.ts`](../apps/web/src/app/features/booking/profissional/status.ts).
- Cada card é um [`OpcaoCard`](../apps/web/src/app/shared/ui/opcao-card/opcao-card.ts), o mesmo dos serviços no passo 2: card inteiro clicável, `aria-pressed`, borda e selo "Escolhido" na opção escolhida.
- **Carregando:** 3 `arg-skeleton` na grade.
- **Ao escolher:** grava no store e vai para `/agendar/horario`.

---

## 7. Passo 2: serviço, data e horário

**Rota:** `/agendar/horario` · **Componente:** [`data-horario/data-horario.ts`](../apps/web/src/app/features/booking/data-horario/data-horario.ts)

Os blocos aparecem em sequência, conforme o cliente decide: serviço → data → horário.

```text
│ Serviço, data e horário       (h1) │
│ Com Rafael.                        │
│                                    │
│ Serviço                       (h2) │
│ ┌─ card (inteiro clicável) ──────┐ │  ← app-opcao-card, nível 3
│ │ Corte                     (h3) │ │
│ │ 🕐 30 min                      │ │
│ │ R$ 50,00   [Escolhido]         │ │  ← borda primária quando escolhido
│ └────────────────────────────────┘ │
│ ┌─ card ─────────────────────────┐ │
│ │ Barba                          │ │
│ │ 🕐 30 min                      │ │
│ │ R$ 40,00                       │ │
│ └────────────────────────────────┘ │
│ ┌─ card ─────────────────────────┐ │
│ │ Corte e barba                  │ │
│ │ 🕐 60 min                      │ │
│ │ R$ 80,00                       │ │
│ └────────────────────────────────┘ │
│                                    │
│ Data                               │  ← só depois do serviço
│ ┌──────────────────────────┬─────┐ │
│ │ 21/10/2026               │ 📅  │ │  ← input[arg-date] + calendário
│ └──────────────────────────┴─────┘ │
│ Os dias sem horário livre ficam    │
│ bloqueados no calendário.          │
│                                    │
│ Horário                            │  ← só depois da data
│ ┌─────┐┌─────┐┌─────┐┌─────┐       │  ← fieldset[arg-time-slots]
│ │09:00││09:30││10:00││10:30│       │
│ └─────┘└─────┘└─────┘└─────┘       │
│ ┌─────┐┌─────┐ ░░░░░ ┌─────┐       │  ← ░ ocupado (desabilitado)
│ │11:00││11:30│ 12:00 │13:00│       │
│ └─────┘└─────┘ ░░░░░ └─────┘       │
│                                    │
│ [ Continuar ]                      │  ← primário, desabilitado até
│                                    │    ter os três
```

| Bloco     | Componente                             | Regra                                                                         |
| --------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| Serviço   | `app-opcao-card` em `ul.grade`         | Só os serviços do profissional, com duração e preço; o escolhido fica marcado |
| Data      | `arg-field` + `input[arg-date]`        | De hoje até o 14º dia; bloqueia dias sem horário em que o serviço caiba       |
| Horário   | `fieldset[arg-time-slots]`             | Início a cada 30 min; ocupado se choca com a agenda ou já passou              |
| Continuar | `button[arg-button] variant="primary"` | Habilita com serviço, data e horário; vai para `/agendar/confirmar`           |

- Trocar o serviço limpa o horário (a duração muda o que cabe). Trocar a data também.
- Dia sem nenhum horário livre: o `arg-time-slots` mostra "Nenhum horário livre neste dia."

---

## 8. Passo 3: confirmação

**Rota:** `/agendar/confirmar` · **Componente:** [`confirmacao/confirmacao.ts`](../apps/web/src/app/features/booking/confirmacao/confirmacao.ts)

A mesma rota tem três estados: o formulário, o aviso de conflito e o concluído.

### 8.1 Formulário

```text
│ Confirme seu horário          (h1) │
│ Seu nome e telefone vão para a     │
│ agenda do profissional.            │
│                                    │
│ ┌─ arg-list bordered ────────────┐ │  ← app-resumo
│ │ Profissional   Rafael          │ │
│ │ Serviço        Corte · 30 min  │ │
│ │ Data           terça-feira, 20 │ │
│ │                de outubro      │ │
│ │ Horário        10:30           │ │
│ │ Local          Rua França, 77  │ │
│ └────────────────────────────────┘ │
│                                    │
│ Nome *                             │
│ ┌────────────────────────────────┐ │  ← input[arg-input]
│ └────────────────────────────────┘ │
│ Celular com DDD *                  │
│ ┌────────────────────────────────┐ │  ← input[arg-mask="phone"]
│ │ (11) 99999-8888                │ │
│ └────────────────────────────────┘ │
│                                    │
│ [ Confirmar agendamento ]          │  ← primário, [loading] ao enviar
```

| Campo   | Validação                                                                  | Erro (depois de tocar no campo) |
| ------- | -------------------------------------------------------------------------- | ------------------------------- |
| Nome    | Obrigatório, mínimo de 2 letras                                            | "Diga como podemos te chamar."  |
| Celular | Obrigatório; o `arg-mask` valida o celular com DDD e entrega só os dígitos | "Informe um celular com DDD."   |

Ao confirmar, `AgendaRepo.criar` grava na agenda do profissional com `cliente: { nome, telefone }`.

### 8.2 Horário tomado nesse meio-tempo

```text
│ ┌─ arg-alert tone="warning" ─────┐ │  ← acima do formulário
│ │ ⚠ Esse horário acabou de ser   │ │
│ │   ocupado                      │ │
│ │ Escolha outro horário; o       │ │
│ │ profissional, o serviço e a    │ │
│ │ data continuam os mesmos.      │ │
│ │ [Escolher outro horário]       │ │  ← arg-alert-action
│ └────────────────────────────────┘ │
```

"Escolher outro horário" limpa só o horário e volta para `/agendar/horario`.

### 8.3 Concluído

```text
│ ✓ Agendamento confirmado      (h1) │
│ Te esperamos lá. O pagamento é     │
│ feito na barbearia.                │
│                                    │
│ ┌─ app-resumo ───────────────────┐ │
│ │ ...                            │ │
│ └────────────────────────────────┘ │
│                                    │
│ [📅 Adicionar à minha agenda]      │  ← baixa agendamento.ics
│ [Como chegar ↗]                    │  ← rota no Maps
│ [Voltar ao início]                 │  ← terciário
```

- Toast de sucesso: "Agendado: Seu horário está reservado."
- O fluxo é limpo (`BookingStore.limpar()`): voltar ao agendamento começa do zero.
- O `.ics` sai de [`core/agenda/ics.ts`](../apps/web/src/app/core/agenda/ics.ts), no fuso de São Paulo.
