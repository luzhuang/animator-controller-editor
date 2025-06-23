/**
 * 手动验证脚本 - 验证 animator-controller 功能
 *
 * 这个脚本可以在浏览器控制台中运行，用于验证迁移的功能是否正常工作
 */

const tests = {
  // 检查主要组件是否渲染
  checkMainComponents() {
    const results = {
      animatorController: !!document.querySelector('[data-testid="animator-controller"]'),
      leftSidebar: !!document.querySelector('[data-testid="left-sidebar"]'),
      graphContainer: !!document.querySelector('[data-testid="graph-container"]'),
      needCreatedState: !!document.querySelector('[data-testid="need-created-state"]'),
    }

    console.log('🔍 Main Components Check:', results)
    return results
  },

  // 检查图层功能
  checkLayerFunctionality() {
    const results = {
      layerItems: document.querySelectorAll('[data-testid="layer-item"]').length,
      addLayerButton: !!document.querySelector('[data-testid="add-layer-button"]'),
      removeLayerButton: !!document.querySelector('[data-testid="remove-layer-button"]'),
    }

    console.log('📋 Layer Functionality Check:', results)
    return results
  },

  // 检查参数功能
  checkParameterFunctionality() {
    const results = {
      parameterItems: document.querySelectorAll('[data-testid="parameter-item"]').length,
      addParameterButton: !!document.querySelector('[data-testid="add-parameter-button"]'),
    }

    console.log('⚙️ Parameter Functionality Check:', results)
    return results
  },

  // 检查 X6 图形编辑器
  checkGraphEditor() {
    const results = {
      x6Graph: !!document.querySelector('.x6-graph'),
      graphSvg: !!document.querySelector('.x6-graph svg'),
      hasNodes: document.querySelectorAll('.x6-graph g[data-cell-id]').length > 0,
    }

    console.log('🎨 Graph Editor Check:', results)
    return results
  },

  // 检查标签页切换
  checkTabSwitching() {
    const layersTab = document.querySelector('span').textContent.includes('Layers')
      ? document.querySelector('span').parentElement
      : null
    const parametersTab = document.querySelector('span').textContent.includes('Parameters')
      ? document.querySelector('span').parentElement
      : null

    const results = {
      layersTab: !!layersTab,
      parametersTab: !!parametersTab,
      tabsWorking: !!(layersTab && parametersTab),
    }

    console.log('🔖 Tab Switching Check:', results)
    return results
  },

  // 运行所有测试
  runAllTests() {
    console.log('🚀 Starting Animator Controller Verification Tests...\n')

    const results = {
      mainComponents: this.checkMainComponents(),
      layerFunctionality: this.checkLayerFunctionality(),
      parameterFunctionality: this.checkParameterFunctionality(),
      graphEditor: this.checkGraphEditor(),
      tabSwitching: this.checkTabSwitching(),
    }

    // 计算总体健康度
    let passCount = 0
    let totalCount = 0

    Object.values(results).forEach((category) => {
      Object.values(category).forEach((value) => {
        totalCount++
        if (value === true || (typeof value === 'number' && value > 0)) {
          passCount++
        }
      })
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

    return results
  },

  // 交互式测试助手
  startInteractiveTests() {
    console.log(`
🎮 Interactive Test Instructions:

1. Check if you can see the main interface with left sidebar and graph area
2. Try clicking on the "Layers" and "Parameters" tabs to switch between them
3. Try clicking the "+" button to add a new layer (if visible)
4. Try clicking the "+" button to add a new parameter (if visible)
5. Look for X6 graph nodes like "entry", "exit", "any" states
6. Try right-clicking in the graph area to see context menus

Run tests.runAllTests() to get automated verification results.
    `)
  },
}

// 如果在浏览器中运行，自动开始测试
if (typeof window !== 'undefined') {
  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => tests.runAllTests(), 1000)
    })
  } else {
    setTimeout(() => tests.runAllTests(), 1000)
  }

  // 将 tests 对象暴露到全局
  window.animatorControllerTests = tests
}

module.exports = tests
