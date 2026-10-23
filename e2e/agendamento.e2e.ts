import { type Page, expect, test } from '@playwright/test';

/**
 * Os horários dependem do dia e da hora em que o teste roda (o relógio é o real): por isso
 * o teste escolhe sempre o primeiro profissional, dia e horário livres, em vez de fixar um.
 */

/** Abre o calendário e clica no primeiro dia livre, avançando o mês se o atual não tiver. */
async function escolherPrimeiroDiaLivre(page: Page) {
  await page.getByRole('button', { name: 'Escolher data' }).click();
  const calendario = page.getByRole('dialog', { name: 'Escolher data' });
  await expect(calendario).toBeVisible();
  const livres = calendario.locator('td[data-date]:not([aria-disabled="true"])');
  if ((await livres.count()) === 0) {
    await calendario.getByRole('button', { name: 'Próximo mês' }).click();
  }
  await livres.first().click();
  await expect(calendario).toBeHidden();
}

test('início: banner, acesso ao shop e como chegar', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Salon Barbearia');
  await expect(page.getByRole('link', { name: 'Agendar horário' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/shop');
  for (const nome of [/Ver rota no Maps/, /Chamar Uber/, /Chamar 99/]) {
    await expect(page.getByRole('link', { name: nome })).toHaveAttribute('target', '_blank');
  }
  await expect(page.getByTitle('Mapa com a localização da barbearia')).toBeVisible();
});

test('agendamento completo, do início ao confirmado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Agendar horário' }).click();

  // Passo 1: profissional
  await expect(page).toHaveURL(/\/agendar\/profissional$/);
  await page.locator('app-opcao-card button:not([disabled])').first().click();

  // Passo 2: serviço, data (pelo calendário) e horário
  await expect(page).toHaveURL(/\/agendar\/horario$/);
  await page.locator('app-opcao-card button').first().click();
  await escolherPrimeiroDiaLivre(page);
  await expect(page.getByRole('textbox', { name: 'Data' })).toHaveValue(/^\d{2}\/\d{2}\/\d{4}$/);
  await page.locator('label.arg-time-slots__slot:not(.arg-time-slots__slot--busy)').first().click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Passo 3: confirmação com nome e celular
  await expect(page).toHaveURL(/\/agendar\/confirmar$/);
  await page.getByLabel('Nome').fill('Cliente de Teste');
  await page.getByLabel('Celular com DDD').fill('11999998888');
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click();

  await expect(page.getByRole('heading', { name: 'Agendamento confirmado' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Adicionar à minha agenda/ })).toHaveAttribute(
    'download',
    'agendamento.ics',
  );
});

test('rotas abrem direto pelo endereço', async ({ page }) => {
  await page.goto('/shop');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop');

  // Sem escolhas, o guard leva ao primeiro passo
  await page.goto('/agendar/confirmar');
  await expect(page).toHaveURL(/\/agendar\/profissional$/);
});
