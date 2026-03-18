---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Workflow](../guides/workflow.md) | [Templates](../templates/)

# Padrões e Boas Práticas

Princípios SOLID, Clean Code e padrões de testes aplicados ao projeto sm-iter.

---

## 🎯 Princípios Essenciais

### Um Teste, Uma Responsabilidade

```typescript
// ✅ BOM — testa apenas uma coisa
it('retorna usuário quando encontrado', async () => {
  const user = await service.findById('1')
  expect(user.id).toBe('1')
})

// ❌ RUIM — testa múltiplas coisas
it('busca usuário, atualiza cache e emite evento', async () => {
  const user = await service.findById('1')
  expect(user.id).toBe('1')
  expect(cache.set).toHaveBeenCalled()
  expect(eventEmitter.emit).toHaveBeenCalled()
})
```

### Mocks Devem Respeitar Contratos

```typescript
// ✅ BOM — mock respeita interface
const mockRepository: IUserRepository = {
  findById: jest.fn(), // retorna Promise<User | null>
}

// ❌ RUIM — mock não respeita contrato
const mockRepository = {
  findById: jest.fn().mockReturnValue({ id: '1' }), // retorna User, não Promise
}
```

---

## 🧹 Clean Code em Testes

### Nomenclatura Clara

```typescript
// ✅ BOM — descreve comportamento esperado
it('lança NotFoundException quando aluno não existe')
it('retorna lista vazia quando não há resultados')
it('envia e-mail de boas-vindas após criar usuário')

// ❌ RUIM — vago ou técnico demais
it('test1')
it('should work')
it('chama findById com null')
```

### Estrutura AAA (Arrange-Act-Assert) {#estrutura-aaa}

```typescript
it('calcula desconto corretamente', () => {
  // Arrange — preparar dados
  const preco = 100
  const percentual = 10
  
  // Act — executar ação
  const resultado = calcularDesconto(preco, percentual)
  
  // Assert — verificar resultado
  expect(resultado).toBe(90)
})
```

### DRY (Don't Repeat Yourself)

```typescript
// ✅ BOM — helper reutilizável
const criarAlunoMock = (overrides = {}) => ({
  id: '1',
  nome: 'João',
  email: 'joao@test.com',
  ...overrides,
})

it('teste 1', () => {
  const aluno = criarAlunoMock({ nome: 'Maria' })
  // ...
})

it('teste 2', () => {
  const aluno = criarAlunoMock({ email: 'outro@test.com' })
  // ...
})

// ❌ RUIM — duplicar objeto em cada teste
it('teste 1', () => {
  const aluno = { id: '1', nome: 'Maria', email: 'joao@test.com' }
  // ...
})

it('teste 2', () => {
  const aluno = { id: '1', nome: 'João', email: 'outro@test.com' }
  // ...
})
```

### Testes Independentes

```typescript
// ✅ BOM — cada teste limpa seu estado
describe('UserService', () => {
  let service: UserService
  
  beforeEach(() => {
    service = new UserService()
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('teste 1', () => { /* ... */ })
  it('teste 2', () => { /* ... */ })
})

// ❌ RUIM — testes dependem da ordem
let user: User

it('cria usuário', () => {
  user = service.create({ name: 'João' })
})

it('atualiza usuário', () => {
  service.update(user.id, { name: 'Maria' }) // depende do teste anterior
})
```

### Evitar Lógica Complexa em Testes

```typescript
// ✅ BOM — teste direto
it('retorna 3 usuários', () => {
  expect(result.length).toBe(3)
})

// ❌ RUIM — lógica condicional no teste
it('retorna usuários', () => {
  if (result.length > 0) {
    expect(result[0]).toBeDefined()
  }
})
```


---

## 🎯 Padrões Específicos do Projeto

### Backend (NestJS + Jest)

#### Mock de Repositório

```typescript
const mockRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})
```

#### Mock de Use Case com DI

```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    CreateAlunoUseCase,
    {
      provide: 'IAlunoRepository',
      useValue: mockRepository,
    },
  ],
}).compile()

const useCase = module.get<CreateAlunoUseCase>(CreateAlunoUseCase)
```

#### Testar Exceções HTTP

```typescript
await expect(useCase.execute(input)).rejects.toThrow(NotFoundException)

await expect(useCase.execute(input)).rejects.toMatchObject({
  message: 'Aluno não encontrado',
  status: 404,
})
```

### Frontend (React + Vitest)

#### Queries Semânticas

