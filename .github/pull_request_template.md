## O que muda

<!-- O comportamento antes e depois, em um parágrafo ou lista. -->

## Por quê

<!-- Motivação: bug, funcionalidade, desempenho. Link para a issue, se houver. -->

## Como testar

- [ ] `pnpm format:check` passa
- [ ] `pnpm lint` passa
- [ ] `pnpm typecheck` passa
- [ ] `pnpm test` passa, com cobertura de no mínimo 80%
- [ ] `pnpm dup:check` passa
- [ ] Teste manual: <!-- tela, passos e o que você viu (npm run dev) -->

## Checklist

- [ ] Título do PR e cada commit em Conventional Commits, assunto em minúscula, um commit por feature
- [ ] Toda lógica nova ou alterada tem teste, e o teste falharia sem a mudança
- [ ] Nada duplicado: regra, tipo, validação ou estilo que já existia foi reaproveitado
- [ ] Componentes visuais do Argila; nenhuma cor, espaçamento ou raio literal
- [ ] Sem segredo, `console.log`, código comentado ou `TODO` sem issue vinculada
- [ ] Documentação atualizada se a mudança altera como alguém usa o projeto

## Notas para quem revisa

<!-- Algo delicado, uma decisão de design ou pontos que merecem atenção extra. -->
