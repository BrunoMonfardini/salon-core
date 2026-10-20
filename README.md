# salon-core

App de agendamento da barbearia: apresentação, como chegar, escolha do profissional, data e horário, e confirmação. Feito em Angular 22 com o design system [Argila](https://github.com/BrunoMonfardini/Argila).

Este repositório segue o [padrão de pipeline e qualidade de código](https://github.com/BrunoMonfardini/Argila/blob/main/docs/padrao-de-pipeline.md) da empresa. O plano de implementação está em [docs/plano-de-implementacao.md](docs/plano-de-implementacao.md), e o layout de cada tela, em [docs/layout-das-telas.md](docs/layout-das-telas.md).

## Comandos no Git Bash

Precisa de Node **24** e pnpm **10** (`node -v`, `pnpm -v`).

```bash
git clone https://github.com/BrunoMonfardini/salon-core.git
cd salon-core
pnpm install
npm run dev
```

Instale dependências só com `pnpm install`: o `npm install` ignora o `pnpm-lock.yaml`.

| Script               | O que faz                                      |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Sobe o app em `http://localhost:4200`          |
| `npm run test`       | Testes unitários com cobertura (mínimo de 80%) |
| `npm run test:watch` | Testes em modo watch, sem cobertura            |
| `npm run lint`       | ESLint sem nenhum aviso permitido              |
| `npm run typecheck`  | Checagem de tipos do app e dos testes          |
| `npm run dup:check`  | Procura código duplicado (limite de 3%)        |
| `npm run format`     | Formata tudo com o Prettier                    |
| `npm run build`      | Build de produção em `dist/web`                |

## Onde fica cada coisa

| Pasta      | Conteúdo                                |
| ---------- | --------------------------------------- |
| `apps/web` | O app Angular (telas, serviços, testes) |
| `docs`     | Plano e documentação do projeto         |
| `.github`  | Esteira de CI e modelos de PR e issue   |

## Fluxo de trabalho

Branches curtas a partir da `main` (`feat/`, `fix/`, `chore/`, `docs/`, `refactor/`), commits em [Conventional Commits](https://www.conventionalcommits.org/pt-br/) com o assunto em minúscula, um commit por feature e PR com rebase merge. Os hooks do husky bloqueiam commit e push direto na `main`.
