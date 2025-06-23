const { chromium } = require('playwright')

;(async () => {
  console.log('启动 X6 调试...')

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // 监听控制台消息，特别关注 X6 相关的
  page.on('console', (msg) => {
    const text = msg.text()
    const type = msg.type()
    console.log(`[${type.toUpperCase()}] ${text}`)
  })

  try {
    console.log('访问页面...')
    await page.goto('http://localhost:3006', { waitUntil: 'networkidle' })

    // 等待页面充分加载
    await page.waitForTimeout(5000)

    // 等待X6初始化完成
    await page
      .waitForFunction(
        () => {
          const elements = document.querySelectorAll('[class*="x6"]')
          return elements.length > 0
        },
        { timeout: 10000 }
      )
      .catch(() => {
        console.log('⚠️ X6元素等待超时，继续执行...')
      })

    // 检查 X6 相关的 DOM 元素
    console.log('\n=== DOM 检查 ===')

    // 检查是否有 X6 容器
    const x6Container = await page.locator('[class*="x6"]').count()
    console.log('X6 相关元素数量:', x6Container)

    // 检查是否有 svg 元素（X6 会创建 SVG）
    const svgElements = await page.locator('svg').count()
    console.log('SVG 元素数量:', svgElements)

    // 检查是否有 canvas 元素
    const canvasElements = await page.locator('canvas').count()
    console.log('Canvas 元素数量:', canvasElements)

    // 检查右侧面板是否存在（X6 图形应该在右侧）
    const rightSide = await page.locator('[class*="RightSide"]').isVisible()
    console.log('RightSide 组件可见:', rightSide)

    // 修复：检查 X6 容器的尺寸信息
    console.log('\n=== X6 容器尺寸检查 ===')
    const x6SizeInfo = await page.evaluate(() => {
      const x6Graph = document.querySelector('.x6-graph')
      const x6GraphSvg = document.querySelector('.x6-graph-svg')
      const rightSideContainer = document.querySelector('[class*="RightSide"]')

      const result = {
        x6Graph: null,
        x6GraphSvg: null,
        rightSideContainer: null,
        allX6Elements: [],
      }

      // 检查 x6-graph
      if (x6Graph) {
        const rect = x6Graph.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(x6Graph)
        result.x6Graph = {
          exists: true,
          offsetWidth: x6Graph.offsetWidth,
          offsetHeight: x6Graph.offsetHeight,
          clientWidth: x6Graph.clientWidth,
          clientHeight: x6Graph.clientHeight,
          boundingRect: {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top,
          },
          computedStyle: {
            width: computedStyle.width,
            height: computedStyle.height,
            display: computedStyle.display,
            position: computedStyle.position,
          },
          parentElement: x6Graph.parentElement
            ? {
                tagName: x6Graph.parentElement.tagName,
                className: x6Graph.parentElement.className,
                offsetWidth: x6Graph.parentElement.offsetWidth,
                offsetHeight: x6Graph.parentElement.offsetHeight,
              }
            : null,
        }
      } else {
        result.x6Graph = { exists: false }
      }

      // 检查 x6-graph-svg
      if (x6GraphSvg) {
        const rect = x6GraphSvg.getBoundingClientRect()
        result.x6GraphSvg = {
          exists: true,
          offsetWidth: x6GraphSvg.offsetWidth,
          offsetHeight: x6GraphSvg.offsetHeight,
          boundingRect: {
            width: rect.width,
            height: rect.height,
          },
          attributes: {
            width: x6GraphSvg.getAttribute('width'),
            height: x6GraphSvg.getAttribute('height'),
            viewBox: x6GraphSvg.getAttribute('viewBox'),
          },
        }
      } else {
        result.x6GraphSvg = { exists: false }
      }

      // 检查 RightSide 容器
      if (rightSideContainer) {
        const rect = rightSideContainer.getBoundingClientRect()
        result.rightSideContainer = {
          exists: true,
          offsetWidth: rightSideContainer.offsetWidth,
          offsetHeight: rightSideContainer.offsetHeight,
          boundingRect: {
            width: rect.width,
            height: rect.height,
          },
          className: rightSideContainer.className,
        }
      } else {
        result.rightSideContainer = { exists: false }
      }

      // 查找所有 X6 相关元素并修复 className 问题
      const allX6 = document.querySelectorAll('[class*="x6"]')
      allX6.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        // 修复：安全地处理 className
        let className = ''
        if (el.className && typeof el.className === 'string') {
          className = el.className
        } else if (el.className && el.className.baseVal !== undefined) {
          // SVG 元素的 className 是 SVGAnimatedString
          className = el.className.baseVal
        }

        result.allX6Elements.push({
          index,
          tagName: el.tagName,
          className: className,
          offsetWidth: el.offsetWidth,
          offsetHeight: el.offsetHeight,
          boundingRect: {
            width: rect.width,
            height: rect.height,
          },
        })
      })

      return result
    })

    console.log('X6 尺寸信息:', JSON.stringify(x6SizeInfo, null, 2))

    // 检查容器层级结构
    console.log('\n=== 容器层级结构 ===')
    const containerHierarchy = await page.evaluate(() => {
      const x6Graph = document.querySelector('.x6-graph')
      if (!x6Graph) return '未找到 X6 图表'

      let current = x6Graph
      const hierarchy = []

      while (current && hierarchy.length < 10) {
        const rect = current.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(current)

        // 安全地处理 className
        let className = ''
        if (current.className && typeof current.className === 'string') {
          className = current.className
        } else if (current.className && current.className.baseVal !== undefined) {
          className = current.className.baseVal
        }

        hierarchy.push({
          tagName: current.tagName,
          className: className,
          offsetWidth: current.offsetWidth,
          offsetHeight: current.offsetHeight,
          boundingRect: {
            width: rect.width,
            height: rect.height,
          },
          computedStyle: {
            width: computedStyle.width,
            height: computedStyle.height,
            display: computedStyle.display,
            position: computedStyle.position,
            flex: computedStyle.flex,
          },
        })
        current = current.parentElement
      }

      return hierarchy
    })

    console.log('容器层级结构:', JSON.stringify(containerHierarchy, null, 2))

    // 检查问题诊断
    console.log('\n=== 问题诊断 ===')
    if (x6SizeInfo.x6Graph && x6SizeInfo.x6Graph.exists) {
      const graph = x6SizeInfo.x6Graph
      if (graph.offsetWidth === 0 || graph.offsetHeight === 0) {
        console.log('❌ 问题确认：X6 图表容器大小为 0')
        console.log('📏 实际尺寸:', `${graph.offsetWidth}x${graph.offsetHeight}`)
        console.log('📏 计算样式尺寸:', `${graph.computedStyle.width} x ${graph.computedStyle.height}`)

        if (graph.parentElement) {
          console.log('🔍 父容器尺寸:', `${graph.parentElement.offsetWidth}x${graph.parentElement.offsetHeight}`)
        }

        console.log('🔧 可能的原因：')
        console.log('   1. 父容器没有设置有效的高度')
        console.log('   2. CSS flex 布局问题')
        console.log('   3. 容器在 DOM 渲染前就被测量了')
      } else {
        console.log('✅ X6 图表容器尺寸正常:', `${graph.offsetWidth}x${graph.offsetHeight}`)
      }
    } else {
      console.log('❌ 问题确认：找不到 X6 图表容器')
      console.log('🔧 可能的原因：')
      console.log('   1. X6 图表尚未初始化')
      console.log('   2. render() 方法未被调用')
      console.log('   3. 容器未正确添加到 DOM')
    }

    // 截屏保存
    await page.screenshot({ path: 'x6-debug.png', fullPage: true })
    console.log('\n截屏已保存: x6-debug.png')
  } catch (error) {
    console.error('调试失败:', error.message)
  } finally {
    await browser.close()
  }
})()
