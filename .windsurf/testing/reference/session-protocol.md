---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Templates](../templates/session-prompts.md) | [Workflow](../guides/workflow.md)

# Protocolo de Output de Sessões

Define o contrato de comunicação entre desenvolvedor e Windsurf durante sessões de implementação de testes unitários.

---

## 🎯 Propósito

O output de sessão serve como:
- **Checkpoint** do estado atual dos testes
- **Documentação** do progresso realizado
- **Ponto de retomada** para próxima sessão
- **Histórico** de decisões e bloqueios

> 💡 **Workflow Automático:** Este protocolo faz parte do workflow automático de 6 fases. Consulte [`WORKFLOW-CONFIG.md`](../WORKFLOW-CONFIG.md) para detalhes completos.

---

## 📋 Para a LLM — Instruções Permanentes

### Ao Iniciar Cada Sessão

1. Leia o bloco de retomada fornecido pelo usuário
2. Apresente um resumo do estado atual
3. Proponha a lista de arquivos a criar nesta sessão
4. Aguarde aprovação antes de implementar qualquer coisa

### Durante a Sessão

- Implemente **um arquivo de teste por vez**
- Após cada arquivo: rode `pnpm test -- [arquivo]` e confirme verde
- Nunca avance para o próximo arquivo com testes quebrando
- Nunca altere configs (`jest.config.js`, `vitest.config.ts`) sem aprovação explícita

### Ao Encerrar a Sessão

1. Pare toda implementação
2. Execute `pnpm test` — registre o resultado
3. Execute `pnpm test:cov` — colete os números reais
4. Emita o **Output de Sessão** com os dados reais
5. Aguarde confirmação do usuário antes de encerrar

> ⚠️ **Nunca estime cobertura.** Só preencha o output com valores reais do `pnpm test:cov`.
> ⚠️ Se qualquer teste estiver falhando, o status é ❌ — não ⚠️.

---

## 🚨 Gatilhos para Emitir o Output

Emita o output automaticamente ao detectar:

| Gatilho | Sinal |
|---------|-------|
| Encerramento explícito | "encerra", "fecha", "até amanhã", "por hoje é isso" |
| Bloqueio sem resolução | Mesmo erro após 2 tentativas |
| Solicitação de status | "como estamos?", "qual o estado?" |
| Contexto próximo do limite | Janela > 70% preenchida |

---

## 📄 Formato do Output de Sessão

### Template Completo

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT DE SESSÃO — [Backend | Frontend] (sm-iter-[api|painel])
Data: DD/MM/AAAA  |  Sessão: #N
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STATUS
✅ Verde  /  ⚠️ Parcial  /  ❌ Quebrado
(marcar um — se ❌, detalhar em BLOQUEIOS)

---

## ARQUIVOS CRIADOS
- src/.../NomeDoArquivo.spec.ts
  Cobre: [o que testa em uma linha]
  Casos: [happy path | erro X | edge case Y]

(repetir para cada arquivo criado)

---

## COBERTURA ATUAL
Fonte: pnpm test:cov — valores reais

| Módulo                | Functions | Lines | Branches |
|-----------------------|-----------|-------|----------|
| shared/utils          | X%        | X%    | X%       |
| [módulo desta sessão] | X%        | X%    | X%       |
| GLOBAL                | X%        | X%    | X%       |

Threshold configurado: functions X% / lines X% / branches X%
CI/pipeline: ✅ passando  /  ❌ falhando por threshold

---

## MOCKS
Criados ou alterados nesta sessão:
- src/test/mocks/[arquivo].ts — [o que mocka]
(ou: nenhum mock novo)

---

## DECISÕES
Registrar apenas o que afeta sessões futuras:
1. [decisão] — [justificativa]
(ou: nenhuma decisão relevante)

---

## BLOQUEIOS
| Módulo/Arquivo | Motivo | O que precisa para desbloquear |
|----------------|--------|-------------------------------|
| ...            | ...    | ...                           |
(ou: nenhum bloqueio)

---

## PRÓXIMA SESSÃO
Em ordem de prioridade:
1. src/.../Arquivo.spec.ts — [contexto]
2. src/.../Arquivo.spec.ts — [contexto]
3. src/.../Arquivo.spec.ts — [contexto]

