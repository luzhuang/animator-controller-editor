# Galacean Animator Controller

A standalone animator controller editor for Galacean Engine, extracted from the main editor for independent maintenance and development.

## Features

- 🎨 Visual state machine editor with drag & drop
- 📊 Layer-based animation blending
- 🔧 Parameter management with multiple types
- 🎯 Transition conditions with visual editor
- 🔌 Adapter pattern for easy integration
- 📦 TypeScript support with full type definitions

## Installation

```bash
npm install galacean-animator-controller
# or
pnpm add galacean-animator-controller
```

## Usage

### Basic Usage

```tsx
import { AnimatorController } from 'galacean-animator-controller'
import { createGalaceanEditorAdapter } from 'galacean-animator-controller/adapters/galacean-editor'

function App() {
  const adapter = createGalaceanEditorAdapter({
    // adapter configuration
  })

  return <AnimatorController adapter={adapter} />
}
```

### Custom Adapter

```tsx
import { AnimatorController, type IAnimatorControllerAdapter } from 'galacean-animator-controller'

const customAdapter: IAnimatorControllerAdapter = {
  // implement your custom adapter
}

function App() {
  return <AnimatorController adapter={customAdapter} />
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build
pnpm build

# Type check
pnpm type-check
```

## Architecture

This package uses an adapter pattern to decouple the core animator controller logic from specific editor implementations:

- **Core Components**: React components for the animator controller UI
- **Store Management**: MobX-based state management for animator data
- **Adapter Interface**: Abstract interfaces for integration with different editors
- **Galacean Editor Adapter**: Default adapter for Galacean Editor integration

## License

MIT# animator-controller-editor
