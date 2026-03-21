# Hooks do Cursor - Referência Histórica

Este documento descreve os hooks que existiam no plugin original para Cursor, mas que **não foram migrados** para o Trae devido a incompatibilidades no sistema de extensões.

---

## ⚠️ Por que os hooks não foram migrados?

**Cursor** usa um sistema de hooks baseado em `hooks.json` que permite executar scripts Node.js em eventos específicos do editor (afterFileEdit, stop, beforeShellExecution, afterShellExecution).

**Trae** usa um sistema de extensões diferente baseado em `extensions.json` com hook points específicos (before_plan, after_plan, before_work_plan, after_work_plan, before_work, after_work).

Os scripts `.mjs` dos hooks do Cursor dependem de APIs específicas do Cursor (`CURSOR_PLUGIN_ROOT`, eventos do editor) que não existem no Trae.

---

## 📋 Hooks Originais do Cursor

### 1. **afterFileEdit** - Rastreamento de Edições

**Arquivo**: `track-edit.mjs`

**Funcionalidade**:
- Rastreava quando arquivos de código ou documentação eram editados
- Mantinha estado em `.cursor/hooks/state/psters-ai-workflow.json`
- Registrava se código foi alterado sem atualizar docs
- Base para o hook `stop` lembrar de atualizar documentação

**Eventos rastreados**:
- Edições em arquivos de código (`.ts`, `.tsx`, `.js`, `.jsx`, `.py`, etc.)
- Edições em arquivos de documentação (`docs/**/*.md`)

---

### 2. **stop** - Lembrete de Documentação

**Arquivo**: `doc-guard-stop.mjs`

**Funcionalidade**:
- Executado quando o usuário parava a sessão do Cursor
- Verificava se código foi alterado sem atualizar docs (via estado do `track-edit`)
- Exibia lembrete para executar `/pwf-doc update` ou `/pwf-doc-capture`
- Reforçava disciplina "anti-vibe-coding" (sempre documentar mudanças)

**Mensagem típica**:
```
⚠️ Code changed without documentation updates.
Consider running:
- /pwf-doc update (for canonical docs)
- /pwf-doc-capture (for reusable learnings)
```

---

### 3. **beforeShellExecution** (git commit) - Convenção de Commits

**Arquivo**: `commit-convention-reminder.mjs`

**Funcionalidade**:
- Executado antes de comandos `git commit`
- Lembrava convenção de commits: `[TICKET-XXXX] message`
- Verificava se mensagem seguia o padrão esperado
- Sugeria usar `/pwf-commit-changes` para commits estruturados

**Matcher**: `git commit`

**Mensagem típica**:
```
💡 Commit convention reminder:
Format: [TICKET-XXXX] descriptive message
Or use: /pwf-commit-changes for structured commits
```

---

### 4. **afterShellExecution** (typeorm:generate) - Cadeia Atômica de Migrations

**Arquivo**: `migration-atomic-reminder.mjs`

**Funcionalidade**:
- Executado após comandos `typeorm:generate` (geração de migrations)
- Lembrava da "cadeia atômica" de migrations do TypeORM:
  1. Gerar migration
  2. Revisar migration gerada
  3. Executar migration localmente
  4. Testar rollback
  5. Commitar migration
- Evitava migrations quebradas em produção

**Matcher**: `typeorm:generate`

**Mensagem típica**:
```
⚠️ TypeORM Migration Atomic Chain:
1. Review generated migration file
2. Run migration locally (npm run typeorm:run)
3. Test rollback (npm run typeorm:revert)
4. Commit only after validation
```

---

### 5. **shared.mjs** - Utilitários Compartilhados

**Funcionalidade**:
- Biblioteca compartilhada pelos outros hooks
- Funções para ler/escrever estado em `.cursor/hooks/state/`
- Parsing de JSON seguro
- Leitura de stdin
- Inferência de `CURSOR_PLUGIN_ROOT`

**Principais funções**:
- `inferPluginRoot()` - Detecta raiz do plugin via `CURSOR_PLUGIN_ROOT`
- `safeParseJson()` - Parse JSON com fallback
- `readStdin()` - Lê entrada padrão
- `sanitizeSessionId()` - Valida ID de sessão

---

## 🔄 Possíveis Alternativas no Trae

### Sistema de Extensões do Trae

O Trae usa `extensions.json` com hook points diferentes:

```json
{
  "version": 1,
  "hookPoints": [
    "before_plan",
    "after_plan",
    "before_work_plan",
    "after_work_plan",
    "before_work",
    "after_work"
  ],
  "extensions": [
    {
      "id": "example-extension",
      "enabled": true,
      "hookPoint": "after_plan",
      "mode": "advisory",
      "message": "Custom reminder message"
    }
  ]
}
```

### Mapeamento de Funcionalidades

| Hook do Cursor | Alternativa no Trae | Status |
|----------------|-------------------------|--------|
| `afterFileEdit` | ❌ Não há equivalente direto | Não implementável |
| `stop` | ❌ Não há evento "stop" | Não implementável |
| `beforeShellExecution` | ❌ Não há hooks de shell | Não implementável |
| `afterShellExecution` | ❌ Não há hooks de shell | Não implementável |
| Lembretes de docs | ✅ `after_work`, `after_work_plan` | **Parcialmente implementável** |

### Implementação Parcial Possível

Apenas a funcionalidade de **lembretes de documentação** pode ser parcialmente implementada via extensões:

```json
{
  "id": "doc-reminder",
  "enabled": true,
  "hookPoint": "after_work",
  "mode": "advisory",
  "message": "Remember to update docs: /pwf-doc update or /pwf-doc-capture"
}
```

**Limitações**:
- Não pode detectar se código foi alterado sem docs (sem acesso a eventos de edição)
- Apenas exibe mensagem estática após workflows
- Não pode executar lógica condicional (sem scripts .mjs)

---

## 📝 Conclusão

Os hooks do Cursor forneciam automação valiosa para reforçar disciplinas de desenvolvimento:
- Documentação sempre atualizada
- Commits padronizados
- Migrations validadas

No Trae, essas disciplinas devem ser mantidas **manualmente** ou via:
- Lembretes nos próprios workflows (já implementado em `/pwf-work` e `/pwf-work-plan`)
- Extensões simples com mensagens estáticas
- Disciplina da equipe

A funcionalidade core dos workflows permanece intacta - apenas a automação de lembretes foi perdida.

---

**Última atualização**: 2026-03-18  
**Status**: Documentação de referência - hooks não migrados
