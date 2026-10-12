<p align="center">
  <img src=".opencode/assets/logo.svg" alt="Psters AI Workflow logo" width="72" />
</p>
<h1 align="center">Pster's AI Workflow</h1>
<p align="center">
  <strong>Self-documenting, hallucination-reducing, and predictable AI workflow for software teams.</strong>
</p>
<p align="center">
  <a href="#pt-br">Português</a> · <a href="#en">English</a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/commands-20-7c3aed?style=for-the-badge" alt="Commands: 20">
  <img src="https://img.shields.io/badge/agents-51-2563eb?style=for-the-badge" alt="Agents: 46">
  <img src="https://img.shields.io/badge/rules-10-f59e0b?style=for-the-badge" alt="Rules: 10">
  <img src="https://img.shields.io/badge/skills-27-16a34a?style=for-the-badge" alt="Skills: 27">
  <img src="https://img.shields.io/badge/canonical--repo-1-2563eb?style=for-the-badge" alt="Canônico: Opencode">
</p>
<p align="center">
  <strong>Repositório canônico:</strong> Opencode (derivado): Windsurf
</p>

## 🚀 Quick Start

### Platform Setup

| Platform | Install | Status |
|----------|---------|--------|
| **Opencode** | `cp -r .opencode/ /path/to/your/project/` | ⭐ **Canônico** |
| **Windsurf** | `cp -r .windsurf/ /path/to/your/project/` | ✅ Suportado |

### For Opencode (Recomendado)

1. Clone this repository:
   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. Copy `.opencode/` to your project root:
   ```bash
   cp -r Psters_AI_Workflow/.opencode/ /path/to/your-project/
   ```

3. Restart OpenCode and run:
   ```bash
   /pwf-setup
   ```

### For Windsurf

1. Clone this repository:
   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. Copy `.windsurf/` to your project root:
   ```bash
   cp -r Psters_AI_Workflow/.windsurf/ /path/to/your-project/
   ```

3. Restart Windsurf and run:
   ```bash
   /pwf-setup
   ```

### For Both Platforms

```bash
cp -r Psters_AI_Workflow/.opencode/ /path/to/your-project/
cp -r Psters_AI_Workflow/.windsurf/ /path/to/your-project/
```

## 📋 Comandos Principais (20 /pwf-*)

| Categoria | Comando | Descrição |
|-----------|---------|-----------|
| **Setup** | `/pwf-setup` | Inicializar esqueleto de docs do projeto |
| **Workspace** | `/pwf-setup-workspace` | Criar estrutura multi-root (`*_Repos` + `*_Workspace`) |
| **Brainstorm** | `/pwf-brainstorm` | Definir escopo, direção de arquitetura e decisões |
| **Plan** | `/pwf-plan` | Gerar plano de implementação em fases |
| **Quality Gates** | `/pwf-checklist` | Validar qualidade dos requisitos |
| **Quality Gates** | `/pwf-clarify` | Resolver ambiguidades críticas |
| **Quality Gates** | `/pwf-analyze` | Analise de consistência/cobertura (read-only) |
| **Work** | `/pwf-work-plan` | Implementar uma fase do plano |
| **Work** | `/pwf-work` | Executar mudanças focadas fora de plano formal |
| **Review** | `/pwf-review` | Revisão estruturada multi-agente |
| **Commit** | `/pwf-commit-changes` | Criar commits estruturados por ticket |
| **Docs** | `/pwf-doc` | Documentação por escopo (módulo, feature, arquitetura) |
| **Docs** | `/pwf-doc-foundation` | Docs de fundação (infra, arquitetura, integrações) |
| **Docs** | `/pwf-doc-runbook` | Runbooks operacionais |
| **Docs** | `/pwf-doc-capture` | Capturar aprendizados reutilizáveis |
| **Docs** | `/pwf-doc-refresh` | Curar e atualizar `docs/solutions/` |
| **Docs** | `/pwf-doc-update` | Atualizar documentação existente |
| **Help** | `/pwf-help` | Guia de comandos e orientação de workflow |
| **AWS** | `/pwf-aws-lambda-deploy` | Deploy de Lambda com verificação |
| **Aux** | `/pwf-checklist` | Checklist de qualidade (extra) |

