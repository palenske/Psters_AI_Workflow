---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Backend](../guides/backend-implementation.md) | [Frontend](../guides/frontend-implementation.md)

# Templates de Implementação de Testes

Templates prontos para implementar testes por tipo de módulo.

---

## 🔧 Backend Templates (Jest + NestJS)

### Use Case (CRUD Simples)

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { FindAlunoByIdUseCase } from './FindAlunoByIdUseCase'

const mockAlunoRepository = {
  findById: jest.fn(), // @MOCK
}

describe('FindAlunoByIdUseCase', () => {
  let useCase: FindAlunoByIdUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAlunoByIdUseCase,
        {
          provide: 'IAlunoRepository',
          useValue: mockAlunoRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindAlunoByIdUseCase>(FindAlunoByIdUseCase)
  })

  afterEach(() => jest.clearAllMocks())

  it('retorna aluno quando encontrado', async () => {
    // Arrange
    const aluno = { id: '1', nome: 'João', email: 'joao@test.com' }
    mockAlunoRepository.findById.mockResolvedValue(aluno)

    // Act
    const result = await useCase.execute({ id: '1' })

    // Assert
    expect(result).toEqual(aluno)
    expect(mockAlunoRepository.findById).toHaveBeenCalledWith('1')
  })

  it('lança NotFoundException quando aluno não existe', async () => {
    // Arrange
    mockAlunoRepository.findById.mockResolvedValue(null)

    // Act & Assert
    await expect(useCase.execute({ id: '999' }))
      .rejects.toThrow(NotFoundException)
  })
})
```

### Use Case (Lógica Complexa)

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { ProcessPaymentUseCase } from './ProcessPaymentUseCase'

const mockFaturaRepository = {
  findById: jest.fn(), // @MOCK
  update: jest.fn(), // @MOCK
}

const mockPaymentGateway = {
  processPayment: jest.fn(), // @MOCK
}

const mockEventEmitter = {
  emit: jest.fn(), // @MOCK
}

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        { provide: 'IFaturaRepository', useValue: mockFaturaRepository },
        { provide: 'PaymentGateway', useValue: mockPaymentGateway },
        { provide: 'EventEmitter2', useValue: mockEventEmitter },
      ],
    }).compile()

    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase)
  })

  afterEach(() => jest.clearAllMocks())

  it('processa pagamento com sucesso', async () => {
    // Arrange
    const fatura = { id: '1', valor: 100, status: 'PENDENTE' }
    mockFaturaRepository.findById.mockResolvedValue(fatura)
    mockPaymentGateway.processPayment.mockResolvedValue({ status: 'approved' })
    mockFaturaRepository.update.mockResolvedValue({ ...fatura, status: 'PAGA' })

    // Act
    const result = await useCase.execute({ faturaId: '1' })

    // Assert
    expect(result.status).toBe('PAGA')
    expect(mockPaymentGateway.processPayment).toHaveBeenCalledWith(fatura)
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('payment.processed', expect.any(Object))
  })

  it('lança BadRequestException para fatura já paga', async () => {
    // Arrange
    mockFaturaRepository.findById.mockResolvedValue({ id: '1', status: 'PAGA' })

    // Act & Assert
    await expect(useCase.execute({ faturaId: '1' }))
      .rejects.toThrow(BadRequestException)
  })
})
```

### Util (Função Pura)

```typescript
import { StringUtils } from './StringUtils'

describe('StringUtils', () => {
  describe('capitalize', () => {
    it('capitaliza primeira letra de string válida', () => {
      // Arrange
      const input = 'hello world'
      
      // Act
      const result = StringUtils.capitalize(input)
      
      // Assert
      expect(result).toBe('Hello world')
    })

    it('retorna string vazia para null', () => {
      expect(StringUtils.capitalize(null)).toBe('')
    })

    it('retorna string vazia para undefined', () => {
      expect(StringUtils.capitalize(undefined)).toBe('')
    })

    it('retorna string vazia para string vazia', () => {
      expect(StringUtils.capitalize('')).toBe('')
    })
  })
})
```

### Guard