Ajuste de threshold: Sim — de X% para Y% após [condição]
                     Não necessário ainda

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PROMPT DE RETOMADA
(copiar e colar no início da próxima sessão)

---
Retomada de testes — [Backend | Frontend] sm-iter-[api|painel] | Sessão #[N+1]

Cobertura anterior: functions X% / lines X% / branches X%
Status anterior: [Verde / Parcial / Bloqueado]
Último arquivo criado: [nome]

Bloqueios ativos:
- [lista ou "nenhum"]

Prioridade desta sessão:
1. [arquivo] — [contexto]
2. [arquivo] — [contexto]
3. [arquivo] — [contexto]

Stack: [stack do projeto]
Mocks disponíveis: [localização dos mocks]
Threshold atual: functions X% / lines X% / branches X%

Leia este bloco, apresente o estado atual e aguarde aprovação para começar.
---
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📝 Exemplo de Output — Backend

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT DE SESSÃO — Backend (sm-iter-api)
Data: 04/03/2026  |  Sessão: #3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STATUS
✅ Verde

---

## ARQUIVOS CRIADOS
- src/test/mocks/prisma.mock.ts
  Cobre: Mock centralizado do PrismaClient
  Casos: Factory pattern com reset

- src/test/mocks/aws.mock.ts
  Cobre: Mocks de S3, SQS, SES
  Casos: Métodos principais mockados

- src/core/application/useCases/CreateFaturaUseCase.spec.ts
  Cobre: Criação de fatura com validações
  Casos: happy path | fatura duplicada | aluno inexistente

---

## COBERTURA ATUAL
Fonte: pnpm test:cov — valores reais

| Módulo                     | Functions | Lines | Branches |
|----------------------------|-----------|-------|----------|
| shared/utils               | 85%       | 88%   | 75%      |
| core/useCases/alunos       | 74%       | 77%   | 53%      |
| core/useCases/faturamento  | 45%       | 50%   | 30%      |
| GLOBAL                     | 12%       | 14%   | 10%      |

Threshold configurado: functions 3% / lines 4% / branches 3%
CI/pipeline: ✅ passando

---

## MOCKS
Criados nesta sessão:
- src/test/mocks/prisma.mock.ts — PrismaClient completo
- src/test/mocks/aws.mock.ts — S3, SQS, SES

---

## DECISÕES
1. Criados mocks centralizados antes de continuar use cases — evita duplicação
2. Threshold mantido baixo até cobrir todos os módulos críticos

---

## BLOQUEIOS
Nenhum bloqueio

---

## PRÓXIMA SESSÃO
Em ordem de prioridade:
1. src/core/application/useCases/CancelarFaturaUseCase.spec.ts — lógica crítica de cancelamento
2. src/core/application/useCases/ProcessPaymentUseCase.spec.ts — integração com Mercado Pago
3. src/shared/guards/auth.guard.spec.ts — guard de autenticação Keycloak

Ajuste de threshold: Sim — de 3%/4%/3% para 20%/30%/30% após cobrir faturamento

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PROMPT DE RETOMADA
(copiar e colar no início da próxima sessão)

---
Retomada de testes — Backend sm-iter-api | Sessão #4

Cobertura anterior: functions 12% / lines 14% / branches 10%
Status anterior: Verde
Último arquivo criado: CreateFaturaUseCase.spec.ts

Bloqueios ativos:
- Nenhum

Prioridade desta sessão:
1. CancelarFaturaUseCase.spec.ts — lógica crítica de cancelamento
2. ProcessPaymentUseCase.spec.ts — integração com Mercado Pago
3. auth.guard.spec.ts — guard de autenticação Keycloak

Stack: NestJS 10 + Prisma 5.6 + MySQL + Keycloak + AWS SQS
Mocks disponíveis: src/test/mocks/ (prisma, aws, keycloak, event-emitter)
Threshold atual: functions 3% / lines 4% / branches 3%

Leia este bloco, apresente o estado atual e aguarde aprovação para começar.
---
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📝 Exemplo de Output — Frontend

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT DE SESSÃO — Frontend (sm-iter-painel)
Data: 04/03/2026  |  Sessão: #2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STATUS
✅ Verde

