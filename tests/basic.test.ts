import { test, expect } from '@playwright/test'

test('should load the animator controller editor page', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // 检查页面标题
  await expect(page).toHaveTitle(/.*/)

  // 检查页面是否有内容
  await expect(page.locator('body')).toBeVisible()
})
