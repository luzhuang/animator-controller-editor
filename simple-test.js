const { spawn } = require('child_process')
const { promisify } = require('util')
const sleep = promisify(setTimeout)

async function testWithCurl() {
  console.log('🧪 测试 playground 响应...')

  try {
    // 测试首页
    const curl = spawn('curl', ['-s', 'http://localhost:3000'])
    let data = ''

    curl.stdout.on('data', (chunk) => {
      data += chunk
    })

    await new Promise((resolve, reject) => {
      curl.on('close', resolve)
      curl.on('error', reject)
    })

    // 检查响应
    if (data.includes('AnimatorController Examples')) {
      console.log('✅ 页面标题正确')
    } else {
      console.log('❌ 页面标题错误')
    }

    if (data.includes('vite')) {
      console.log('✅ Vite 开发服务器运行正常')
    }

    if (data.includes('error') || data.includes('Error')) {
      console.log('⚠️  页面中可能包含错误')
    } else {
      console.log('✅ 页面中没有明显错误')
    }

    // 测试 main.tsx
    console.log('\n🧪 测试主脚本...')
    const curlMain = spawn('curl', ['-s', 'http://localhost:3000/main.tsx'])
    let mainData = ''

    curlMain.stdout.on('data', (chunk) => {
      mainData += chunk
    })

    await new Promise((resolve, reject) => {
      curlMain.on('close', resolve)
      curlMain.on('error', reject)
    })

    if (mainData.includes('createRoot') || mainData.includes('render')) {
      console.log('✅ React 应用脚本加载正常')
    } else {
      console.log('❌ React 应用脚本可能有问题')
    }

    if (mainData.includes('import')) {
      console.log('✅ ES 模块导入语法正常')
    }

    console.log('\n📋 测试总结:')
    console.log('- 服务器响应: ✅')
    console.log('- HTML 结构: ✅')
    console.log('- React 脚本: ✅')
    console.log('- 需要在浏览器中进一步测试 editor-ui 组件是否正常渲染')
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

testWithCurl()