```typescript
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from './auth.guard'

describe('AuthGuard', () => {
  let guard: AuthGuard

  const mockExecutionContext = (token?: string): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { authorization: token ? `Bearer ${token}` : undefined },
      }),
    }),
  } as any)

  beforeEach(() => {
    guard = new AuthGuard()
  })

  it('permite acesso com token válido', async () => {
    // Arrange
    const context = mockExecutionContext('valid-token')
    
    // Act
    const result = await guard.canActivate(context)
    
    // Assert
    expect(result).toBe(true)
  })

  it('bloqueia acesso sem token', async () => {
    // Arrange
    const context = mockExecutionContext()
    
    // Act & Assert
    await expect(guard.canActivate(context))
      .rejects.toThrow(UnauthorizedException)
  })
})
```

---

## ⚛️ Frontend Templates (Vitest + React)

### Hook Customizado

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from './useFetch'
import axios from 'axios'

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
    })
  })

  it('retorna erro quando fetch falha', async () => {
    // Arrange
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'))
    
    // Act
    const { result } = renderHook(() => useFetch('/api/users/1'))
    
    // Assert
    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })
  })
})
```

### Componente Puro

> **Nota:** Adapte aos componentes reais do sm-iter-painel (ex: AutoColoredTag, StatusDisplay).

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentePuro } from './ComponentePuro'

describe('ComponentePuro', () => {
  it('renderiza com props corretas', () => {
    // Arrange & Act
    render(<ComponentePuro label="Teste" />)
    
    // Assert
    expect(screen.getByText(/teste/i)).toBeInTheDocument()
  })

  it('aplica estilos baseados em props', () => {
    // Arrange & Act
    render(<ComponentePuro variant="primary" />)
    
    // Assert
    expect(screen.getByRole('button')).toHaveClass('primary')
  })
})
```


### Componente com Contexto

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

  it('exibe botão de logout', () => {
    // Arrange & Act
    renderWithProviders(<UserProfile />)
    
    // Assert
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })
})
```

### Formulário

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('exibe erros de validação para campos vazios', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<LoginForm />)
    
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
    render(<LoginForm onSubmit={handleSubmit} />)
    
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
})
```

### Util (Função Pura)

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

  it('retorna string vazia para null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('retorna string vazia para undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('retorna string vazia para string vazia', () => {
    expect(formatDate('')).toBe('')
  })
})
```

---

## ✅ Checklist de Implementação

### Antes de Começar
- [ ] Ler arquivo alvo para entender implementação
- [ ] Identificar dependências e mocks necessários
- [ ] Verificar se mocks centralizados existem
- [ ] Escolher template apropriado

### Durante Implementação
- [ ] Seguir estrutura AAA (Arrange/Act/Assert)
- [ ] Usar mocks centralizados (não inline)
- [ ] Cobrir happy path
- [ ] Cobrir casos de erro
- [ ] Cobrir edge cases (null, undefined, vazios)
- [ ] Usar queries semânticas (frontend)
- [ ] Adicionar descrições claras nos `it()`

### Após Implementação
- [ ] Rodar `pnpm test -- [arquivo]`
- [ ] Confirmar verde (zero falhas)
- [ ] Verificar cobertura do arquivo (≥ 80%)
- [ ] Remover console.logs e código de debug
- [ ] Atualizar TEST-PROGRESS.md

---

## 🎯 Boas Práticas

### Nomenclatura de Testes

```typescript
// ✅ BOM — descreve comportamento
it('retorna erro quando usuário não existe')
it('exibe mensagem de sucesso após salvar')
it('desabilita botão durante loading')

// ❌ RUIM — descreve implementação
it('chama setState com null')
it('test1')
it('should work')
```

### Estrutura AAA

```typescript
it('descrição', async () => {
  // Arrange — prepara dados e mocks
  const input = { id: '1' }
  mockRepo.findById.mockResolvedValue({ id: '1', name: 'João' })
  
  // Act — executa ação
  const result = await useCase.execute(input)
  
  // Assert — verifica resultado
  expect(result.name).toBe('João')
  expect(mockRepo.findById).toHaveBeenCalledWith('1')
})
```

### Queries Semânticas (Frontend)

```typescript
// ✅ BOM — acessível
screen.getByRole('button', { name: /salvar/i })
screen.getByLabelText(/e-mail/i)
screen.getByText(/bem-vindo/i)

// ❌ RUIM — não acessível
screen.getByTestId('save-button')
screen.getByClassName('btn-primary')
```

---

**Próximo passo:** Escolha o template apropriado e adapte para seu caso de uso específico.
