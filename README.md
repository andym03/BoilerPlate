# React + Vite + TypeScript Boilerplate

A modern, production-ready boilerplate for building React applications with Vite and TypeScript.

## Features

- ⚡️ [Vite](https://vitejs.dev/) - Next generation frontend tooling
- ⚛️ [React 18](https://react.dev/) - UI library
- 🔷 [TypeScript](https://www.typescriptlang.org/) - Type safety
- 📦 Import aliases configured for clean imports
- 🎨 Modern CSS with dark/light mode support
- 🔧 ESLint configured for code quality

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── assets/         # Static assets
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css      # Global styles
├── index.html
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## Import Aliases

The following import aliases are configured:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@utils/` → `src/utils/`
- `@hooks/` → `src/hooks/`
- `@types/` → `src/types/`
- `@assets/` → `src/assets/`

### Example Usage

```typescript
import { Example } from '@components/Example'
import { formatDate } from '@utils/helpers'
import { useCounter } from '@hooks/useCounter'
import { User } from '@types'
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## License

MIT