---

## ARQUIVOS CRIADOS
- hooks/useFetch.test.ts
  Cobre: Hook de data fetching com SWR
  Casos: loading | sucesso | erro | retry

- hooks/useDebounce.test.ts
  Cobre: Hook de debounce de valores
  Casos: delay correto | valor inicial | mudanças rápidas

- components/AutoColoredTag/AutoColoredTag.test.tsx
  Cobre: Componente de tag com cor automática
  Casos: renderização | cores | tamanhos

---

## COBERTURA ATUAL
Fonte: pnpm test:coverage — valores reais

| Módulo              | Functions | Lines | Branches |
|---------------------|-----------|-------|----------|
| lib/string          | 100%      | 94%   | 94%      |
| hooks/useIntegration| 100%      | 100%  | 100%     |
| hooks/useFetch      | 100%      | 100%  | 100%     |
| hooks/useDebounce   | 100%      | 100%  | 100%     |
| components/AutoColoredTag | 90% | 92%   | 85%      |
| GLOBAL              | 18%       | 15%   | 22%      |

Threshold configurado: functions 0.1% / lines 0.1% / branches 0.1%
CI/pipeline: ✅ passando

---

## MOCKS
Nenhum mock novo (usando mocks existentes de axios e providers)

---

## DECISÕES
1. Priorizados hooks antes de componentes — lógica mais crítica
2. Componentes puros testados sem providers — mais simples

---

## BLOQUEIOS
Nenhum bloqueio

---

## PRÓXIMA SESSÃO
Em ordem de prioridade:
1. hooks/useDashboardData.test.ts — hook complexo com múltiplas queries
2. components/StatusDisplay/StatusDisplay.test.tsx — componente reutilizado
3. components/LoginForm/LoginForm.test.tsx — formulário com validação

Ajuste de threshold: Sim — de 0.1% para 30%/40%/40% após cobrir hooks críticos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PROMPT DE RETOMADA
(copiar e colar no início da próxima sessão)

---
Retomada de testes — Frontend sm-iter-painel | Sessão #3

Cobertura anterior: functions 18% / lines 15% / branches 22%
Status anterior: Verde
Último arquivo criado: AutoColoredTag.test.tsx

Bloqueios ativos:
- Nenhum

Prioridade desta sessão:
1. useDashboardData.test.ts — hook complexo com múltiplas queries
2. StatusDisplay.test.tsx — componente reutilizado
3. LoginForm.test.tsx — formulário com validação

Stack: Next.js 14.2 + React 18.2 + Vitest 2.1 + Testing Library
Mocks disponíveis: test/utils/ (providers, router, session, render)
Threshold atual: functions 0.1% / lines 0.1% / branches 0.1%

Leia este bloco, apresente o estado atual e aguarde aprovação para começar.
---
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ✅ Checklist de Emissão do Output

### Antes de Emitir

- [ ] Todos os testes rodados (`pnpm test`)
- [ ] Cobertura coletada (`pnpm test:cov`)
- [ ] Números reais (não estimados)
- [ ] Status correto (✅/⚠️/❌)

### Conteúdo do Output

- [ ] Arquivos criados listados
- [ ] Cobertura por módulo documentada
- [ ] Mocks novos registrados
- [ ] Decisões importantes documentadas
- [ ] Bloqueios identificados
- [ ] Próximos passos definidos
- [ ] Prompt de retomada gerado

### Após Emitir

- [ ] Aguardar confirmação do usuário
- [ ] Não implementar nada novo
- [ ] Não fazer suposições sobre próxima sessão

---

## 🎯 Boas Práticas

### ✅ Fazer

- Coletar números reais de cobertura
- Documentar decisões que afetam futuro
- Ser específico sobre bloqueios
- Priorizar próximos arquivos claramente
- Gerar prompt de retomada completo

### ❌ Evitar

- Estimar cobertura sem rodar comandos
- Omitir bloqueios ou problemas
- Deixar próximos passos vagos
- Esquecer de atualizar TEST-PROGRESS.md
- Continuar implementando após emitir output

---

**Uso:** Este protocolo deve ser seguido ao final de toda sessão de testes para garantir continuidade e rastreabilidade.