```typescript
// Ordem de preferência
screen.getByRole('button', { name: /salvar/i })
screen.getByLabelText(/e-mail/i)
screen.getByPlaceholderText(/digite seu nome/i)
screen.getByText(/bem-vindo/i)
screen.getByDisplayValue('João')

// ❌ NUNCA usar
screen.getByTestId('save-button')
```

#### User Events

```typescript
import userEvent from '@testing-library/user-event'

it('preenche formulário', async () => {
  const user = userEvent.setup()
  
  await user.type(screen.getByLabelText(/nome/i), 'João')
  await user.click(screen.getByRole('button', { name: /salvar/i }))
  
  await waitFor(() => {
    expect(screen.getByText(/sucesso/i)).toBeInTheDocument()
  })
})
```

#### Render com Providers

```typescript
import { renderWithProviders } from '@/test/utils/render'

it('exibe dados do usuário', () => {
  renderWithProviders(<UserProfile />)
  expect(screen.getByText(/joão silva/i)).toBeInTheDocument()
})
```

---

## 🚫 Anti-Patterns a Evitar

### 1. Testar Detalhes de Implementação

```typescript
// ❌ RUIM — testa implementação interna
it('chama setState com valor correto', () => {
  const spy = jest.spyOn(component, 'setState')
  component.handleClick()
  expect(spy).toHaveBeenCalledWith({ count: 1 })
})

// ✅ BOM — testa comportamento visível
it('incrementa contador ao clicar', async () => {
  render(<Counter />)
  await user.click(screen.getByRole('button'))
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### 2. Testes Frágeis (Snapshot Abuse)

```typescript
// ❌ RUIM — snapshot de componente complexo
it('renderiza corretamente', () => {
  const { container } = render(<ComplexComponent />)
  expect(container).toMatchSnapshot()
})

// ✅ BOM — testa comportamento específico
it('exibe título correto', () => {
  render(<ComplexComponent title="Bem-vindo" />)
  expect(screen.getByRole('heading', { name: /bem-vindo/i })).toBeInTheDocument()
})
```

### 3. Mocks Excessivos

```typescript
// ❌ RUIM — mocka tudo, até funções puras
jest.mock('./utils/sum')
jest.mock('./utils/multiply')
jest.mock('./utils/divide')

// ✅ BOM — mocka apenas dependências externas
jest.mock('axios')
jest.mock('@/services/api')
```

### 4. Testes Muito Longos

```typescript
// ❌ RUIM — teste gigante que testa tudo
it('fluxo completo de cadastro', async () => {
  // 100 linhas de código testando múltiplos cenários
})

// ✅ BOM — testes pequenos e focados
it('valida e-mail obrigatório', async () => { /* ... */ })
it('valida formato de e-mail', async () => { /* ... */ })
it('cria usuário com dados válidos', async () => { /* ... */ })
```

### 5. Dependência entre Testes

```typescript
// ❌ RUIM — testes dependem da ordem
let userId: string

it('cria usuário', async () => {
  const user = await service.create({ name: 'João' })
  userId = user.id
})

it('busca usuário', async () => {
  const user = await service.findById(userId) // depende do teste anterior
  expect(user.name).toBe('João')
})

// ✅ BOM — testes independentes
it('cria usuário', async () => {
  const user = await service.create({ name: 'João' })
  expect(user.id).toBeDefined()
})

it('busca usuário', async () => {
  mockRepository.findById.mockResolvedValue({ id: '1', name: 'João' })
  const user = await service.findById('1')
  expect(user.name).toBe('João')
})
```

---

## ✅ Checklist de Qualidade

### Antes de Commitar

- [ ] Todos os testes passando (`pnpm test`)
- [ ] Cobertura adequada (≥ 80% para módulos críticos)
- [ ] Nomenclatura clara e descritiva
- [ ] Estrutura AAA seguida
- [ ] Sem console.logs ou código de debug
- [ ] Mocks centralizados (não inline)
- [ ] Sem dependência entre testes
- [ ] Queries semânticas (frontend)

### Code Review

- [ ] Testes testam comportamento, não implementação
- [ ] Casos de borda cobertos (null, undefined, vazios)
- [ ] Erros esperados testados
- [ ] Sem lógica complexa nos testes
- [ ] Sem snapshots desnecessários
- [ ] Documentação atualizada (TEST-PROGRESS.md)

---

## 📚 Referências

- [Testing Library - Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Jest - Best Practices](https://jestjs.io/docs/best-practices)
- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Próximo passo:** Aplique estes padrões ao implementar novos testes no projeto.
