---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Regras](../rules/frontend.md) | [Workflow](./workflow.md)

# Guia de Implementação — Frontend (sm-iter-painel)

Guia completo para implementação de testes unitários no frontend do sm-iter usando Next.js + React + Vitest.

> ⚠️ **IMPORTANTE:** Os exemplos de funções e arquivos neste guia são **ILUSTRATIVOS**. Sempre adapte ao código real do projeto consultando `TEST-PROGRESS.md` e verificando os arquivos existentes.

---

## 🎯 Contexto do Projeto

### Stack Tecnológica
- **Framework:** Next.js 14.2 + React 18.2 + TypeScript 5.5
- **Estado:** Context API + SWR para data-fetching
- **UI:** Ant Design 5.8 + styled-components
- **Formulários:** React Hook Form 7.43 + Yup
- **Testes:** Vitest 2.1 + @testing-library/react + jsdom
- **Cobertura atual:** ~5% global (functions: 5.20%, lines: 0.28%, branches: 8.15%)

### Estado Atual
- **Arquivos de teste:** 3 arquivos `.test.ts` criados
- **Módulos cobertos:** lib/string (100%) + hooks/useIntegration (100%) + hooks/useFetch (100%)
- **Pendente:** Hooks críticos restantes + componentes puros + formulários

---

## 📋 Passo 1 — Setup do Ambiente (Já Configurado)

O ambiente de testes já está configurado:

### ✅ Dependências Instaladas
- `vitest` 2.1.4
- `@testing-library/react` 16.2.0
- `@testing-library/user-event` 14.5.2
- `@testing-library/jest-dom` 6.6.3
- `jsdom` 24.1.3
- `@vitest/coverage-v8` 2.1.9

### ✅ Configuração (`vitest.config.ts`)
```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: {
        lines: 0.1,
        statements: 0.1,
        functions: 0.1,
        branches: 0.1,
      },
    },
  },
});
```

### ✅ Setup Global (`test/setupTests.ts`)
```typescript
import "@testing-library/jest-dom/vitest";

// Mocks de browser APIs
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

global.matchMedia = global.matchMedia || function matchMediaMock(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
};
```

---

## 📋 Passo 2 — Ordem de Implementação

### 2.1 Utilitários e Helpers (`lib/`, `utils/`)

**Prioridade:** Alta (funções puras, mais simples)

Arquivos já criados:
- ✅ `lib/string.test.ts` (100% de cobertura)

**Padrão para cada util:**

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formata data válida corretamente', () => {
    // Arrange
    const input = '2024-01-15'
    
    // Act
    const result = formatDate(input)
    
    // Assert
    expect(result).toBe('15/01/2024')
  })
  
  it('retorna string vazia para valor nulo', () => {
    expect(formatDate(null)).toBe('')
  })
  
  it('retorna string vazia para valor undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })
})
```

### 2.2 Hooks Customizados (`hooks/`)

**Prioridade:** Alta (lógica de negócio crítica)

Hooks prioritários (baseados nos hooks existentes no projeto):
- [x] `useFetch.test.ts` (criado)
- [x] `useIntegration.test.ts` (criado)
- [ ] `useDashboardData.test.ts`
- [ ] `useDashboardAdminData.test.ts`
- [ ] `useDebounce.test.ts`
- [ ] `useTable.test.ts`
- [ ] `useSubscription.test.ts`
- [ ] `usePermissions.test.ts`
- [ ] `useFilterOptions.test.ts`
- [ ] `usePersistedFormFilter.test.ts`
- [ ] `usePersistedCollapseState.test.ts`
- [ ] `usePortal.test.ts`

**Template para hooks:**

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from './useFetch'

// Mock do axios
vi.mock('axios')

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna loading=true inicialmente', () => {
    // Arrange & Act
    const { result } = renderHook(() => useFetch('/api/users'))
    
    // Assert
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
  })

  it('retorna dados após fetch bem-sucedido', async () => {
    // Arrange
    const mockData = { id: 1, name: 'João' }
    vi.mocked(axios.get).mockResolvedValue({ data: mockData })
    
    // Act
    const { result } = renderHook(() => useFetch('/api/users/1'))
    
    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual(mockData)
      expect(result.current.error).toBeNull()
    })
  })

  it('retorna erro quando fetch falha', async () => {
    // Arrange
    const mockError = new Error('Network error')
    vi.mocked(axios.get).mockRejectedValue(mockError)
    
    // Act
    const { result } = renderHook(() => useFetch('/api/users/1'))
    
    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeTruthy()
    })
  })
})
```

### 2.3 Componentes de UI Puros (sem estado global)

**Prioridade:** Média

Componentes prioritários (baseados nos componentes existentes no projeto):
- [ ] `AutoColoredTag.test.tsx`
- [ ] `StatusDisplay.test.tsx`
- [ ] Outros componentes puros conforme necessário

**Template para componentes puros:**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza com o texto correto', () => {
    // Arrange & Act
    render(<Button>Salvar</Button>)
    
    // Assert
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
  })

  it('chama onClick ao ser clicado', async () => {
    // Arrange
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Salvar</Button>)
    
    // Act
    await user.click(screen.getByRole('button', { name: /salvar/i }))
    
    // Assert
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('está desabilitado quando disabled=true', () => {
    // Arrange & Act
    render(<Button disabled>Salvar</Button>)
    
    // Assert
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled()
  })
})
```

### 2.4 Componentes com Estado Global

**Prioridade:** Média

**Criar helper de renderização com providers:**

```typescript
// test/utils/render.tsx
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { TestProviders } from './providers'

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestProviders, ...options })
}

