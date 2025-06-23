const { chromium } = require('playwright')

;(async () => {
  console.log('🔍 测试真实 UI 组件...')

  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  // 监听控制台消息
  page.on('console', (msg) => {
    const text = msg.text()
    const type = msg.type()
    if (type === 'error' || text.includes('Warning')) {
      console.log(`[${type.toUpperCase()}] ${text}`)
    }
  })

  // 监听页面错误
  page.on('pageerror', (error) => {
    console.log(`[页面错误] ${error.message}`)
  })

  try {
    console.log('📍 正在访问页面...')
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // 等待页面加载
    await page.waitForTimeout(3000)

    console.log('\n🔍 检查UI组件...')

    // 检查是否使用了真实的 UI 组件
    const uiAnalysis = await page.evaluate(() => {
      const results = {
        hasStyledComponents: false,
        hasRealButtons: false,
        hasSegmentControl: false,
        buttonStyles: [],
        flexboxStyles: [],
        hasThemeProvider: false,
      }

      // 检查是否有 styled-components 生成的类名
      const elements = document.querySelectorAll('*')
      elements.forEach((el) => {
        const className = el.className || ''
        if (className.includes('styled') || className.includes('sc-') || className.includes('css-')) {
          results.hasStyledComponents = true
        }

        // 检查 button 元素的样式
        if (el.tagName === 'BUTTON') {
          const computedStyle = window.getComputedStyle(el)
          results.buttonStyles.push({
            padding: computedStyle.padding,
            borderRadius: computedStyle.borderRadius,
            background: computedStyle.backgroundColor,
            border: computedStyle.border,
            className: className,
          })

          // 真实的UI组件通常有更复杂的样式
          if (
            computedStyle.borderRadius &&
            computedStyle.borderRadius !== '0px' &&
            computedStyle.padding &&
            computedStyle.padding !== '0px'
          ) {
            results.hasRealButtons = true
          }
        }

        // 检查 Flex 布局
        if (el.style.display === 'flex' || window.getComputedStyle(el).display === 'flex') {
          results.flexboxStyles.push({
            tag: el.tagName,
            className: className,
            flexDirection: window.getComputedStyle(el).flexDirection,
            gap: window.getComputedStyle(el).gap,
          })
        }
      })

      // 检查是否有 segment control
      const segmentControls = document.querySelectorAll('[role="radiogroup"], [data-radix-segmented-control]')
      results.hasSegmentControl = segmentControls.length > 0

      // 检查是否有 theme provider
      const themeElements = document.querySelectorAll(
        '[data-theme], [class*="theme"], [class*="dark"], [class*="light"]'
      )
      results.hasThemeProvider = themeElements.length > 0

      return results
    })

    console.log('UI 组件分析结果:')
    console.log('- 使用 styled-components:', uiAnalysis.hasStyledComponents)
    console.log('- 真实按钮样式:', uiAnalysis.hasRealButtons)
    console.log('- Segment Control:', uiAnalysis.hasSegmentControl)
    console.log('- Theme Provider:', uiAnalysis.hasThemeProvider)
    console.log('- 按钮样式数量:', uiAnalysis.buttonStyles.length)
    console.log('- Flexbox 布局数量:', uiAnalysis.flexboxStyles.length)

    if (uiAnalysis.buttonStyles.length > 0) {
      console.log('\n按钮样式详情:')
      uiAnalysis.buttonStyles.forEach((style, index) => {
        console.log(`${index + 1}. padding: ${style.padding}, border-radius: ${style.borderRadius}`)
      })
    }

    // 测试点击功能
    console.log('\n🖱️ 测试点击 animation.parameters...')
    try {
      const parametersButton = await page.locator('text=animation.parameters').first()
      const buttonExists = (await parametersButton.count()) > 0

      if (buttonExists) {
        await parametersButton.click()
        console.log('✅ 点击成功')
        await page.waitForTimeout(1000)

        // 检查下拉菜单是否出现
        const dropdownVisible = await page.evaluate(() => {
          const dropdowns = document.querySelectorAll('[role="menu"], [data-radix-dropdown-menu-content]')
          return Array.from(dropdowns).some((el) => {
            const rect = el.getBoundingClientRect()
            return rect.width > 0 && rect.height > 0
          })
        })

        console.log('下拉菜单显示:', dropdownVisible)
      } else {
        console.log('❌ 未找到 parameters 按钮')
      }
    } catch (clickError) {
      console.log(`点击测试失败: ${clickError.message}`)
    }

    // 截图保存
    await page.screenshot({ path: 'real-ui-test.png', fullPage: true })
    console.log('\n截屏已保存: real-ui-test.png')
  } catch (error) {
    console.error('测试过程中发生错误:', error)
  }

  console.log('\n⏰ 保持浏览器打开 10 秒钟以观察...')
  await page.waitForTimeout(10000)

  await browser.close()
})()
