import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'adapters/galacean-editor/index': 'src/adapters/galacean-editor/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react', 
    'react-dom', 
    '@galacean/engine',
    '@galacean/editor-ui',
    '@galacean/gui',
    '@antv/x6',
    '@antv/x6-react-shape',
    '@antv/x6-plugin-selection',
    'mobx',
    'mobx-react-lite',
    'ahooks',
    'uuid'
  ],
  treeshake: true,
  splitting: true,
  minify: process.env.NODE_ENV === 'production',
  esbuildOptions(options) {
    options.jsx = 'automatic'
    return options
  },
})