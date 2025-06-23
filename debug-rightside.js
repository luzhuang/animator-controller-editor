const { chromium } = require('playwright')

;(async () => {
  console.log('🔍 开始调试 RightSide 组件渲染问题...')

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // 监听控制台消息
  page.on('console', (msg) => {
    const text = msg.text()
    const type = msg.type()
    if (text.includes('RightSide') || text.includes('AnimatorController')) {
      console.log(`[${type.toUpperCase()}] ${text}`)
    }
  })

  try {
    console.log('📍 正在访问页面...')
    await page.goto('http://localhost:3006', { waitUntil: 'networkidle' })

    // 等待足够的时间让 React 渲染完成
    await page.waitForTimeout(8000)

    console.log('\\n=== React 组件检查 ===')

    // 检查 AnimatorController 是否渲染
    const animatorController = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*=\"AnimatorController\"], [data-testid*=\"animator\"]')
      return Array.from(elements).map((el) => ({
        tagName: el.tagName,
        className: el.className,
        visible: el.offsetWidth > 0 && el.offsetHeight > 0,
        size: `${el.offsetWidth}x${el.offsetHeight}`,
        text: el.innerText?.substring(0, 100),
      }))
    })

    console.log('AnimatorController 组件:', animatorController)

    // 检查所有可能的组件容器
    const allContainers = await page.evaluate(() => {
      const containers = []
      const elements = document.querySelectorAll('div')

      elements.forEach((el) => {
        const className = el.className || ''
        if (
          className.includes('Flex') ||
          className.includes('Side') ||
          className.includes('Container') ||
          className.includes('Root') ||
          el.children.length > 0
        ) {
          containers.push({
            tagName: el.tagName,
            className: className,
            children: el.children.length,
            visible: el.offsetWidth > 0 && el.offsetHeight > 0,
            size: `${el.offsetWidth}x${el.offsetHeight}`,
            hasX6: !!el.querySelector('[class*=\"x6\"]'),
            text: el.innerText?.substring(0, 50)?.replace(/\\n/g, ' '),
          })
        }
      })

      return containers.filter((c) => c.visible).slice(0, 20) // 只取前20个可见的
    })

    console.log('\\n=== 所有容器 ===')
    allContainers.forEach((container, index) => {
      console.log(
        `${index + 1}. ${container.tagName}.${container.className} (${container.size}) children:${container.children} hasX6:${container.hasX6}`
      )
      if (container.text) {
        console.log(`   text: "${container.text}"`)
      }
    })

    // 检查是否有 RightSide 相关的类名
    const styledComponents = await page.evaluate(() => {
      const styledElements = []
      const allElements = document.querySelectorAll('*')

      allElements.forEach((el) => {
        const className = el.className || ''
        if (typeof className === 'string' && className.length > 0) {
          // 查找包含特定模式的类名
          if (
            className.match(/[a-zA-Z]+-[a-zA-Z0-9]+/) || // styled-components 模式
            className.includes('Right') ||
            className.includes('Side') ||
            className.includes('Graph')
          ) {
            styledElements.push({
              tagName: el.tagName,
              className: className,
              visible: el.offsetWidth > 0 && el.offsetHeight > 0,
              size: `${el.offsetWidth}x${el.offsetHeight}`,
            })
          }
        }
      })

      return styledElements.filter((e) => e.visible).slice(0, 10)
    })

    console.log('\\n=== Styled Components ===')
    styledComponents.forEach((comp, index) => {
      console.log(`${index + 1}. ${comp.tagName}.${comp.className} (${comp.size})`)
    })

    // 检查页面的整体布局结构
    const layoutStructure = await page.evaluate(() => {
      const body = document.body
      const getLayout = (element, depth = 0) => {
        if (depth > 3) return null

        const children = Array.from(element.children)
          .map((child) => {
            if (child.offsetWidth > 0 && child.offsetHeight > 0) {
              return {
                tag: child.tagName,
                className: child.className || '',
                size: `${child.offsetWidth}x${child.offsetHeight}`,
                children: getLayout(child, depth + 1),
              }
            }
            return null
          })
          .filter(Boolean)

        return children.length > 0 ? children : null
      }

      return getLayout(body)
    })

    console.log('\\n=== 布局结构 ===')
    const printLayout = (layout, indent = '') => {
      if (!layout) return
      layout.forEach((item) => {
        console.log(`${indent}${item.tag}.${item.className} (${item.size})`)
        if (item.children) {
          printLayout(item.children, indent + '  ')
        }
      })
    }
    printLayout(layoutStructure)

    // 截图保存
    await page.screenshot({ path: 'rightside-debug.png', fullPage: true })
    console.log('\\n截屏已保存: rightside-debug.png')
  } catch (error) {
    console.error('调试过程中发生错误:', error)
  } finally {
    await browser.close()
  }
})()
