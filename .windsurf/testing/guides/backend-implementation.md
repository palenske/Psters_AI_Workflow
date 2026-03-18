---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Regras](../rules/backend.md) | [Workflow](./workflow.md)

# Guia de Implementação — Backend (sm-iter-api)

Guia completo para implementação de testes unitários no backend do sm-iter usando NestJS + Jest.

> ⚠️ **IMPORTANTE:** Os exemplos de funções e arquivos neste guia são **ILUSTRATIVOS**. Sempre adapte ao código real do projeto consultando `TEST-PROGRESS.md` e verificando os arquivos existentes.

---

## 🎯 Contexto do Projeto

### Stack Tecnológica
- **Framework:** NestJS 10 + TypeScript 4.3
- **ORM:** Prisma 5.6 + MySQL
- **Autenticação:** Keycloak (nest-keycloak-connect) com guards globais
- **Mensageria:** AWS SQS + @nestjs/event-emitter
- **Integrações externas:** AWS S3/SES/SQS, Mercado Pago, Bitrix, HeyGen, OpenAI
- **Validação:** class-validator + class-transformer via ValidationPipe global
- **Testes:** Jest 27 + ts-jest

### Estado Atual
- **Cobertura:** ~4% global (functions: 3.88%, lines: 4.17%, branches: 3.51%)
- **Arquivos de teste:** 26 arquivos `.spec.ts` criados
- **Módulos cobertos:** shared/utils (parcial) + core/useCases/alunos (74%)
- **Pendente:** Mocks centralizados + módulos de faturamento

---

## 📋 Passo 1 — Infraestrutura de Mocks

Antes de escrever testes de use cases, crie os mocks reutilizáveis centralizados.

### Criar `src/test/mocks/prisma.mock.ts`

Mock central do PrismaClient para uso em todos os repositórios:

```typescript
/**
 * Mock centralizado do PrismaClient
 * Uso: import { prismaMock } from '@/test/mocks/prisma.mock'
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
  fatura: {
    findFirst: jest.fn(), // @MOCK
    findUnique: jest.fn(), // @MOCK
    findMany: jest.fn(), // @MOCK
    create: jest.fn(), // @MOCK
    update: jest.fn(), // @MOCK
  },
  usuario: {
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

### Criar `src/test/mocks/aws.mock.ts`

Mock dos serviços AWS (S3, SQS, SES):

```typescript
/**
 * Mocks centralizados dos serviços AWS
 * Uso: import { mockS3Service, mockSQSService, mockMailProvider } from '@/test/mocks/aws.mock'
 */

export const mockS3Service = {
  upload: jest.fn().mockResolvedValue({ url: 'https://s3.mock/file.pdf' }), // @MOCK
  delete: jest.fn().mockResolvedValue(undefined), // @MOCK
  getSignedUrl: jest.fn().mockResolvedValue('https://s3.mock/signed'), // @MOCK
}

export const mockSQSService = {
  sendMessage: jest.fn().mockResolvedValue({ MessageId: 'mock-id' }), // @MOCK
  receiveMessage: jest.fn().mockResolvedValue({ Messages: [] }), // @MOCK
}

export const mockMailProvider = {
  sendMail: jest.fn().mockResolvedValue(undefined), // @MOCK
}

export const resetAWSMocks = () => {
  jest.clearAllMocks()
}
```

### Criar `src/test/mocks/keycloak.mock.ts`

Mock do contexto de autenticação Keycloak:

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
```

### Criar `src/test/mocks/event-emitter.mock.ts`

Mock do EventEmitter:

```typescript
/**
 * Mock centralizado do EventEmitter2
 * Uso: import { mockEventEmitter } from '@/test/mocks/event-emitter.mock'
 */

export const mockEventEmitter = {
  emit: jest.fn(), // @MOCK
  on: jest.fn(), // @MOCK
  off: jest.fn(), // @MOCK
  once: jest.fn(), // @MOCK
}

export const resetEventEmitterMock = () => {
  jest.clearAllMocks()
}
```

### Atualizar `src/test/setup.ts`

Se ainda não existir, criar com:

```typescript
// Silenciar logs nos testes
jest.spyOn(console, 'error').mockImplementation(() => {})
jest.spyOn(console, 'warn').mockImplementation(() => {})

// Variáveis de ambiente padrão para testes
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret'
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'mysql://test:test@localhost:3306/test'
```

---

## 📋 Passo 2 — Ordem de Implementação

### 2.1 Utilitários (`src/shared/utils/`)

**Prioridade:** Alta (mais simples, funções puras)

Arquivos já criados:
- ✅ `ParseUtils.spec.ts`
- ✅ `StringUtils.spec.ts`
- ✅ `LocatorUtils.spec.ts`

**Padrão para cada util:**

