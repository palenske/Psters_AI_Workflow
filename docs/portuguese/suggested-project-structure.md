# Estrutura de Projeto Sugerida

Este workflow recomenda uma **topologia de projeto em duas pastas**:

- `<NomeProjeto>_Repos` -> todos os repositorios de codigo
- `<NomeProjeto>_Workspace` -> contexto de workflow/docs/editor

## Por que essa estrutura

Separar repositorios de codigo do contexto de workflow melhora clareza operacional:

- codigo fica isolado de metadados e artefatos de docs,
- docs e contexto de editor ficam centralizados,
- projetos multi-repo ficam mais simples de navegar em uma unica janela do editor.

## Layout recomendado

```text
<caminho-base>/
  <NomeProjeto>_Repos/
    frontend/
    backend/
  <NomeProjeto>_Workspace/
    docs/
    <configuracao-editor>/
      .opencode/ (se usando OpenCode)
      .windsurf/ (se usando Windsurf)
    <NomeProjeto>.code-workspace
```

## Como usar no OpenCode/Windsurf

1. Abra `<NomeProjeto>_Workspace/<NomeProjeto>.code-workspace`.
2. Trabalhe nesse workspace multi-root:
   - edite codigo nos repos,
   - mantenha docs e controles de workflow na raiz do workspace.

Assim voce gerencia entrega e ciclo de documentacao na mesma janela.

## Comando para montar essa estrutura

Use:

- `/pwf-setup-workspace`

Esse comando cria/repara o layout de pastas e gera o arquivo `.code-workspace`.

Depois rode:

- `/pwf-setup` para inicializar o esqueleto de docs na raiz do workspace.

## Migracao de projeto existente

Se os repositorios ja existem, nao mova arquivos sem controle.

Ordem recomendada:

1. criar/reutilizar `<NomeProjeto>_Workspace`,
2. gerar `.code-workspace` apontando para os repos existentes,
3. mover repos para `<NomeProjeto>_Repos` apenas com confirmacao explicita e backup.

## Padrao pratico

Para a maioria dos times:

- um repo frontend + um repo backend em `<NomeProjeto>_Repos`,
- uma raiz central de docs/workflow em `<NomeProjeto>_Workspace`.

Esse e o modelo base deste workflow.
