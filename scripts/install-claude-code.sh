#!/usr/bin/env bash
# Install Psters AI Workflow plugin for Claude Code
# Usage: ./scripts/install-claude-code.sh [target-project-path]
#   If no path provided, installs to current directory

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Source directories
CLAUDE_SRC="${REPO_ROOT}/.claude"
PLUGIN_SRC="${REPO_ROOT}/.claude-plugin"

# Target directory (default to current directory)
TARGET_DIR="${1:-.}"
TARGET_DIR="$(cd "${TARGET_DIR}" 2>/dev/null || echo "${TARGET_DIR}")"
if [[ ! -d "${TARGET_DIR}" ]]; then
  echo "Error: Target directory does not exist: ${TARGET_DIR}" >&2
  exit 1
fi

# Validate source directories exist
if [[ ! -d "${CLAUDE_SRC}" ]]; then
  echo "Error: Source .claude directory not found: ${CLAUDE_SRC}" >&2
  exit 1
fi

if [[ ! -d "${PLUGIN_SRC}" ]]; then
  echo "Error: Source .claude-plugin directory not found: ${PLUGIN_SRC}" >&2
  exit 1
fi

echo "Installing Psters AI Workflow plugin for Claude Code..."
echo "Target: ${TARGET_DIR}"
echo ""

# Install .claude directory
TARGET_CLAUDE="${TARGET_DIR}/.claude"
if [[ -d "${TARGET_CLAUDE}" ]]; then
  echo "Backing up existing .claude directory..."
  mv "${TARGET_CLAUDE}" "${TARGET_CLAUDE}.backup.$(date +%Y%m%d%H%M%S)"
fi
cp -R "${CLAUDE_SRC}" "${TARGET_CLAUDE}"
echo "✓ Installed .claude/ directory"

# Install .claude-plugin directory
TARGET_PLUGIN="${TARGET_DIR}/.claude-plugin"
if [[ -d "${TARGET_PLUGIN}" ]]; then
  echo "Backing up existing .claude-plugin directory..."
  mv "${TARGET_PLUGIN}" "${TARGET_PLUGIN}.backup.$(date +%Y%m%d%H%M%S)"
fi
cp -R "${PLUGIN_SRC}" "${TARGET_PLUGIN}"
echo "✓ Installed .claude-plugin/ directory"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installation complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Available commands:"
echo "  /pwf-help             Show all commands"
echo "  /pwf-work             Execute implementation work"
echo "  /pwf-plan             Create implementation plan"
echo "  /pwf-work-plan        Execute planned work"
echo "  /pwf-review           Multi-agent code review"
echo "  /pwf-commit-changes   Commit with ticket tags"
echo "  /pwf-brainstorm       Explore ideas and architecture"
echo "  /pwf-setup            Initialize docs structure"
echo ""
echo "Workflow: /pwf-brainstorm → /pwf-plan → /pwf-work → /pwf-review → /pwf-commit-changes"
echo ""
echo "Next step: Restart Claude Code or reload the session."
