---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Padrões](../reference/patterns.md) | [Guias](../guides/)

# Templates de Criação de Mocks

Templates e padrões para criar mocks centralizados reutilizáveis.

---

## 🎯 Princípios de Mocks

1. **Centralização** — Um mock por dependência, reutilizado em todos os testes
2. **Factory Pattern** — Função para criar/resetar mocks entre testes
3. **Tipos Completos** — TypeScript com tipos corretos
4. **Documentação** — Comentário `// @MOCK` em cada método
5. **Contrato Real** — Mock deve respeitar interface da dependência real

---

## 🔧 Template Backend (Jest)

### Mock de Repositório (Prisma)

```typescript
/**
 * Mock centralizado do PrismaClient
 * Uso: import { prismaMock, resetPrismaMock } from '@/test/mocks/prisma.mock'
 */

export const createPrismaMock = () => ({
  aluno: {
    findFirst: jest.fn(), // @MOCK
    findUnique: jest.fn(), // @MOCK
    findMany: jest.fn(), // @MOCK
    create: jest.fn(), // @MOCK
    update: jest.fn(), // @MOCK
    delete: jest.fn(), // @MOCK
    count: jest.fn(), // @MOCK
  },
  curso: {
    findFirst: jest.fn(), // @MOCK
    findUnique: jest.fn(), // @MOCK
    findMany: jest.fn(), // @MOCK
    create: jest.fn(), // @MOCK
    update: jest.fn(), // @MOCK
  },
  // Adicione outras entidades conforme necessário
  $transaction: jest.fn((fn) => fn(prismaMock)), // @MOCK
  $connect: jest.fn(), // @MOCK
  $disconnect: jest.fn(), // @MOCK
})

export let prismaMock = createPrismaMock()

export const resetPrismaMock = () => {
  prismaMock = createPrismaMock()
}
```

**Uso em testes:**

```typescript
import { prismaMock, resetPrismaMock } from '@/test/mocks/prisma.mock'

describe('CreateAlunoUseCase', () => {
  beforeEach(() => {
    resetPrismaMock()
  })

  it('cria aluno com sucesso', async () => {
    // Arrange
    const alunoData = { nome: 'João', email: 'joao@test.com' }
    prismaMock.aluno.create.mockResolvedValue({ id: '1', ...alunoData })

    // Act
    const result = await useCase.execute(alunoData)

    // Assert
    expect(result.id).toBe('1')
    expect(prismaMock.aluno.create).toHaveBeenCalledWith({
      data: alunoData
    })
  })
})
```

### Mock de Serviço Externo (AWS, APIs)

```typescript
/**
 * Mocks centralizados dos serviços AWS
 * Uso: import { mockS3Service, mockSQSService, resetAWSMocks } from '@/test/mocks/aws.mock'
 */

export const createS3Mock = () => ({
  upload: jest.fn().mockResolvedValue({ url: 'https://s3.mock/file.pdf' }), // @MOCK
  delete: jest.fn().mockResolvedValue(undefined), // @MOCK
  getSignedUrl: jest.fn().mockResolvedValue('https://s3.mock/signed'), // @MOCK
})

export const createSQSMock = () => ({
  sendMessage: jest.fn().mockResolvedValue({ MessageId: 'mock-id' }), // @MOCK
  receiveMessage: jest.fn().mockResolvedValue({ Messages: [] }), // @MOCK
})

export const createSESMock = () => ({
  sendMail: jest.fn().mockResolvedValue(undefined), // @MOCK
})

export let mockS3Service = createS3Mock()
export let mockSQSService = createSQSMock()
export let mockMailProvider = createSESMock()

export const resetAWSMocks = () => {
  mockS3Service = createS3Mock()
  mockSQSService = createSQSMock()
  mockMailProvider = createSESMock()
}
```

### Mock de Guard/Autenticação (Keycloak)

```typescript
/**
 * Mocks centralizados do Keycloak
 * Uso: import { mockKeycloakToken, mockAuthGuard, mockRequest } from '@/test/mocks/keycloak.mock'
 */

export const mockKeycloakToken = {
  sub: 'user-uuid-mock',
  email: 'dev@test.com',
  realm_access: { roles: ['admin'] },
  resource_access: { 'sm-iter': { roles: ['admin'] } },
}

export const mockAuthGuard = {
  canActivate: jest.fn().mockReturnValue(true), // @MOCK
}

export const mockRequest = (overrides = {}) => ({
  user: mockKeycloakToken,
  headers: { authorization: 'Bearer mock-token' },
  ...overrides,
})

export const createUserToken = (overrides = {}) => ({
  ...mockKeycloakToken,
  ...overrides,
})
```

### Mock de EventEmitter

