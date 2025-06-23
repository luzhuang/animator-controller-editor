const { chromium } = require('playwright')

async function testPlayground() {
  // 启动浏览器
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    console.log('正在访问 playground...')

    // 访问 playground
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    console.log('页面加载完成，检查页面内容...')

    // 等待页面加载完成
    await page.waitForTimeout(2000)

    // 检查页面标题
    const title = await page.title()
    console.log('页面标题:', title)

    // 检查是否有错误
    const errors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // 检查是否能找到 AnimatorController 组件
    const animatorController = await page
      .locator('[data-testid="animator-controller"], .animator-controller, [class*="animator"]')
      .first()
    const exists = (await animatorController.count()) > 0

    if (exists) {
      console.log('✅ AnimatorController 组件找到')
    } else {
      console.log('❌ AnimatorController 组件未找到')
      // 检查页面内容
      const bodyText = await page.textContent('body')
      console.log('页面内容:', bodyText.substring(0, 500))
    }

    // 检查是否有 React 错误
    const reactError = await page.locator('[data-testid="error-boundary"], .error-boundary').count()
    if (reactError > 0) {
      console.log('❌ 检测到 React 错误')
    } else {
      console.log('✅ 没有检测到 React 错误')
    }

    // 截屏
    await page.screenshot({ path: 'playground-screenshot.png', fullPage: true })
    console.log('📸 截屏已保存为 playground-screenshot.png')

    // 输出控制台错误
    if (errors.length > 0) {
      console.log('❌ 控制台错误:')
      errors.forEach((error) => console.log('  -', error))
    } else {
      console.log('✅ 没有控制台错误')
    }

    console.log('测试完成！')
  } catch (error) {
    console.error('测试失败:', error.message)
  } finally {
    await browser.close()
  }
}

testPlayground()