```typescript
import { StringUtils } from './StringUtils'

describe('StringUtils', () => {
  describe('método X', () => {
    it('comportamento esperado com entrada válida', () => {
      // Arrange
      const input = 'valor'
      
      // Act
      const result = StringUtils.metodoX(input)
      
      // Assert
      expect(result).toBe('esperado')
    })
    
    it('retorna fallback para entrada nula', () => {
      expect(StringUtils.metodoX(null)).toBe('')
    })
    
    it('retorna fallback para string vazia', () => {
      expect(StringUtils.metodoX('')).toBe('')
    })
  })
})
```

### 2.2 Use Cases de Alunos

**Prioridade:** Alta (já iniciado, 74% de cobertura)

Arquivos já criados (20 arquivos):
- ✅ `CreateAlunoUseCase.spec.ts`
- ✅ `FindAllAlunosUseCase.spec.ts`
- ✅ `GetAlunoByIdUseCase.spec.ts`
- ✅ `UpdateAlunoUseCase.spec.ts`
- E mais 16 arquivos...

**Template para use cases de CRUD:**

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { FindAllAlunosUseCase } from './FindAllAlunosUseCase'

const mockAlunoRepository = {
  findAll: jest.fn(), // @MOCK
  findById: jest.fn(), // @MOCK
}

