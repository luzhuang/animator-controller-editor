import { test, expect } from '@playwright/test'

test.describe('Animator Controller Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should load the animator controller editor', async ({ page }) => {
    // 检查页面是否加载
    await expect(page).toHaveTitle(/Animator Controller/)

    // 检查主要容器是否存在
    await expect(page.locator('[data-testid="animator-controller"]')).toBeVisible({ timeout: 10000 })
  })

  test('should display left sidebar with layers and parameters', async ({ page }) => {
    // 检查左侧面板
    await expect(page.locator('[data-testid="left-sidebar"]')).toBeVisible()

    // 检查图层标签页
    await expect(page.getByRole('tab', { name: /layers?/i })).toBeVisible()

    // 检查参数标签页
    await expect(page.getByRole('tab', { name: /parameters?/i })).toBeVisible()
  })

  test('should display state machine graph area', async ({ page }) => {
    // 检查右侧图形编辑区域
    await expect(page.locator('[data-testid="graph-container"]')).toBeVisible()

    // 检查是否有X6图形容器
    await expect(page.locator('.x6-graph')).toBeVisible({ timeout: 5000 })
  })

  test('should show inspector panel', async ({ page }) => {
    // 检查检查器面板
    await expect(page.locator('[data-testid="inspector-panel"]')).toBeVisible()
  })
})

test.describe('Layer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 切换到图层标签页
    await page.getByRole('tab', { name: /layers?/i }).click()
  })

  test('should display default layer', async ({ page }) => {
    // 检查是否有默认图层
    await expect(page.locator('[data-testid="layer-item"]').first()).toBeVisible()

    // 检查图层名称
    await expect(page.locator('[data-testid="layer-item"]').first()).toContainText('Base Layer')
  })

  test('should be able to add new layer', async ({ page }) => {
    // 点击添加图层按钮
    await page.getByRole('button', { name: /add layer/i }).click()

    // 检查是否新增了图层
    const layerItems = page.locator('[data-testid="layer-item"]')
    await expect(layerItems).toHaveCount(2)
  })

  test('should be able to remove layer', async ({ page }) => {
    // 先添加一个图层
    await page.getByRole('button', { name: /add layer/i }).click()

    // 删除第二个图层
    const secondLayer = page.locator('[data-testid="layer-item"]').nth(1)
    await secondLayer.getByRole('button', { name: /remove/i }).click()

    // 检查图层数量
    const layerItems = page.locator('[data-testid="layer-item"]')
    await expect(layerItems).toHaveCount(1)
  })

  test('should be able to select layer', async ({ page }) => {
    // 点击图层
    const layerItem = page.locator('[data-testid="layer-item"]').first()
    await layerItem.click()

    // 检查图层是否被选中（通过样式变化）
    await expect(layerItem).toHaveClass(/selected/)
  })
})

test.describe('Parameter Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 切换到参数标签页
    await page.getByRole('tab', { name: /parameters?/i }).click()
  })

  test('should be able to add parameter', async ({ page }) => {
    // 点击添加参数按钮
    await page.getByRole('button', { name: /add parameter/i }).click()

    // 检查是否出现了新参数
    await expect(page.locator('[data-testid="parameter-item"]')).toBeVisible()
  })

  test('should be able to set parameter type', async ({ page }) => {
    // 添加参数
    await page.getByRole('button', { name: /add parameter/i }).click()

    // 点击参数类型下拉菜单
    const parameterItem = page.locator('[data-testid="parameter-item"]').first()
    await parameterItem.locator('[data-testid="parameter-type-selector"]').click()

    // 选择 Boolean 类型
    await page.getByRole('option', { name: /boolean/i }).click()

    // 验证类型已更改
    await expect(parameterItem.locator('[data-testid="parameter-type-selector"]')).toContainText('Boolean')
  })

  test('should be able to edit parameter name', async ({ page }) => {
    // 添加参数
    await page.getByRole('button', { name: /add parameter/i }).click()

    // 编辑参数名称
    const nameInput = page.locator('[data-testid="parameter-name-input"]').first()
    await nameInput.click()
    await nameInput.fill('TestParameter')
    await nameInput.press('Enter')

    // 验证名称已更改
    await expect(nameInput).toHaveValue('TestParameter')
  })
})

