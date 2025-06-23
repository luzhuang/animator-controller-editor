const { chromium } = require('playwright')

;(async () => {
  console.log('🔍 开始测试点击 animation.parameters...')

  const browser = await chromium.launch({ headless: false }) // 非无头模式方便观察
  const page = await browser.newPage()

  // 监听所有控制台消息
  page.on('console', (msg) => {
    const text = msg.text()
    const type = msg.type()
    console.log(`[${type.toUpperCase()}] ${text}`)
  })

  // 监听页面错误
  page.on('pageerror', (error) => {
    console.log(`[页面错误] ${error.message}`)
    console.log(`[堆栈] ${error.stack}`)
  })

  // 监听未处理的Promise拒绝
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[JavaScript 错误] ${msg.text()}`)
    }
  })

  try {
    console.log('📍 正在访问页面...')
    await page.goto('http://localhost:3006', { waitUntil: 'networkidle' })

    // 等待页面加载完成
    await page.waitForTimeout(5000)

    console.log('\\n🔍 查找 animation.parameters 按钮...')

    // 查找包含 "animation.parameters" 文本的元素
    const parametersButton = await page.locator('text=animation.parameters').first()
    const buttonExists = (await parametersButton.count()) > 0

    console.log('Parameters 按钮存在:', buttonExists)

    if (buttonExists) {
      console.log('\\n🖱️ 点击 animation.parameters 按钮...')

      // 点击前的状态
      console.log('点击前的页面状态...')

      try {
        // 点击按钮
        await parametersButton.click()
        console.log('✅ 点击成功')

        // 等待一段时间观察是否有错误
        await page.waitForTimeout(2000)

        // 检查点击后的状态
        console.log('\\n🔍 检查点击后的状态...')
        const isSelected = await parametersButton.evaluate((el) => {
          // 检查是否有选中状态的类名或属性
          return (
            el.getAttribute('data-state') === 'active' ||
            el.getAttribute('aria-selected') === 'true' ||
            el.classList.contains('active') ||
            el.classList.contains('selected')
          )
        })

        console.log('按钮是否被选中:', isSelected)
      } catch (clickError) {
        console.log(`[点击错误] ${clickError.message}`)
      }
    } else {
      console.log('❌ 未找到 animation.parameters 按钮')

      // 查找所有可能的按钮
      const allButtons = await page.evaluate(() => {
        const buttons = []
        const elements = document.querySelectorAll('button, [role="button"], [tabindex]')
        elements.forEach((el) => {
          if (el.textContent && el.textContent.trim().length > 0) {
            buttons.push({
              tag: el.tagName,
              text: el.textContent.trim(),
              className: el.className,
              role: el.getAttribute('role'),
              id: el.id,
            })
          }
        })
        return buttons
      })

      console.log('\\n找到的所有按钮:')
      allButtons.forEach((btn, index) => {
        console.log(`${index + 1}. ${btn.tag} "${btn.text}" (${btn.className})`)
      })
    }

    // 检查是否有参数相关的内容显示
    console.log('\\n🔍 检查参数相关内容...')
    const parameterContent = await page.evaluate(() => {
      const content = []
      const elements = document.querySelectorAll('*')
      elements.forEach((el) => {
        const text = el.textContent || ''
        if (
          text.includes('parameter') ||
          text.includes('Parameter') ||
          text.includes('no-parameters') ||
          text.includes('animation.no-parameters')
        ) {
          content.push({
            tag: el.tagName,
            text: text.trim().substring(0, 100),
            className: el.className,
            visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          })
        }
      })
      return content
    })

    console.log('参数相关内容:')
    parameterContent.forEach((content, index) => {
      console.log(`${index + 1}. ${content.tag} "${content.text}" visible:${content.visible}`)
    })

    // 截图保存
    await page.screenshot({ path: 'parameters-debug.png', fullPage: true })
    console.log('\\n截屏已保存: parameters-debug.png')
  } catch (error) {
    console.error('测试过程中发生错误:', error)
  }

  // 保持浏览器打开一段时间
  console.log('\\n⏰ 保持浏览器打开 10 秒钟以观察...')
  await page.waitForTimeout(10000)

  await browser.close()
})()
