## **Project Overview**

This is a **React + Vite + TypeScript** boilerplate with a well-structured design system, testing setup, and documentation via Storybook.

---

## **Tech Stack**

| Category | Technology |
|----------|------------|
| Build Tool | Vite 5.x |
| Framework | React 18.x |
| Language | TypeScript 5.x (strict mode) |
| Package Manager | pnpm (workspace enabled) |
| Testing | Jest 30 + Testing Library |
| Documentation | Storybook 10 |
| Linting | ESLint 9 with TypeScript & React plugins |

---

## **Code Style & Conventions**

### **TypeScript Patterns**
- **Strict mode enabled** with `noUnusedLocals`, `noUnusedParameters`
- **Type exports** use `export type { }` syntax for clarity
- **Interface over type** for object shapes (e.g., `ButtonProps`, `User`)
- **`as const`** assertions for immutable objects (color palette)
- **Generics** used for flexible APIs (`ApiResponse<T>`)

### **Component Patterns**
- **Functional components** with `FC<Props>` or `forwardRef`
- **Default props** via destructuring defaults: `{ title = 'Default' }`
- **JSDoc comments** for documentation
- **BEM-style CSS classes** with `ds-` prefix for design system (`ds-button--primary`)

### **File Organization**
Each feature/component follows a consistent structure:

```
Component/
├── Component.tsx       # Main component
├── Component.css       # Styles
├── Component.test.tsx  # Tests
├── Component.stories.tsx # Storybook stories
└── index.ts            # Barrel export
```

---

## **Design System Architecture**

### **Colors** (`src/design_system/colors/`)
- **Dual source of truth**: TypeScript palette (`palette.ts`) + CSS variables (`palette.css`)
- **Three variants** per color: `base`, `light`, `dark`
- **Dark mode support** via `@media (prefers-color-scheme: dark)`
- **Helper functions**: `getColor()` and `getColorToken()`

```typescript
// Usage
getColor('blue', 'dark')        // Returns '#2563eb'
getColorToken('blue', 'dark')   // Returns '--ds-color-blue-dark'
```

### **Components** (`src/design_system/components/`)
- **Button** is the example component with:
  - 5 variants: `primary`, `secondary`, `warning`, `info`, `danger`
  - 3 sizes: `small`, `medium`, `large`
  - `forwardRef` for ref forwarding
  - Full accessibility support (`:focus-visible`, `disabled` state)

---

## **Import Aliases**

Configured in both `tsconfig.json` and `vite.config.ts`:

| Alias | Path |
|-------|------|
| `@/` | `src/` |
| `@components/` | `src/components/` |
| `@utils/` | `src/utils/` |
| `@hooks/` | `src/hooks/` |
| `@types/` | `src/types/` |
| `@assets/` | `src/assets/` |

---

## **Testing Patterns**

- **Testing Library** with `userEvent` for interactions
- **Organized test suites** using nested `describe` blocks by category:
  - Rendering, Variants, Sizes, Disabled state, Interactions, Edge cases
- **CSS class assertions** for visual states
- **Ref forwarding tests** for component accessibility

---

## **Key Files to Know**

| File | Purpose |
|------|---------|
| `src/design_system/index.ts` | Main design system entry point |
| `src/hooks/useCounter.ts` | Example custom hook with `useCallback` |
| `src/utils/helpers.ts` | Utility functions (`formatDate`, `capitalize`) |
| `src/types/index.ts` | Shared TypeScript interfaces |
| `jest.config.ts` | Jest setup with path alias support |

---

## **Available Scripts**

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm test             # Run tests
pnpm test:coverage    # Run tests with coverage
pnpm storybook        # Launch Storybook on port 6006
pnpm lint             # Run ESLint
```

---

## **Patterns to Follow When Extending**

1. **New components** → Create in `src/design_system/components/` with the full file structure (`.tsx`, `.css`, `.test.tsx`, `.stories.tsx`, `index.ts`)
2. **New hooks** → Add to `src/hooks/` with `use` prefix
3. **New types** → Export from `src/types/index.ts`
4. **CSS styling** → Use `--ds-color-*` CSS variables for colors
5. **Exports** → Use barrel exports (`index.ts`) at each level


## **Environment for commands**

We are using Windows 11 Powershell for terminal commands