```typescript
/**
 * Mock centralizado do EventEmitter2
 * Uso: import { mockEventEmitter, resetEventEmitterMock } from '@/test/mocks/event-emitter.mock'
 */

export const createEventEmitterMock = () => ({
  emit: jest.fn(), // @MOCK
  on: jest.fn(), // @MOCK
  off: jest.fn(), // @MOCK
  once: jest.fn(), // @MOCK
})

export let mockEventEmitter = createEventEmitterMock()

export const resetEventEmitterMock = () => {
  mockEventEmitter = createEventEmitterMock()
}
```

---

## ⚛️ Template Frontend (Vitest)

### Mock de Hook Customizado

> **Nota:** Adapte este template aos hooks reais do projeto sm-iter. Os exemplos abaixo são ilustrativos.

```typescript
/**
 * Mock de hook customizado
 * Uso: import { mockUseCustomHook, resetMock } from '@/test/utils/custom-hook'
 */
import { vi } from 'vitest'

export const createCustomHookMock = () => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: vi.fn(), // @MOCK
})

export let mockUseCustomHook = createCustomHookMock()

export const resetMock = () => {
  mockUseCustomHook = createCustomHookMock()
}

// Mock do módulo
vi.mock('@/hooks/useCustomHook', () => ({
  useCustomHook: () => mockUseCustomHook,
}))
```

### Mock de API/Serviço (Axios)

```typescript
/**
 * Mock centralizado do Axios
 * Uso: import { mockAxios, resetAxiosMock } from '@/test/utils/axios'
 */
import { vi } from 'vitest'
import axios from 'axios'

vi.mock('axios')

export const createAxiosMock = () => ({
  get: vi.fn(), // @MOCK
  post: vi.fn(), // @MOCK
  put: vi.fn(), // @MOCK
  delete: vi.fn(), // @MOCK
  patch: vi.fn(), // @MOCK
})

export const mockAxios = createAxiosMock()

export const resetAxiosMock = () => {
  vi.mocked(axios.get).mockReset()
  vi.mocked(axios.post).mockReset()
  vi.mocked(axios.put).mockReset()
  vi.mocked(axios.delete).mockReset()
  vi.mocked(axios.patch).mockReset()
}

// Configurar mocks padrão
vi.mocked(axios.get).mockImplementation(mockAxios.get)
vi.mocked(axios.post).mockImplementation(mockAxios.post)
vi.mocked(axios.put).mockImplementation(mockAxios.put)
vi.mocked(axios.delete).mockImplementation(mockAxios.delete)
vi.mocked(axios.patch).mockImplementation(mockAxios.patch)
```


---

## 📝 Checklist de Criação de Mock

### Antes de Criar
- [ ] Verificar se mock similar já existe
- [ ] Identificar todos os métodos públicos necessários
- [ ] Verificar tipos TypeScript da dependência real

### Durante Criação
- [ ] Usar factory pattern (`create[Nome]Mock()`)
- [ ] Adicionar comentário `// @MOCK` em cada método
- [ ] Incluir função de reset (`reset[Nome]Mock()`)
- [ ] Documentar uso no topo do arquivo
- [ ] Respeitar tipos TypeScript

### Após Criação
- [ ] Criar ou atualizar README.md do diretório de mocks
- [ ] Refatorar testes existentes que usam mocks inline
- [ ] Rodar `pnpm test` para confirmar que nada quebrou
- [ ] Documentar em TEST-PROGRESS.md se relevante

---

## 🎯 Boas Práticas

### ✅ Fazer

- Centralizar mocks em `src/test/mocks/` (backend) ou `test/utils/` (frontend)
- Usar factory pattern para criar instâncias limpas
- Documentar cada mock com comentário de uso
- Incluir tipos TypeScript completos
- Resetar mocks entre testes (`beforeEach`)

### ❌ Evitar

- Mocks inline duplicados em múltiplos testes
- Mocks sem tipos TypeScript
- Mocks que não respeitam contrato da dependência real
- Hardcoded values que dificultam customização
- Mocks sem documentação

---

## 📚 Exemplos Completos

### Backend: Mock de Repository Customizado

```typescript
/**
 * Mock do AlunoRepository
 * Uso: import { mockAlunoRepository, resetAlunoRepositoryMock } from '@/test/mocks/aluno-repository.mock'
 */

import { IAlunoRepository } from '@/core/domain/repositories/IAlunoRepository'

export const createAlunoRepositoryMock = (): jest.Mocked<IAlunoRepository> => ({
  findById: jest.fn(), // @MOCK
  findAll: jest.fn(), // @MOCK
  findByEmail: jest.fn(), // @MOCK
  create: jest.fn(), // @MOCK
  update: jest.fn(), // @MOCK
  delete: jest.fn(), // @MOCK
  count: jest.fn(), // @MOCK
})

export let mockAlunoRepository = createAlunoRepositoryMock()

export const resetAlunoRepositoryMock = () => {
  mockAlunoRepository = createAlunoRepositoryMock()
}
```


---

**Próximo passo:** Use estes templates ao criar novos mocks centralizados no projeto.
