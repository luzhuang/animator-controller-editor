/**
 * 简单的浏览器测试脚本
 * 使用 Puppeteer 验证 animator-controller 功能
 */

const puppeteer = require('puppeteer')

async function runTests() {
  console.log('🚀 Starting Animator Controller Browser Tests...\n')

  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器窗口
    defaultViewport: { width: 1280, height: 720 },
  })

  const page = await browser.newPage()

  try {
    // 导航到页面
    console.log('📄 Loading page...')
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle0' })

    // 等待页面加载
    await page.waitForTimeout(2000)

    // 检查主要组件
    const mainComponents = await page.evaluate(() => {
      return {
        animatorController: !!document.querySelector('[data-testid="animator-controller"]'),
        leftSidebar: !!document.querySelector('[data-testid="left-sidebar"]'),
        graphContainer: !!document.querySelector('[data-testid="graph-container"]'),
        needCreatedState: !!document.querySelector('[data-testid="need-created-state"]'),
      }
    })

    console.log('🔍 Main Components:', mainComponents)

    // 检查图层功能
    const layerInfo = await page.evaluate(() => {
      return {
        layerItems: document.querySelectorAll('[data-testid="layer-item"]').length,
        addLayerButton: !!document.querySelector('[data-testid="add-layer-button"]'),
        removeLayerButton: !!document.querySelector('[data-testid="remove-layer-button"]'),
      }
    })

    console.log('📋 Layer Info:', layerInfo)

    // 检查 X6 图形编辑器
    const graphInfo = await page.evaluate(() => {
      return {
        x6Graph: !!document.querySelector('.x6-graph'),
        graphSvg: !!document.querySelector('.x6-graph svg'),
        hasNodes: document.querySelectorAll('.x6-graph g[data-cell-id]').length,
      }
    })

    console.log('🎨 Graph Info:', graphInfo)

    // 尝试截图
    await page.screenshot({
      path: 'animator-controller-screenshot.png',
      fullPage: true,
    })
    console.log('📸 Screenshot saved as animator-controller-screenshot.png')

    // 计算健康度分数
    let passCount = 0
    let totalCount = 0

    const allResults = { ...mainComponents, ...layerInfo, ...graphInfo }
    Object.values(allResults).forEach((value) => {
      totalCount++
      if (value === true || (typeof value === 'number' && value > 0)) {
        passCount++
      }
    })

    const healthPercentage = Math.round((passCount / totalCount) * 100)

    console.log(`\n📊 Overall Health: ${healthPercentage}% (${passCount}/${totalCount} checks passed)`)

    if (healthPercentage >= 80) {
      console.log('✅ Animator Controller migration appears to be working well!')
    } else if (healthPercentage >= 60) {
      console.log('⚠️ Animator Controller has some issues but basic functionality works')
    } else {
      console.log('❌ Animator Controller has significant issues')
    }

    // 等待用户观察
    console.log('\n👀 Browser window will stay open for 10 seconds for manual inspection...')
    await page.waitForTimeout(10000)
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await browser.close()
  }
}

if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = runTests