test.describe('State Machine Graph', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display default states', async ({ page }) => {
    // 检查入口状态
    await expect(page.locator('g[data-cell-id="entry"]')).toBeVisible()

    // 检查出口状态
    await expect(page.locator('g[data-cell-id="exit"]')).toBeVisible()

    // 检查任意状态
    await expect(page.locator('g[data-cell-id="any"]')).toBeVisible()
  })

  test('should be able to add new state', async ({ page }) => {
    // 右键点击图形区域
    await page.locator('.x6-graph').click({ button: 'right' })

    // 点击添加状态菜单项
    await page.getByRole('menuitem', { name: /add state/i }).click()

    // 检查是否添加了新状态
    await expect(page.locator('g[data-shape="state"]')).toBeVisible()
  })

  test('should be able to create transition', async ({ page }) => {
    // 先添加一个状态
    await page.locator('.x6-graph').click({ button: 'right' })
    await page.getByRole('menuitem', { name: /add state/i }).click()

    // 从入口状态拖拽到新状态创建转换
    const entryPort = page.locator('g[data-cell-id="entry"] .x6-port-out')
    const statePort = page.locator('g[data-shape="state"] .x6-port-in')

    await entryPort.dragTo(statePort)

    // 检查是否创建了转换边
    await expect(page.locator('g[data-shape="edge"]')).toBeVisible()
  })

  test('should be able to select state and show inspector', async ({ page }) => {
    // 添加状态
    await page.locator('.x6-graph').click({ button: 'right' })
    await page.getByRole('menuitem', { name: /add state/i }).click()

    // 点击选择状态
    await page.locator('g[data-shape="state"]').click()

    // 检查检查器是否显示状态检查器
    await expect(page.locator('[data-testid="state-inspector"]')).toBeVisible()
  })
})

test.describe('Inspector Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should show state inspector when state is selected', async ({ page }) => {
    // 添加并选择状态
    await page.locator('.x6-graph').click({ button: 'right' })
    await page.getByRole('menuitem', { name: /add state/i }).click()
    await page.locator('g[data-shape="state"]').click()

    // 检查状态检查器
    await expect(page.locator('[data-testid="state-inspector"]')).toBeVisible()

    // 检查状态名称输入框
    await expect(page.locator('[data-testid="state-name-input"]')).toBeVisible()
  })

  test('should show transition inspector when transition is selected', async ({ page }) => {
    // 创建转换
    await page.locator('.x6-graph').click({ button: 'right' })
    await page.getByRole('menuitem', { name: /add state/i }).click()

    const entryPort = page.locator('g[data-cell-id="entry"] .x6-port-out')
    const statePort = page.locator('g[data-shape="state"] .x6-port-in')
    await entryPort.dragTo(statePort)

    // 选择转换
    await page.locator('g[data-shape="edge"]').click()

    // 检查转换检查器
    await expect(page.locator('[data-testid="transition-inspector"]')).toBeVisible()
  })

  test('should be able to add transition condition', async ({ page }) => {
    // 先添加参数
    await page.getByRole('tab', { name: /parameters?/i }).click()
    await page.getByRole('button', { name: /add parameter/i }).click()

    // 创建转换并选择
    await page.locator('.x6-graph').click({ button: 'right' })
    await page.getByRole('menuitem', { name: /add state/i }).click()

    const entryPort = page.locator('g[data-cell-id="entry"] .x6-port-out')
    const statePort = page.locator('g[data-shape="state"] .x6-port-in')
    await entryPort.dragTo(statePort)
    await page.locator('g[data-shape="edge"]').click()

    // 在转换检查器中添加条件
    await page.getByRole('button', { name: /add condition/i }).click()

    // 检查是否添加了条件项
    await expect(page.locator('[data-testid="condition-item"]')).toBeVisible()
  })
})

test.describe('Need Created State', () => {
  test('should show creation guide when no animator controller exists', async ({ page }) => {
    // 模拟没有动画控制器的状态
    await page.goto('/?no-controller=true')
    await page.waitForLoadState('networkidle')

    // 检查是否显示创建引导界面
    await expect(page.locator('[data-testid="need-created-state"]')).toBeVisible()

    // 检查创建按钮
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible()
  })
})
