# Instrucao Para Agent De Implementacao

## Contexto

Projeto `neo-wallet-roast`, stack `Next.js 15 + React 19 + pnpm`.
Produto social onchain com foco em Base. UX simples, saida narrativa forte, distribuicao nativa por compartilhamento.

## Missao

Implementar uma versao Base-first tecnicamente consistente, sem inflar complexidade.

## Objetivos Obrigatorios

1. Manter fluxo principal: connect/input wallet -> `POST /api/roast` -> roast + score + labels.
2. Tornar a camada de dados Base-first, nao Ethereum-first.
3. Estruturar scoring com sinais objetivos por rede.
4. Preservar performance e simplicidade da UI.
5. Nao reintroduzir `npm` em docs/scripts. Usar apenas `pnpm`.

## Restricoes

1. Nao quebrar App Router.
2. Nao criar sitemap para miniapp de fluxo unico.
3. Nao alterar identidade visual central.
4. Nao criar dependencias desnecessarias.
5. Nao tocar em arquivos fora do escopo sem justificar.

## Plano Tecnico

1. Data layer:
   Refatorar `lib/fetchWalletData.ts` para provedores com prioridade Base.
   Retornar estrutura tipada com campos por rede (`base`, `ethereum`, `aggregate`).
2. Scoring engine:
   Criar modulo dedicado `lib/scoring.ts`.
   Score deterministico por features: frequencia, diversidade de apps, comportamento de bridge, perfil de risco.
3. API contract:
   Ajustar `app/api/roast/route.ts` para usar score calculado no backend.
   LLM gera narrativa e labels, mas score final vem do motor logico.
4. Frontend:
   Em `app/components/HomeClient.tsx`, exibir score com breakdown resumido.
   Manter experiencia atual de loading/erro/compartilhamento.
5. Observabilidade minima:
   Adicionar logs estruturados para falhas de provider e tempo de resposta.
   Sem telemetria invasiva nesta fase.

## Entregaveis

1. Codigo implementado.
2. Tipagem valida (`pnpm exec tsc --noEmit --incremental false`).
3. Build local (`pnpm build`) sem regressao funcional.
4. README atualizado so no necessario.
5. Resumo final: o que mudou, riscos remanescentes e proximos passos.

## Criterios De Aceite

1. Wallet connect na Base continua funcionando.
2. API retorna JSON estavel (`roast`, `score`, `labels`).
3. Score nao depende de "alucinacao" do modelo.
4. Latencia continua adequada para uso social.
5. Zero mudanca acidental fora do escopo.

## Formato Da Resposta Final Do Agent

1. Diff do que foi alterado.
2. Comandos de validacao executados.
3. Problemas encontrados e como foram resolvidos.
4. Riscos tecnicos pendentes.
