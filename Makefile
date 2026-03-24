.PHONY: help dev build start lint clean install audit commit test-roast setup analyze

# Cores
CYAN := \033[0;36m
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[0;33m
MAGENTA := \033[0;35m
NC := \033[0m

# Metadata
APP_NAME := neo-wallet-roast

help:
	@echo "$(MAGENTA)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(MAGENTA)  💀 NEO Wallet Roast - Console de Engenharia$(NC)"
	@echo "$(MAGENTA)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(CYAN)Available Commands:$(NC)"
	@echo "  $(GREEN)make setup$(NC)     - Inicializa tudo (.env + deps)"
	@echo "  $(GREEN)make dev$(NC)       - Inicia desenvolvimento"
	@echo "  $(GREEN)make build$(NC)     - Build de produção"
	@echo "  $(GREEN)make install$(NC)   - Instala dependências (pnpm)"
	@echo "  $(GREEN)make audit$(NC)     - Security Check"

install:
	@echo "$(CYAN)Garantindo dependências com pnpm...$(NC)"
	pnpm install

setup:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

audit:
	pnpm audit

clean:
	@echo "$(YELLOW)Limpando o rastro...$(NC)"
	rm -rf .next node_modules pnpm-lock.yaml

commit:
	@echo "$(MAGENTA)Iniciando Fluxo Seguro...$(NC)"
	pnpm audit || (echo "$(RED)Falha no Audit!$(NC)" && exit 1)
	pnpm build || (echo "$(RED)Falha no Build!$(NC)" && exit 1)
	@git status
	@echo "$(CYAN)Mensagem do commit: $(NC)"
	@read msg; \
	git add .; \
	git commit -m "$$msg"; \
	current_branch=$$(git rev-parse --abbrev-ref HEAD); \
	git push origin $$current_branch

test-roast:
	@curl -s -X POST http://localhost:3000/api/roast \
		-H "Content-Type: application/json" \
		-d '{"address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", "isDemo": true}' | jq .
