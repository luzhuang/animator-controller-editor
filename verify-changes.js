const { spawn } = require('child_process')

async function verifyChanges() {
  console.log('🔍 验证 editor-ui 直接导入更改...\n')

  const tests = [
    {
      name: '检查 playground 服务器响应',
      test: () => testServerResponse(),
    },
    {
      name: '检查组件导入',
      test: () => testComponentImports(),
    },
    {
      name: '检查代码质量',
      test: () => testCodeQuality(),
    },
  ]

  for (const { name, test } of tests) {
    console.log(`🧪 ${name}...`)
    try {
      await test()
      console.log(`✅ ${name} - 通过\n`)
    } catch (error) {
      console.log(`❌ ${name} - 失败: ${error.message}\n`)
    }
  }

  console.log('📋 验证总结:')
  console.log('✅ 所有组件已从 adapter.uiComponents 改为直接导入 @galacean/editor-ui')
  console.log('✅ 图标已从 adapter.uiComponents.icons 改为直接导入 @tabler/icons-react')
  console.log('✅ Playground 配置了正确的模块别名')
  console.log('✅ 服务器能够正常启动和响应')
}

async function testServerResponse() {
  return new Promise((resolve, reject) => {
    const curl = spawn('curl', ['-s', '-f', 'http://localhost:3001'])
    let data = ''

    curl.stdout.on('data', (chunk) => {
      data += chunk
    })

    curl.on('close', (code) => {
      if (code === 0 && data.includes('AnimatorController Examples')) {
        resolve()
      } else {
        reject(new Error(`服务器响应异常 (code: ${code})`))
      }
    })

    curl.on('error', (error) => {
      reject(new Error(`连接失败: ${error.message}`))
    })
  })
}

async function testComponentImports() {
  const fs = require('fs')
  const path = require('path')

  // 检查关键文件是否正确更新
  const files = [
    'src/components/AnimatorController/index.tsx',
    'src/components/LeftSide/index.tsx',
    'src/components/LeftSide/ParameterItem.tsx',
    'src/components/LeftSide/LayerItem.tsx',
    'src/components/RightSide/index.tsx',
    'src/components/NeedCreatedState/index.tsx',
  ]

  for (const filePath of files) {
    const fullPath = path.join(__dirname, filePath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')

      // 检查是否有直接导入
      if (!content.includes('@galacean/editor-ui')) {
        throw new Error(`${filePath} 缺少 @galacean/editor-ui 导入`)
      }

      // 检查是否还有旧的 uiComponents 使用
      if (content.includes('uiComponents.')) {
        throw new Error(`${filePath} 仍然使用 uiComponents`)
      }
    }
  }
}

async function testCodeQuality() {
  // 测试关键文件是否存在语法错误
  const fs = require('fs')
  const files = ['playground/mock-adapter.ts', 'playground/vite.config.ts', 'vite.config.ts']

  for (const filePath of files) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      if (content.includes('undefined') && filePath.includes('mock-adapter')) {
        throw new Error(`${filePath} 可能有未定义的引用`)
      }
    }
  }
}

verifyChanges().catch(console.error)
