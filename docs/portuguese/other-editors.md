# Windsurf + OpenCode

Este workflow e oficialmente suportado em **Windsurf** e **OpenCode**.

Ambas as plataformas oferecem suporte nativo a slash commands, agentes especializados, habilidades reutilizaveis e workflows com foco em documentacao. Escolha a que melhor se encaixa no seu ambiente — a metodologia e identica.

---

## Ambientes suportados

| Funcionalidade | Windsurf | OpenCode |
|----------------|----------|----------|
| Slash commands nativos | ✅ | ✅ |
| Regras / contexto global | ✅ `.windsurf/rules/` + `AGENTS.md` | ✅ `.opencode/AGENTS.md` |
| Hooks de ciclo de vida | ✅ sistema de extensoes | ✅ embutidos nos comandos |
| Sub-agentes (pesquisa paralela) | ✅ | ✅ via `@agente` |
| Auto-descoberta de skills | ✅ | ✅ |
| Integracao MCP | ✅ `mcp.json` | ✅ `opencode.json` |
| Presets | ✅ `presets/presets.json` | ✅ via input |
| Atualizacoes automaticas | Manual (copiar) | Manual (copiar) |

---

## Windsurf

### Configuracao

1. Clone este repositorio:

   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. Copie `.windsurf/` para a raiz do seu projeto:

   ```bash
   cp -r Psters_AI_Workflow/.windsurf/ /caminho/do/seu-projeto/
   ```

3. Reinicie o Windsurf.

### Uso

Rode o workflow no Windsurf exatamente como projetado:

```
/pwf-brainstorm adicionar autenticacao de usuario com JWT
/pwf-plan
/pwf-work-plan
/pwf-review
/pwf-commit-changes
```

### O que funciona no Windsurf

- **Todos os slash commands funcionam nativamente.** Arquivos em `.windsurf/workflows/` sao invocados como `/pwf-*`.
- **Regras funcionam automaticamente.** Todos os arquivos `.mdc` em `.windsurf/rules/` sao carregados com `alwaysApply: true`.
- **Sistema de extensoes funciona.** Hooks de ciclo de vida (`before_plan`, `after_plan`, `before_work`, `after_work`) fornecem orientacao adviser.
- **Agentes funcionam nativamente.** Windsurf pode disparar subagentes diretamente dos comandos de workflow.
- **Skills sao auto-descobertas.** `.windsurf/skills/` sao carregadas sob demanda.
- **Presets estao disponiveis.** `presets/presets.json` influencia o enfase do planejamento.

### Manter atualizado

```bash
cd Psters_AI_Workflow && git pull
cp -r .windsurf/ /caminho/do/seu-projeto/
```

---

## OpenCode

### Configuracao

1. Clone este repositorio:

   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. Copie `.opencode/` para a raiz do seu projeto:

   ```bash
   cp -r Psters_AI_Workflow/.opencode/ /caminho/do/seu-projeto/
   ```

3. Reinicie o OpenCode.

### Uso

Rode o workflow no OpenCode:

```
/pwf-brainstorm adicionar autenticacao de usuario com JWT
/pwf-plan
/pwf-work-plan
```

Invoque subagentes via `@`:

```
@repo-research-analyst Mapeie todo codigo existente relacionado a autenticacao
@security-sentinel Revise este endpoint por vulnerabilidades de seguranca
```

### O que funciona no OpenCode

- **Todos os slash commands funcionam nativamente.** Arquivos em `.opencode/commands/` sao invocados como `/pwf-*`.
- **Regras consolidadas em AGENTS.md.** Todos os guardrails operacionais, padroes de commit, disciplina de migracao e politicas de build sao carregados de `.opencode/AGENTS.md`.
- **Agentes funcionam como subagentes.** Definidos em `.opencode/agents/`, invocados via `@nome-do-agente`.
- **Skills sao auto-descobertas.** `.opencode/skills/` sao carregadas sob demanda via ferramenta `skill`.
- **Integracao MCP configurada.** Context7 esta configurado via `.opencode/opencode.json`.

### Manter atualizado

```bash
cd Psters_AI_Workflow && git pull
cp -r .opencode/ /caminho/do/seu-projeto/
```

---

## Ambas plataformas ao mesmo tempo

Instale para Windsurf e OpenCode juntos:

```bash
cp -r Psters_AI_Workflow/.windsurf/ /caminho/do/seu-projeto/
cp -r Psters_AI_Workflow/.opencode/ /caminho/do/seu-projeto/
```

---

## Resumo

**Windsurf e OpenCode sao as plataformas oficiais.** Ambos oferecem suporte completo ao workflow com slash commands, agentes, skills e disciplina de documentacao. A metodologia e identica — escolha seu editor preferido.
