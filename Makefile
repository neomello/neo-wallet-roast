.PHONY: help dev build start lint type-check preflight clean install audit commit test-roast setup analyze deploy deploy-prod env-pull logs

# Colors
CYAN    := \033[0;36m
GREEN   := \033[0;32m
RED     := \033[0;31m
YELLOW  := \033[0;33m
MAGENTA := \033[0;35m
BOLD    := \033[1m
NC      := \033[0m

APP_NAME := neo-wallet-roast

help:
	@echo "$(MAGENTA)$(BOLD)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(MAGENTA)$(BOLD)  💀 NEO Wallet Roast — Dev Console$(NC)"
	@echo "$(MAGENTA)$(BOLD)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@echo "$(CYAN)$(BOLD)Setup$(NC)"
	@echo "  $(GREEN)make setup$(NC)        Inicializa .env.local + instala deps"
	@echo "  $(GREEN)make install$(NC)      Instala dependências (pnpm)"
	@echo "  $(GREEN)make env-pull$(NC)     Sincroniza vars do Vercel → .env.local"
	@echo ""
	@echo "$(CYAN)$(BOLD)Desenvolvimento$(NC)"
	@echo "  $(GREEN)make dev$(NC)          Inicia servidor local (localhost:3000)"
	@echo "  $(GREEN)make test-roast$(NC)   Testa endpoint /api/roast via curl"
	@echo ""
	@echo "$(CYAN)$(BOLD)Qualidade$(NC)"
	@echo "  $(GREEN)make lint$(NC)         ESLint"
	@echo "  $(GREEN)make type-check$(NC)   TypeScript sem emitir arquivos"
	@echo "  $(GREEN)make preflight$(NC)    Lint + type-check + build local"
	@echo "  $(GREEN)make audit$(NC)        Auditoria de segurança de deps"
	@echo ""
	@echo "$(CYAN)$(BOLD)Build$(NC)"
	@echo "  $(GREEN)make build$(NC)        Build de produção"
	@echo "  $(GREEN)make start$(NC)        Inicia servidor de produção local"
	@echo "  $(GREEN)make analyze$(NC)      Bundle size analysis"
	@echo ""
	@echo "$(CYAN)$(BOLD)Deploy$(NC)"
	@echo "  $(GREEN)make deploy$(NC)       Deploy preview no Vercel"
	@echo "  $(GREEN)make deploy-prod$(NC)  Deploy em produção no Vercel"
	@echo "  $(GREEN)make logs$(NC)         Logs do último deploy"
	@echo ""
	@echo "$(CYAN)$(BOLD)Git$(NC)"
	@echo "  $(GREEN)make commit$(NC)       Lint + build + commit interativo"
	@echo ""
	@echo "$(CYAN)$(BOLD)Manutenção$(NC)"
	@echo "  $(GREEN)make clean$(NC)        Remove .next e node_modules"
	@echo ""

# ── Setup ────────────────────────────────────────────────────

install:
	@echo "$(CYAN)Instalando dependências...$(NC)"
	pnpm install

setup:
	@echo "$(CYAN)Inicializando projeto...$(NC)"
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "$(YELLOW).env.local criado — preencha as chaves antes de rodar$(NC)"; \
	else \
		echo "$(GREEN).env.local já existe, pulando$(NC)"; \
	fi
	pnpm install
	@echo "$(GREEN)Pronto! Rode: make dev$(NC)"

env-pull:
	@echo "$(CYAN)Sincronizando vars do Vercel...$(NC)"
	vercel env pull .env.local

# ── Desenvolvimento ───────────────────────────────────────────

dev:
	pnpm dev

test-roast:
	@echo "$(CYAN)Testando /api/roast (demo mode)...$(NC)"
	@curl -sf -X POST http://localhost:3000/api/roast \
		-H "Content-Type: application/json" \
		-d '{"address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", "isDemo": true}' \
		| jq . \
		|| echo "$(RED)Servidor não está rodando. Rode: make dev$(NC)"

# ── Qualidade ────────────────────────────────────────────────

lint:
	pnpm lint

type-check:
	@echo "$(CYAN)Checando tipos TypeScript...$(NC)"
	pnpm exec tsc --noEmit --incremental false

preflight:
	@echo "$(CYAN)Rodando preflight (lint + type-check + build)...$(NC)"
	@$(MAKE) lint
	@$(MAKE) type-check
	@$(MAKE) build

audit:
	@echo "$(CYAN)Auditoria de segurança...$(NC)"
	pnpm audit

# ── Build ────────────────────────────────────────────────────

build:
	env -u NODE_ENV pnpm build

start:
	pnpm start

analyze:
	@echo "$(CYAN)Analisando bundle...$(NC)"
	env -u NODE_ENV ANALYZE=true pnpm build

# ── Deploy ───────────────────────────────────────────────────

deploy: preflight
	@echo "$(CYAN)Deploy preview...$(NC)"
	vercel

deploy-prod: preflight
	@echo "$(RED)$(BOLD)Deploy em PRODUÇÃO. Confirme com [Enter] ou cancele com Ctrl+C$(NC)"
	@read _confirm
	vercel --prod

logs:
	vercel logs $$(vercel ls --json 2>/dev/null | jq -r '.[0].url' 2>/dev/null || echo "$(APP_NAME)")

# ── Git ──────────────────────────────────────────────────────

commit:
	@echo "$(MAGENTA)$(BOLD)Fluxo de commit seguro$(NC)"
	@pnpm lint || (echo "$(RED)Lint falhou$(NC)" && exit 1)
	@env -u NODE_ENV pnpm build || (echo "$(RED)Build falhou$(NC)" && exit 1)
	@echo ""
	@git status
	@echo ""
	@echo "$(CYAN)Mensagem do commit:$(NC)"
	@read msg; \
	git add -p; \
	git commit -m "$$msg"; \
	branch=$$(git rev-parse --abbrev-ref HEAD); \
	git push origin $$branch

# ── Manutenção ───────────────────────────────────────────────

clean:
	@echo "$(YELLOW)Limpando artefatos...$(NC)"
	rm -rf .next node_modules
	@echo "$(GREEN)Limpo. Rode: make install$(NC)"