describe('FindAllAlunosUseCase', () => {
  let useCase: FindAllAlunosUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllAlunosUseCase,
        {
          provide: 'IAlunoRepository',
          useValue: mockAlunoRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindAllAlunosUseCase>(FindAllAlunosUseCase)
  })

  afterEach(() => jest.clearAllMocks())

  it('retorna lista de alunos', async () => {
    // Arrange
    const alunos = [{ id: '1', nome: 'João' }, { id: '2', nome: 'Maria' }]
    mockAlunoRepository.findAll.mockResolvedValue(alunos)

    // Act
    const result = await useCase.execute({})

    // Assert
    expect(result).toHaveLength(2)
    expect(mockAlunoRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('retorna lista vazia quando não há alunos', async () => {
    // Arrange
    mockAlunoRepository.findAll.mockResolvedValue([])
    
    // Act
    const result = await useCase.execute({})
    
    // Assert
    expect(result).toEqual([])
  })

  it('propaga erro do repositório', async () => {
    // Arrange
    mockAlunoRepository.findAll.mockRejectedValue(new Error('DB error'))
    
    // Act & Assert
    await expect(useCase.execute({})).rejects.toThrow('DB error')
  })
})
```

### 2.3 Use Cases de Faturamento

**Prioridade:** Alta (lógica de negócio crítica, 0% de cobertura)

Arquivos prioritários (baseados nos use cases existentes no projeto):
- [ ] `CreateFaturaUseCase.spec.ts`
- [ ] `CancelarFaturaUseCase.spec.ts`
- [ ] `GetFaturaByIdUseCase.spec.ts`
- [ ] `GetFaturaByMPSubscriptionIdUseCase.spec.ts`
- [ ] `SendInvoiceEmailUseCase.spec.ts`
- [ ] `ExportInvoicesUseCase.spec.ts`
- [ ] `CreateSubscriptionUseCase.spec.ts`
- [ ] `CancelSubscriptionUseCase.spec.ts`
- [ ] `GetLinkAssinaturaUseCase.spec.ts`

**Template para use cases com lógica complexa:**

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CancelarFaturaUseCase } from './CancelarFaturaUseCase'

const mockFaturaRepository = {
  findById: jest.fn(), // @MOCK
  update: jest.fn(), // @MOCK
}

const mockMercadoPagoService = {
  cancelarSubscription: jest.fn(), // @MOCK
  estornarPagamento: jest.fn(), // @MOCK
}

describe('CancelarFaturaUseCase', () => {
  let useCase: CancelarFaturaUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelarFaturaUseCase,
        {
          provide: 'IFaturaRepository',
          useValue: mockFaturaRepository,
        },
        {
          provide: 'MercadoPagoService',
          useValue: mockMercadoPagoService,
        },
      ],
    }).compile()

    useCase = module.get<CancelarFaturaUseCase>(CancelarFaturaUseCase)
  })

  afterEach(() => jest.clearAllMocks())

  it('cancela fatura ativa com sucesso', async () => {
    // Arrange
    mockFaturaRepository.findById.mockResolvedValue({
      id: '1',
      status: 'ATIVA',
      mpSubscriptionId: 'sub_123'
    })
    mockMercadoPagoService.cancelarSubscription.mockResolvedValue({ status: 'cancelled' })
    mockFaturaRepository.update.mockResolvedValue({ id: '1', status: 'CANCELADA' })

    // Act
    const result = await useCase.execute({ faturaId: '1' })

    // Assert
    expect(result.status).toBe('CANCELADA')
    expect(mockMercadoPagoService.cancelarSubscription).toHaveBeenCalledWith('sub_123')
  })

  it('lança BadRequestException para fatura já cancelada', async () => {
    // Arrange
    mockFaturaRepository.findById.mockResolvedValue({ id: '1', status: 'CANCELADA' })

    // Act & Assert
    await expect(useCase.execute({ faturaId: '1' }))
      .rejects.toThrow(BadRequestException)
  })

  it('lança NotFoundException para fatura inexistente', async () => {
    // Arrange
    mockFaturaRepository.findById.mockResolvedValue(null)

    // Act & Assert
    await expect(useCase.execute({ faturaId: '999' }))
      .rejects.toThrow(NotFoundException)
  })
})
```

### 2.4 Guards e Interceptors

**Prioridade:** Média

**Template para guards:**

```typescript
import { ExecutionContext } from '@nestjs/common'
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
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException)
  })
})
```

### 2.5 Serviços de Mensageria/Eventos

**Prioridade:** Média

**Template para serviços de e-mail:**

```typescript
import { SendMailUseCase } from './SendMailUseCase'
import { mockMailProvider } from '@/test/mocks/aws.mock'

describe('SendMailUseCase', () => {
  let useCase: SendMailUseCase

  beforeEach(() => {
    useCase = new SendMailUseCase(mockMailProvider)
  })

  afterEach(() => jest.clearAllMocks())

  it('envia e-mail com os dados corretos', async () => {
    // Arrange
    const input = {
      to: 'aluno@test.com',
      subject: 'Bem-vindo',
      body: '<p>Olá</p>',
    }

    // Act
    await useCase.execute(input)

    // Assert
    expect(mockMailProvider.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'aluno@test.com' })
    )
  })

  it('propaga erro quando provedor de e-mail falha', async () => {
    // Arrange
    mockMailProvider.sendMail.mockRejectedValue(new Error('SMTP timeout'))
    
    // Act & Assert
    await expect(useCase.execute({ to: 'x@x.com', subject: '', body: '' }))
      .rejects.toThrow('SMTP timeout')
  })
})
```

---

## 📋 Padrões Obrigatórios

### Nomenclatura de Arquivos
- Use cases: `NomeDoUseCase.spec.ts` (mesma pasta do arquivo)
- Utils: `NomeDoUtil.spec.ts` (mesma pasta)
- Guards: `nome.guard.spec.ts`
- **Não criar pastas `__tests__` separadas** — manter colocado (colocation)

### Estrutura AAA Obrigatória

```typescript
it('descrição clara do comportamento esperado', async () => {
  // Arrange — prepara o estado
  mockRepo.findById.mockResolvedValue({ id: '1', ... })

  // Act — executa a ação
  const result = await useCase.execute({ id: '1' })

  // Assert — verifica o resultado
  expect(result).toMatchObject({ id: '1' })
  expect(mockRepo.findById).toHaveBeenCalledWith('1')
})
```

### Limpeza Entre Testes

```typescript
afterEach(() => {
  jest.clearAllMocks() // limpa calls/instances
  // NÃO use jest.resetAllMocks() — remove implementações padrão
})
```

### Testando Exceções HTTP do NestJS

```typescript
// Testar tipo de exceção
await expect(useCase.execute(input)).rejects.toThrow(NotFoundException)

// Testar mensagem e status
await expect(useCase.execute(input)).rejects.toMatchObject({
  message: 'Aluno não encontrado',
  status: 404,
})
```

---

## 📋 Comandos de Referência

```bash
# Rodar todos os testes
pnpm --filter sm-iter-api test

# Rodar apenas um arquivo
pnpm --filter sm-iter-api test -- CreateAlunoUseCase.spec.ts

# Rodar com watch (durante desenvolvimento)
pnpm --filter sm-iter-api test:watch

# Gerar relatório de cobertura
pnpm --filter sm-iter-api test:cov

# Debug de um teste específico
pnpm --filter sm-iter-api test:debug -- CreateAlunoUseCase.spec.ts
```

Mais comandos: [reference/commands.md](../reference/commands.md)

---

## 📊 Thresholds Progressivos

| Fase | branches | functions | lines | Quando atingir |
|------|----------|-----------|-------|----------------|
| Atual | 3% | 3% | 4% | Estado atual |
| Fase 2 | 20% | 30% | 30% | Após criar mocks + cobrir faturamento |
| Fase 3 | 40% | 50% | 50% | Após cobrir guards + mensageria |
| Fase 4 | 60% | 70% | 70% | Após cobrir integrações |
| Meta final | 70% | 80% | 80% | Estável |

**Regra:** Nunca aumentar threshold além da cobertura real atual.

---

## ✅ Checklist de Implementação

### Antes de Começar
- [ ] Ler TEST-PROGRESS.md
- [ ] Criar mocks centralizados em `src/test/mocks/`
- [ ] Validar que `jest.config.js` está correto

### Durante Implementação
- [ ] Um arquivo de teste por vez
- [ ] Seguir estrutura AAA
- [ ] Usar mocks centralizados
- [ ] Rodar teste após cada arquivo
- [ ] Verde antes de avançar

### Ao Final
- [ ] Todos os testes passando
- [ ] Cobertura documentada
- [ ] TEST-PROGRESS.md atualizado
- [ ] Próximos passos definidos

---

**Próximos passos:** Consulte [TEST-PROGRESS.md](../../../apps/sm-iter-api/TEST-PROGRESS.md) para ver o roadmap atual.
