const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // 监听所有请求
  page.on('request', request => {
    console.log('📤 Request:', request.method(), request.url().substring(0, 100) + '...');
  });
  
  page.on('response', response => {
    console.log('📥 Response:', response.status(), '-', response.url().substring(0, 100) + '...');
  });

  // 监听浏览器控制台
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[BROWSER CONSOLE] ${type}: ${text}`);
  });

  console.log('🚀 Starting browser debug for dev server...');
  console.log('📱 Navigating to http://localhost:3002...');
  
  await page.goto('http://localhost:3002');
  
  // 等待页面加载
  await page.waitForTimeout(3000);
  
  // 获取页面标题
  const title = await page.title();
  console.log(`📄 Page title: ${title}`);

  // 截图
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('📸 Screenshot saved as debug-screenshot.png');

  // 详细检查 X6 相关元素
  console.log('\n🔍 详细检查 X6 容器状态...');
  
  // 检查所有可能的 X6 相关容器
  const x6Containers = await page.evaluate(() => {
    const results = [];
    
    // 检查 .x6-graph
    const x6Graph = document.querySelector('.x6-graph');
    results.push({
      selector: '.x6-graph',
      found: !!x6Graph,
      rect: x6Graph ? x6Graph.getBoundingClientRect() : null,
      children: x6Graph ? x6Graph.children.length : 0
    });
    
    // 检查所有包含 x6 的类名
    const allX6Elements = document.querySelectorAll('[class*="x6"]');
    results.push({
      selector: '[class*="x6"]',
      count: allX6Elements.length,
      elements: Array.from(allX6Elements).map(el => ({
        tagName: el.tagName,
        className: el.className,
        rect: el.getBoundingClientRect()
      }))
    });
    
    // 检查右侧容器
    const rightSideContainers = document.querySelectorAll('[style*="flex: 1"]');
    results.push({
      selector: 'rightSide containers',
      count: rightSideContainers.length,
      elements: Array.from(rightSideContainers).map(el => ({
        tagName: el.tagName,
        rect: el.getBoundingClientRect(),
        style: el.getAttribute('style')
      }))
    });
    
    return results;
  });
  
  x6Containers.forEach(result => {
    console.log(`📊 ${result.selector}:`, JSON.stringify(result, null, 2));
  });

  // 检查 React 应用是否渲染
  const reactContent = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      hasRoot: !!root,
      rootContent: root ? root.innerHTML.substring(0, 200) + '...' : null,
      rootChildren: root ? root.children.length : 0
    };
  });
  
  if (reactContent.hasRoot) {
    console.log('✅ React app rendered something:', reactContent.rootContent);
  } else {
    console.log('❌ React app not found');
  }

  // 保持浏览器打开
  console.log('\n🔍 浏览器将保持打开状态，请手动检查页面...');
  console.log('💡 检查要点：');
  console.log('  1. 是否能看到红色和蓝色边框？');
  console.log('  2. AnimatorController 组件是否正确显示？');
  console.log('  3. 左侧参数面板是否显示？');
  console.log('  4. 右侧图形区域是否有内容？');
  console.log('  5. 开发者工具中是否有错误？');
  
  // 等待用户手动关闭
  await page.waitForTimeout(60000);
  
  await browser.close();
})();