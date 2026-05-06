# Resumo do Plugin para Windsurf e OpenCode

**Data**: 2026-05-05
**Status**: Plugin oficial para Windsurf e OpenCode

---

## Plataformas Oficiais

Este plugin e oficialmente suportado em:

1. **Windsurf** — plugin nativo com sistema de extensoes
2. **OpenCode** — terminal-based AI agent com subagentes

Ambas as plataformas oferecem:
- 20 comandos de workflow (`/pwf-*`)
- 46 agentes especializados
- 21 habilidades reutilizaveis
- 10 regras operacionais
- Integracao MCP com Context7

---

## Como Usar

### Windsurf

```bash
cp -r .windsurf/ /caminho/do/seu-projeto/
```

Reinicie o Windsurf. Os comandos `/pwf-*` ficam disponiveis automaticamente.

### OpenCode

```bash
cp -r .opencode/ /caminho/do/seu-projeto/
```

Reinicie o OpenCode. Comandos disponiveis via `/pwf-*` na TUI.

---

## Workflow Principal

```
/pwf-brainstorm -> /pwf-plan -> [opcional: /pwf-clarify, /pwf-checklist, /pwf-analyze]
-> /pwf-work-plan (ou /pwf-work / /pwf-work-light) -> [/pwf-review sob demanda]
-> /pwf-commit-changes
```

---

## Diferencas entre Plataformas

| Aspecto | Windsurf | OpenCode |
|---------|----------|----------|
| **Invocacao de agentes** | Leitura direta de arquivos | Ferramenta `task` + `@agente` |
| **Execucao paralela** | Multiplas chamadas simultaneas | Multiplas chamadas simultaneas |
| **Hooks de ciclo de vida** | `extensions.json` | Embutidos nos comandos |
| **Regras** | `.mdc` com `alwaysApply: true` | Consolidadas em `AGENTS.md` |
| **Skills** | Auto-descobertas | Auto-descobertas via `skill` |
| **Configuracao MCP** | `mcp.json` | `opencode.json` |
| **Presets** | `presets/presets.json` | Via input nos comandos |

---

## Funcionalidades

### Preservadas em ambas plataformas

- Todos os 20 workflows
- Todos os 46 agentes
- Todas as 21 skills
- Sistema de presets
- Integracao Context7 MCP
- Disciplina de documentacao

### Diferencas de implementacao

- **Windsurf**: extensoes com hooks de workflow (`before_plan`, `after_plan`, etc.)
- **OpenCode**: regras consolidadas em um unico `AGENTS.md`
- **Ambas**: execucao paralela de agentes via multiplas chamadas de ferramentas

---

## Proximos Passos

1. Instale para sua plataforma preferida
2. Rode `/pwf-help` para orientacao
3. Comece com `/pwf-setup` em projetos novos
4. Use `/pwf-brainstorm` ou `/pwf-work` para trabalho real

---

**Ultima atualizacao**: 2026-05-05
**Status**: Producao
