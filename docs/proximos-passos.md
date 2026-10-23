# Próximos passos

O que falta para o salon-core sair do protótipo com dados de exemplo e virar o app da barbearia em produção. Os passos estão em ordem de prioridade: cada um destrava o seguinte.

Cada passo diz **quem faz**: _Você_ quando depende de conta, acesso ou decisão do negócio; _Código_ quando é trabalho no repositório, por PR.

## Onde estamos

Pronto na `main`, com CI verde:

- As quatro telas do plano: início com banner e como chegar, escolha do profissional, serviço, data e horário, e confirmação. Mais a página do shop.
- Esteira de CI (`verify`, `pr-checks`, gitleaks) e `main` protegida.
- Argila 0.7.0 com o segmento `transparente` escuro.
- Documentação: [plano](plano-de-implementacao.md) e [layout das telas](layout-das-telas.md).

Ainda é protótipo:

- **Os dados são mock em memória.** Profissionais, serviços e produtos são fictícios, e um agendamento some ao recarregar a página.
- **Não há deploy:** o app só roda localmente.

## Sumário

| #   | Passo                                                        | Quem          | Destrava                                |
| --- | ------------------------------------------------------------ | ------------- | --------------------------------------- |
| 1   | [Deploy na Vercel](#1-deploy-na-vercel)                      | Você e código | Mostrar o app para clientes             |
| 2   | [Dados reais da barbearia](#2-dados-reais-da-barbearia)      | Você          | Conteúdo certo nas telas                |
| 3   | [Pendências no Argila](#3-pendências-no-argila)              | Código        | Remover os contornos do app             |
| 4   | [Supabase: agenda de verdade](#4-supabase-agenda-de-verdade) | Você e código | Agendamentos que persistem              |
| 5   | [Área do barbeiro](#5-área-do-barbeiro)                      | Código        | Cada barbeiro gerencia a própria agenda |
| 6   | [Avisos ao cliente](#6-avisos-ao-cliente)                    | Você e código | Menos faltas                            |
| 7   | [Qualidade e esteira](#7-qualidade-e-esteira)                | Código        | Padrão completo da empresa              |

---

## 1. Deploy na Vercel

Decidido no plano: Vercel, com o mesmo fluxo do catálogo do Argila. O build roda no GitHub Actions e a Vercel só recebe os arquivos prontos: ela não compila nada nem precisa de token do GitHub para instalar o Argila.

**Código (feito):**

- [x] `apps/web/public/vercel.json` com fallback de rotas para o `index.html`, para `/shop` e `/agendar/horario` abrirem direto. É igual ao do catálogo do Argila.
- [x] [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): merge na `main` publica em **staging** (deploy de preview da Vercel); **produção** é por disparo manual em Actions → Deploy → Run workflow. Sem os secrets da Vercel, o workflow só avisa e termina.
- [x] Environments `staging` e `production` criados no GitHub. `production` exige a sua aprovação e só aceita a `main`.

**Você:**

- [ ] Criar o projeto na Vercel: em <https://vercel.com/new>, escolher **Import Third-Party Git Repository** ou criar um projeto vazio chamado `salon-core`. Não precisa configurar build, porque a Vercel só recebe os arquivos prontos.
- [ ] Em **Settings → General** do projeto, copiar o **Project ID**. Em **Settings** da conta ou do time, copiar o **Team ID** (ou User ID).
- [ ] Criar um token em <https://vercel.com/account/tokens>.
- [ ] Cadastrar os três como secrets do repositório (Settings → Secrets and variables → Actions):

  | Secret              | Valor                |
  | ------------------- | -------------------- |
  | `VERCEL_TOKEN`      | O token criado       |
  | `VERCEL_ORG_ID`     | Team ID (ou User ID) |
  | `VERCEL_PROJECT_ID` | Project ID           |

- [ ] Se o projeto foi importado do GitHub, desligar o build automático da Vercel (**Settings → Git → Ignored Build Step**: `exit 0`), para não publicar duas vezes.

**Código (depois dos secrets):**

- [ ] README: link do app publicado.

**Pronto quando:** cada merge na `main` atualiza o staging sozinho, e a produção sai com um clique e a sua aprovação.

---

## 2. Dados reais da barbearia

Tudo isso mora em um arquivo só, [`core/config/salon.config.ts`](../apps/web/src/app/core/config/salon.config.ts), ou nos dados mock até o Supabase entrar.

**Você** decide e manda; **código** aplica:

- [ ] **Nome** da barbearia. Hoje está "Salon Barbearia", provisório.
- [ ] **Resumo** do banner, com 2 ou 3 linhas no tom da casa.
- [ ] **Coordenadas exatas** da Rua França, 77, em Santo André. Hoje são aproximadas pelo CEP e só o Uber usa. Um jeito fácil: botão direito no ponto do Google Maps, depois copiar as coordenadas.
- [ ] **Profissionais:** nome, foto, especialidades, serviços de cada um e expediente (dias e faixas de horário, almoço incluído).
- [ ] **Serviços:** nome, duração e preço.
- [ ] **Produtos do shop:** nome, descrição, preço, foto e disponibilidade.
- [ ] **Ícones do Uber e da 99:** hoje é um carro genérico. Para usar os logos oficiais, seguir o guia de marca de cada empresa.
- [ ] **Link da 99 com destino preenchido:** a 99 não documenta esse link. Testar no celular se algum formato funciona. Se nenhum funcionar, fica o link atual, que abre o app e o cliente digita o endereço.

---

## 3. Pendências no Argila

O salon-core contorna três limitações do Argila 0.7.0. Cada uma se resolve no Argila, e o contorno sai do app no PR que atualizar a versão.

| Pendência                                                                                                                          | Contorno hoje no salon-core                                                                                  | Correção no Argila                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Calendário do `arg-date` não aceita clique: o diálogo herda `pointer-events: none` do host. Acontece também no catálogo publicado. | `pointer-events: auto` em [`styles.css`](../apps/web/src/styles.css)                                         | `pointer-events: auto` no `.arg-date-toggle__dialog`, com teste de clique |
| Sem ícone de carro                                                                                                                 | `ICONE_CARRO` registrado em [`core/ui/argila.ts`](../apps/web/src/app/core/ui/argila.ts), com o nome forçado | Ícone `car` no conjunto do Argila                                         |
| `.arg-sr-only` só existe dentro dos componentes                                                                                    | `.so-leitor` global em [`styles.css`](../apps/web/src/styles.css)                                            | Utilitário de leitor de tela no `base.css`                                |

**Versão 0.8.0:**

- [ ] **Você:** fazer o merge do [PR #118 do Argila](https://github.com/BrunoMonfardini/Argila/pull/118). O ruleset de lá exige 1 aprovação de outra pessoa e você é o autor, então é preciso uma revisão ou um bypass. A permissão de publicação já foi corrigida e a 0.7.0 saiu por ela.
- [ ] **Código:** atualizar para a 0.8.0 e ligar `background: 'degrade'` no segmento, que hoje está comentado em [`core/ui/argila.ts`](../apps/web/src/app/core/ui/argila.ts). Conferir se a 0.8.0 exporta o `arg-calendar` sozinho. Se exportar, avaliar o calendário aberto na tela, sem diálogo.

---

## 4. Supabase: agenda de verdade

Decidido no plano: Supabase. Uma agenda por profissional, todas na conta da barbearia. As telas não mudam: só o provider dos repositórios em [`core/data/repos.ts`](../apps/web/src/app/core/data/repos.ts) troca de mock para Supabase.

**Você:**

- [ ] Criar os projetos no Supabase: um de staging e um de produção.
- [ ] Cadastrar `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` e o `SUPABASE_PROJECT_REF` de cada um nos Environments do GitHub.

**Código:**

- [ ] **Tabelas,** em migrations no repositório (nunca à mão no painel):

  | Tabela                  | Conteúdo                                                       |
  | ----------------------- | -------------------------------------------------------------- |
  | `profissionais`         | Nome, foto, especialidades                                     |
  | `servicos`              | Nome, duração, preço                                           |
  | `profissional_servicos` | Quais serviços cada profissional faz                           |
  | `expedientes`           | Faixas de trabalho por dia da semana                           |
  | `folgas`                | Dias ou períodos sem atendimento (férias, feriados)            |
  | `agendamentos`          | Profissional, serviço, início, fim, nome e telefone do cliente |
  | `produtos`              | Itens do shop                                                  |

- [ ] **Nunca dois clientes no mesmo horário:** uma restrição de exclusão no banco (`EXCLUDE USING gist` sobre o profissional e o intervalo `tstzrange`). A tela já trata o conflito com o aviso "Esse horário acabou de ser ocupado".
- [ ] **RLS:** o público lê profissionais, serviços, expedientes, produtos e os horários ocupados (sem nome nem telefone), e só cria agendamento. Nome e telefone do cliente ficam visíveis só para a barbearia.
- [ ] **Adaptadores** `Supabase*Repo` implementando as mesmas portas dos mocks, com testes.
- [ ] **Migrations na esteira:** `supabase db push` no deploy, antes do front.
- [ ] **Telefone do cliente é dado pessoal (LGPD):** definir por quanto tempo guardar e mostrar um aviso curto no formulário da confirmação.

**Pronto quando:** um agendamento feito no celular aparece para quem abre o app em outro aparelho, e o mesmo horário não pode ser marcado duas vezes.

---

## 5. Área do barbeiro

Do plano: cada barbeiro define quando atende e vê a própria agenda.

**Código:**

- [ ] Login com Supabase Auth, com um usuário por barbeiro e um papel de dono.
- [ ] **Minha agenda:** `arg-agenda` do Argila com os agendamentos do dia e da semana, mostrando nome e telefone do cliente.
- [ ] **Meu expediente:** editar as faixas por dia da semana e marcar folgas.
- [ ] Cancelar ou remarcar um agendamento.
- [ ] Rotas `/admin/*` com guard de login, num layout próprio (`arg-app-shell`).
- [ ] Atualizar o [layout das telas](layout-das-telas.md) com as telas novas.

**A decidir (você):**

- O dono vê e edita a agenda de todos?
- O barbeiro pode bloquear um horário avulso, como uma consulta médica?

---

## 6. Avisos ao cliente

Ideias para depois do Supabase. Nenhuma está decidida.

- [ ] Confirmação e lembrete na véspera, por WhatsApp ou SMS.
- [ ] Link para o cliente cancelar ou remarcar sem ligar.
- [ ] Aviso para o barbeiro a cada agendamento novo.

**Você** precisa decidir o canal. O WhatsApp exige uma conta comercial e um provedor, e cobra por mensagem.

---

## 7. Qualidade e esteira

Para fechar o [padrão de pipeline](https://github.com/BrunoMonfardini/Argila/blob/main/docs/padrao-de-pipeline.md) da empresa:

- [ ] **Resumo dos testes no PR:** o `verify` publica total, falhas, cobertura e os testes mais lentos, e falha se a cobertura cair mais de 0,5 ponto em relação à `main`. Copiar o `scripts/relatorio-de-testes.ts` e os passos de cache do `ci.yml` do Argila.
- [ ] **Teste de ponta a ponta:** um teste no navegador do fluxo inteiro, do início ao "Agendamento confirmado", incluindo o clique no calendário. Esse bug só apareceu no navegador, não nos testes unitários.
- [ ] **Tamanho do bundle:** o carregamento inicial está em 443 kB, e o aviso do orçamento dispara em 500 kB. Investigar o que do Argila entra no carregamento inicial antes de crescer mais.
- [ ] **Acessibilidade e desempenho:** rodar o Lighthouse nas telas publicadas e corrigir o que aparecer.
- [ ] **Ruleset:** quando entrar outra pessoa no time, voltar a aprovação obrigatória para 1, no GitHub e em [`.github/rulesets/main.json`](../.github/rulesets/main.json).

---

## Ambiente local

Para quem for rodar o projeto, uma vez por máquina:

```bash
# Token do GitHub com read:packages, para instalar o Argila
gh auth refresh -h github.com -s read:packages   # no Git Bash, use: winpty gh auth refresh ...
echo 'export NODE_AUTH_TOKEN=$(gh auth token)' >> ~/.bashrc
echo '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' >> ~/.npmrc
```

Feche e abra o terminal, e depois rode `pnpm install`.