export * from '@testing-library/react'
```

**Template para componentes com contexto:**

```typescript
import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/utils/render'
import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  it('exibe nome do usuário autenticado', () => {
    // Arrange & Act
    renderWithProviders(<UserProfile />)
    
    // Assert
    expect(screen.getByText(/joão silva/i)).toBeInTheDocument()
  })

  it('exibe mensagem de carregamento enquanto busca dados', () => {
    // Arrange & Act
    renderWithProviders(<UserProfile />)
    
    // Assert
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })
})
```

### 2.5 Formulários

**Prioridade:** Média

**Template para formulários com React Hook Form:**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('exibe erros de validação para campos vazios', async () => {
    // Arrange
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    // Act
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
    })
  })

  it('submete formulário com dados válidos', async () => {
    // Arrange
    const handleSubmit = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<LoginForm onSubmit={handleSubmit} />)
    
    // Act
    await user.type(screen.getByLabelText(/e-mail/i), 'user@test.com')
    await user.type(screen.getByLabelText(/senha/i), 'password123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    
    // Assert
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'password123'
      })
    })
  })

  it('exibe erro para e-mail inválido', async () => {
    // Arrange
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    // Act
    await user.type(screen.getByLabelText(/e-mail/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument()
    })
  })
})
```

### 2.6 Módulos de Serviço / API Layer

**Prioridade:** Baixa (mockar em hooks)

**Template para serviços:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { userService } from './userService'

vi.mock('axios')

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUser', () => {
    it('retorna dados do usuário', async () => {
      // Arrange
      const mockUser = { id: 1, name: 'João' }
      vi.mocked(axios.get).mockResolvedValue({ data: mockUser })
      
      // Act
      const result = await userService.getUser(1)
      
      // Assert
      expect(result).toEqual(mockUser)
      expect(axios.get).toHaveBeenCalledWith('/api/users/1')
    })

    it('lança erro quando API falha', async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error('API error'))
      
      // Act & Assert
      await expect(userService.getUser(1)).rejects.toThrow('API error')
    })
  })
})
```

---

## 📋 Padrões Obrigatórios

### Nomenclatura de Arquivos
- Arquivo de teste junto ao arquivo testado: `Button.test.tsx` ao lado de `Button.tsx`
- Hooks: `useHook.test.ts` ao lado de `useHook.ts`
- Utils: `util.test.ts` ao lado de `util.ts`

### Queries Semânticas (NUNCA use getByTestId)

**Ordem de preferência:**
1. `getByRole` — melhor para acessibilidade
2. `getByLabelText` — para inputs de formulário
3. `getByPlaceholderText` — quando não há label
4. `getByText` — para texto visível
5. `getByDisplayValue` — para inputs com valor

```typescript
// ✅ BOM
screen.getByRole('button', { name: /salvar/i })
screen.getByLabelText(/e-mail/i)
screen.getByText(/bem-vindo/i)

// ❌ RUIM
screen.getByTestId('save-button')
```

### Estrutura AAA Obrigatória

```typescript
it('descrição do comportamento esperado', async () => {
  // Arrange — prepara componente e mocks
  const user = userEvent.setup()
  render(<Component />)
  
  // Act — executa ação do usuário
  await user.click(screen.getByRole('button'))
  
  // Assert — verifica resultado
  expect(screen.getByText(/sucesso/i)).toBeInTheDocument()
})
```

### Limpeza Entre Testes

```typescript
import { vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

### Mocks

```typescript
// Mock de módulo inteiro
vi.mock('axios')

// Mock de função específica
const mockFn = vi.fn()

// Mock de retorno
vi.mocked(axios.get).mockResolvedValue({ data: {} })

// Spy em método
vi.spyOn(console, 'error').mockImplementation(() => {})
```

---

## 📋 Comandos de Referência

```bash
# Rodar todos os testes
pnpm --filter sm-iter-painel test

# Rodar arquivo específico
pnpm --filter sm-iter-painel test -- string.test.ts

# UI mode (interativo)
pnpm --filter sm-iter-painel test:ui

# Cobertura
pnpm --filter sm-iter-painel test:coverage

# Watch mode
pnpm --filter sm-iter-painel test -- --watch
```

Mais comandos: [reference/commands.md](../reference/commands.md)

---

## 📊 Thresholds Progressivos

| Fase | branches | functions | lines | Quando atingir |
|------|----------|-----------|-------|----------------|
| Atual | 0.1% | 0.1% | 0.1% | Estado atual |
| Fase 2 | 30% | 40% | 40% | Após cobrir hooks críticos |
| Fase 3 | 50% | 60% | 60% | Após cobrir componentes puros |
| Fase 4 | 60% | 70% | 70% | Após cobrir formulários |
| Meta final | 70% | 80% | 80% | Estável |

**Regra:** Nunca aumentar threshold além da cobertura real atual.

---

## ✅ Checklist de Implementação

### Antes de Começar
- [ ] Ler TEST-PROGRESS.md
- [ ] Validar que `vitest.config.ts` está correto
- [ ] Confirmar que utilitários de teste existem em `test/utils/`

### Durante Implementação
- [ ] Um arquivo de teste por vez
- [ ] Seguir estrutura AAA
- [ ] Usar queries semânticas (nunca getByTestId)
- [ ] Rodar teste após cada arquivo
- [ ] Verde antes de avançar

### Ao Final
- [ ] Todos os testes passando
- [ ] Cobertura documentada
- [ ] TEST-PROGRESS.md atualizado
- [ ] Próximos passos definidos

---

## 🚫 O Que NÃO Testar

- Detalhes de implementação interna
- Estilos CSS (usar testes visuais se necessário)
- Bibliotecas de terceiros (já testadas)
- Snapshots de componentes complexos (frágeis)

---

**Próximos passos:** Consulte [TEST-PROGRESS.md](../../../apps/sm-iter-painel/TEST-PROGRESS.md) para ver o roadmap atual.
