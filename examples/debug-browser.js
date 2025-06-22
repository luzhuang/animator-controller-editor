const { chromium } = require('playwright');
const path = require('path');
const { spawn } = require('child_process');

// 启动一个简单的HTTP服务器
function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npx', ['serve', 'dist', '-p', '3000'], {
      cwd: __dirname,
      stdio: 'pipe'
    });
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('localhost:3000')) {
        setTimeout(() => resolve(server), 1000); // 给服务器一点时间启动
      }
    });
    
    server.stderr.on('data', (data) => {
      console.error(`Server error: ${data}`);
    });
    
    // 5秒后如果还没启动就超时
    setTimeout(() => {
      server.kill();
      reject(new Error('Server start timeout'));
    }, 5000);
  });
}

(async () => {
  let server;
  try {
    console.log('🚀 Starting local server...');
    server = await startServer();
    console.log('✅ Server started');
  } catch (error) {
    console.log('❌ Failed to start server, using static file');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 监听控制台日志
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(`${msg.type()}: ${text}`);
    // 输出所有错误和警告
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[BROWSER ${msg.type().toUpperCase()}] ${text}`);
    }
    // 实时输出重要日志
    if (text.includes('Graph') || text.includes('RightSide') || text.includes('states') || text.includes('Container') || text.includes('render') || text.includes('checkAnimatorControllerAsset') || text.includes('🔍') || text.includes('🎯') || text.includes('editingId') || text.includes('⏰') || text.includes('Timeout') || text.includes('assets') || text.includes('Controller')) {
      console.log(`[BROWSER] ${msg.type()}: ${text}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
    console.log(`[PAGE ERROR STACK] ${error.stack}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  try {
    // 访问本地服务器
    const url = 'http://localhost:3001';
    console.log(`🔗 Accessing: ${url}`);
    await page.goto(url);
    
    console.log('✅ Page loaded');
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 检查React根元素是否有内容
    const rootContent = await page.$eval('#root', el => el.innerHTML.length > 0).catch(() => false);
    console.log('⚛️ React app loaded:', rootContent);
    
    // 检查页面标题
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // 检查完整的DOM结构
    const appStructure = await page.evaluate(() => {
      const root = document.querySelector('#root');
      return {
        hasRoot: !!root,
        rootChildrenCount: root ? root.children.length : 0,
        rootHTML: root ? root.innerHTML.substring(0, 500) : '',
      };
    });
    console.log('🏗️ App structure:', appStructure);
    
    // 检查是否有 AnimatorController 组件的toggle按钮
    const hasControllerToggle = await page.$('.toolbar-button');
    console.log('🎛️ Has controller toggle:', !!hasControllerToggle);
    
    // 检查toggle状态
    const isToggleActive = await page.$('.toolbar-button.active');
    console.log('✅ Toggle is active:', !!isToggleActive);
    
    // 获取toggle按钮文本
    const toggleText = await page.$eval('.toolbar-button', el => el.textContent).catch(() => 'Not found');
    console.log('🏷️ Toggle text:', toggleText);
    
    // 检查是否有 X6 图表容器
    const graphContainer = await page.$('.x6-graph');
    console.log('📊 Has X6 graph container:', !!graphContainer);
    
    // 等待更长时间让X6渲染
    await page.waitForTimeout(3000);
    
    // 检查store状态通过日志
    await page.evaluate(() => {
      // 尝试访问全局变量（如果有的话）
      console.log('🔍 Checking store state...');
    });
    
    // 检查是否有 X6 节点
    const nodes = await page.$$('.x6-node');
    console.log('🔵 X6 nodes count:', nodes.length);
    
    // 检查是否有状态节点
    const stateNodes = await page.$$('[data-shape="state"], [data-shape="internalState"]');
    console.log('🎯 State nodes count:', stateNodes.length);
    
    // 检查SVG元素
    const svgElements = await page.$$('.x6-graph-svg');
    console.log('🎨 SVG elements count:', svgElements.length);
    
    // 检查是否有React组件渲染的节点
    const reactNodes = await page.$$('.x6-node [data-cell-id]');
    console.log('⚛️ React nodes count:', reactNodes.length);
    
    // 获取容器尺寸
    const containerRect = await page.evaluate(() => {
      const container = document.querySelector('.x6-graph');
      if (container) {
        const rect = container.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        };
      }
      return null;
    });
    console.log('📏 Container dimensions:', containerRect);
    
    // 检查是否显示"Please select an animator controller"消息
    const selectMessage = await page.$eval('body', el => el.textContent.includes('Please select an animator controller')).catch(() => false);
    console.log('📋 Shows select message:', selectMessage);
    
    // 检查页面上的所有文本内容
    const pageText = await page.evaluate(() => document.body.textContent);
    const hasAnimatorText = pageText.includes('animation.select-controller') || pageText.includes('select an animator controller');
    console.log('🔍 Has animator selection text:', hasAnimatorText);
    
    // 截图保存调试信息
    await page.screenshot({ path: path.join(__dirname, 'debug-screenshot.png') });
    console.log('📷 Screenshot saved as debug-screenshot.png');
    
    // 输出最后几条相关日志
    console.log('\n📝 Recent relevant logs:');
    const relevantLogs = logs.filter(log => 
      log.includes('Graph') || 
      log.includes('RightSide') || 
      log.includes('states') ||
      log.includes('Container') ||
      log.includes('render') ||
      log.includes('🎨') ||
      log.includes('📊') ||
      log.includes('🖼️')
    ).slice(-20);
    
    relevantLogs.forEach(log => console.log(log));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  await browser.close();
  
  // 关闭服务器
  if (server) {
    server.kill();
    console.log('🛑 Server stopped');
  }
  
  console.log('🏁 Browser test completed');
})();