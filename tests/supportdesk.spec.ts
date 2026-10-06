import { test, expect } from '@playwright/test'

test('citizen can submit a ticket and track it by reference', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Submit a ticket' }).click()
  await expect(page).toHaveURL(/\/submit/)

  await page.getByLabel('Name').fill('Test User')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Subject').fill('Cannot access my account')
  await page.getByLabel('Description').fill('Login keeps failing with no error message.')
  await page.getByRole('button', { name: /submit ticket/i }).click()

  const reference = page.locator('p.font-mono')
  await expect(reference).toBeVisible()
  const code = await reference.textContent()
  expect(code).toMatch(/^SD-/)

  await page.getByRole('link', { name: /track this ticket/i }).click()
  await expect(page).toHaveURL(new RegExp(`/track/${code}`))
  await expect(page.getByText('Cannot access my account')).toBeVisible()
})

test('staff can log in and reach the ticket queue', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Email').fill('amara@supportdesk.test')
  await page.getByLabel('Password').fill('agent123')
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page).toHaveURL(/\/staff\/tickets/)
  await expect(page.getByRole('heading', { name: 'Ticket queue' })).toBeVisible()
})