## 🔄 Fluxo de Workflow

```mermaid
%%{init: {"flowchart": {"curve": "linear", "rankSpacing": 40, "nodeSpacing": 28}} }%%
flowchart LR
  B["/pwf-brainstorm<br/>Definir escopo e decisões"] --> P["/pwf-plan<br/>Gerar plano em fases"]
  P --> Q{"Quality Gates?"}
  Q -->|Sim| C["/pwf-checklist<br/>Validar requisitos"]
  C --> L["/pwf-clarify<br/>Resolver ambiguidades"]
  L --> A["/pwf-analyze<br/>Analise de consistencia"]
  A --> W["/pwf-work-plan<br/>Implementar fase"]
  Q -->|Nao| W

  W --> R{"Fases pendentes?"}
  R -->|Sim| W
  R -->|Nao| V["/pwf-review<br/>Revisar findings"]
  V --> M["/pwf-commit-changes<br/>Commits estruturados"]

  X["/pwf-work<br/>Caminho rápido (plano informal)"] -.-> V
  D["Docs sao centrais:<br/>Leem e atualizam automaticamente"] -.-> W
  D -.-> X

  classDef core fill:#EEF2FF,stroke:#4F46E5,color:#111827,stroke-width:1.2px;
  classDef quality fill:#ECFDF5,stroke:#059669,color:#111827,stroke-width:1.2px;
  classDef execution fill:#FFF7ED,stroke:#EA580C,color:#111827,stroke-width:1.2px;
  classDef close fill:#F5F3FF,stroke:#7C3AED,color:#111827,stroke-width:1.2px;
  classDef docs fill:#EFF6FF,stroke:#2563EB,color:#111827,stroke-width:1.2px;
  classDef decision fill:#F8FAFC,stroke:#475569,color:#0F172A,stroke-width:1.1px;

  class B,P core;
  class C,L,A quality;
  class W,X execution;
  class V,M close;
  class D docs;
  class Q,R decision;
```

### Fluxo Padrão

1. **/pwf-brainstorm** - Definir escopo, direção de arquitetura e decisões principais
2. **/pwf-plan** - Gerar plano de implementação em fases
3. **Quality Gates (opcional)** - `/pwf-checklist`, `/pwf-clarify`, `/pwf-analyze`
4. **/pwf-work-plan** - Implementar uma fase por vez, repetindo até completar
5. **/pwf-review** - Revisão profunda quando necessário
6. **/pwf-commit-changes** - Commits estruturados por ticket

### Fluxo Alternativo

**/pwf-work** - Para mudanças focadas e rápidas fora de um plano formal

### Fluxo de Docs

Todas as mudanças seguem regras de:
- Leitura obrigatória antes de implementar
- Atualização automática de docs durante execução

## 📚 Documentation

- **Main Index**: [docs/README.md](docs/README.md)
- **English Docs**: [docs/english/README.md](docs/english/README.md)
- **Portuguese Docs**: [docs/portuguese/README.md](docs/portuguese/README.md)

**English Quick Links**:
- [Getting Started](docs/english/getting-started.md)
- [Commands Reference](docs/english/commands-reference.md)
- [Suggested Project Structure](docs/english/suggested-project-structure.md)
- [Workflow Methodology](docs/english/workflow-methodology.md)
- [Under the Hood](docs/english/under-the-hood.md)
- [FAQ](docs/english/faq.md)

**Portuguese Quick Links**:
- [Comece em 10 Minutos](docs/portuguese/getting-started.md)
- [Referência de Comandos](docs/portuguese/commands-reference.md)
- [Estrutura de Projeto](docs/portuguese/suggested-project-structure.md)
- [Metodologia do Workflow](docs/portuguese/workflow-methodology.md)
- [Por Dentro do Workflow](docs/portuguese/under-the-hood.md)
- [FAQ](docs/portuguese/faq.md)

