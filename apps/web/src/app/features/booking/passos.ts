/** Os passos do agendamento, na ordem: o tracker, as rotas e o guard leem daqui. */
export const PASSOS = [
  { path: 'profissional', rotulo: 'Profissional' },
  { path: 'horario', rotulo: 'Horário' },
  { path: 'confirmar', rotulo: 'Confirmação' },
] as const;

export function urlDoPasso(indice: number): string {
  return `/agendar/${PASSOS[indice].path}`;
}

/** O passo da URL atual; fora do fluxo, o primeiro. */
export function passoDaUrl(url: string): number {
  return Math.max(
    0,
    PASSOS.findIndex((_, i) => url.startsWith(urlDoPasso(i))),
  );
}