## 🎯 Por Que Esse Workflow?

### Philosophy

Pster's AI Workflow segue uma mentalidade **Spec-Driven Development** inspirada em **Extreme Programming (XP)**:

- **Entrega incremental rápida** (lotes pequenos, feedback curto)
- **Rigor dinâmico** (leve quando simples, profundo quando risco é alto)
- **Execução previsível** (fluxo explícito comando por comando)
- **Contexto primeiro** para reduzir alucinações
- **Preservação de padrões** através de leitura/ atualização obrigatória de docs

### Diferenciais

- **Desenvolvedor controla o caminho** - AI não escolhe sozinho, você decide o passo
- **AI executa com rigor** - Após escolher o caminho, AI segue regras estruturadas
- **Docs como memória de runtime** - Não são artefatos opcionais, são gerados/mantidos durante entrega
- **Mesmo fluxo que se adapta** - Roda leve ou pesado sem mudar filosofia

### Para Quem Serve

- **Equipes de desenvolvimento** que querem previsibilidade
- **Projetos ágeis** que precisam de execução estruturada
- **Arquitetos e engenheiros** que valorizam documentação como código
- **Equipes híbridas** (desenvolvedores + AI assistentes)

## 🌍 Community

- **Discord**: [Pster's AI Workflow Discord](https://discord.gg/vxyrWuqUhe)
- **Contribution**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **License**: [LICENSE](LICENSE)

---

## 🇵🇹 Português (PT-BR)

### ⚡ Explicação Rápida

Um workflow de IA auto-documentado e agnóstico de modelo para qualquer projeto, framework e linguagem. Ele reduz alucinação e mantém a entrega previsível: o desenvolvedor controla o caminho, a IA executa as etapas, e os padrões do projeto permanecem consistentes.

### Fluxo Principal

1. **/pwf-brainstorm** - Definir escopo, direção de arquitetura e decisões
2. **/pwf-plan** - Gerar plano de implementação em fases
3. **Quality Gates (opcional)** - `/pwf-checklist`, `/pwf-clarify`, `/pwf-analyze`
4. **/pwf-work-plan** - Implementar uma fase por vez
5. **/pwf-review** - Revisar e corrigir findings
6. **/pwf-commit-changes** - Commits estruturados por ticket

### Docs Sugeridas

- [Comece em 10 Minutos](docs/portuguese/getting-started.md)
- [Estrutura de Projeto](docs/portuguese/suggested-project-structure.md)
- [Referência de Comandos](docs/portuguese/commands-reference.md)
- [Metodologia do Workflow](docs/portuguese/workflow-methodology.md)
- [Por Dentro do Workflow](docs/portuguese/under-the-hood.md)

---

## 🇬🇧 English

### ⚡ Quick Explanation

An auto-documenting, model-agnostic AI workflow for any project, framework, and language. It reduces hallucination and keeps delivery predictable: the developer controls the path, AI executes the steps, and project standards stay consistent.

### Main Flow

1. **/pwf-brainstorm** - Define scope, architecture direction, and key decisions
2. **/pwf-plan** - Generate phased implementation plan
3. **Quality Gates (optional)** - `/pwf-checklist`, `/pwf-clarify`, `/pwf-analyze`
4. **/pwf-work-plan** - Implement one phase at a time
5. **/pwf-review** - Review and fix findings
6. **/pwf-commit-changes** - Structured ticket-aware commits

### Recommended Documentation

- [Getting Started](docs/english/getting-started.md)
- [Suggested Project Structure](docs/english/suggested-project-structure.md)
- [Commands Reference](docs/english/commands-reference.md)
- [Workflow Methodology](docs/english/workflow-methodology.md)
- [Under the Hood](docs/english/under-the-hood.md)

---

<p align="center">
  <img src="https://img.shields.io/badge/Powered_by_Psters-FF5733-FF5733?style=for-the-badge" alt="Powered by Psters">
</p>
