# Orbit Prompt Skill

Analisa sessões com AI e sinaliza padrões de ineficiência. Você vê o diagnóstico e decide o que fazer.

---

## O que é

Uma skill para Claude Code com dois modos de uso, ambos explícitos:

1. **`/orbit-prompt`** — Você pede análise de um prompt antes de enviá-lo. A skill identifica lacunas e sugere uma versão melhorada. Você decide se usa ou não.
2. **Diagnóstico de sessão** — Você aciona manualmente para analisar o histórico da conversa atual e identificar padrões de ineficiência.

A skill **não modifica nada.** Ela lê, analisa e exibe. Você age.

---

## Comando Principal: `/orbit-prompt`

Use quando quiser revisar um prompt antes de enviá-lo.

**Sintaxe:**

```
/orbit-prompt "seu prompt aqui"
```

**O que acontece:**

A skill lê o prompt, identifica o que está faltando (escopo, critério de aceite, limites) e exibe uma versão sugerida. Você lê e decide se usa, adapta ou descarta.

**Exemplo:**

```
/orbit-prompt "Refactor auth module"
```

**Output:**

```
[Orbit Engine — Prompt Analysis]

ORIGINAL:
"Refactor auth module"

GAPS:
- No file target (which file?)
- No scope boundary (password? OAuth? both?)
- No acceptance criteria (what does done look like?)
- Risk: high speculation — will require corrections

SUGGESTED:
"Extract password validation from src/auth/auth.ts into
src/validators/password.ts. Keep existing function signatures.
Do not touch OAuth flow or routes. Done = all existing tests pass."

CHANGES MADE:
- Added specific file (auth.ts → validators/password.ts)
- Scoped to password only (not OAuth)
- Preserved contract (function signatures unchanged)
- Added verifiable success criterion
```

Você copia o que quiser. Ou ignora. A skill não envia nada.

---

## Diagnóstico de Sessão

Use quando quiser analisar o histórico da conversa atual.

**Triggers:**

```
analyze cost
/analyze-cost
how efficient is this?
is this optimal?
Before answering, apply orbit-engine
```

Em sessões com padrões evidentes, a skill pode sinalizar no início de uma resposta — sempre visível, nunca silencioso.

**Output:**

```
[Orbit Engine]

DIAGNOSIS:
- Correction chain: 3 follow-ups correcting the same output
- auth.ts edited 4 times (rework pattern)

ACTIONS:
1. Restart with a scoped prompt
2. Use /compact to reduce accumulated context

DO NOT DO NOW:
- Continue correcting incrementally

Risk: medium
```

Você lê. Você decide.

---

## Exemplo Completo

**Situação:** Sessão com múltiplas correções após prompt vago.

```
Turno 1: "Refactor auth module"
         → Claude reescreveu 3 arquivos

Turno 2: "Não, só o middleware"
         → Claude editou auth.ts

Turno 3: "Não toca nas rotas"
         → Claude editou routes.ts

Turno 4: "Mantém a assinatura"
         → Claude editou novamente
```

**Diagnóstico:**

```
[Orbit Engine]

DIAGNOSIS:
- 3 follow-up corrections after initial output
- auth.ts edited 3 times in one session

ACTIONS:
1. Use /orbit-prompt before the next request to define scope
2. Use /compact before continuing

DO NOT DO NOW:
- Add another correction — resolves symptom, not cause

Risk: medium
```

---

## Os 8 Padrões Detectados

| Padrão | O que é |
|--------|---------|
| Unsolicited long responses | Output excede o que foi pedido |
| Correction chains | 3+ correções seguidas ao mesmo output |
| Repeated edits | Mesmo arquivo editado 3+ vezes |
| Exploratory searching | 5+ arquivos lidos sem objetivo definido |
| Weak prompt | Tarefa complexa sem escopo, critério ou limite |
| Large inline content | Bloco >100 linhas colado em vez de referenciado |
| Validation theater | Artefatos criados mas não executados |
| Context accumulation | Sessão longa com contexto irrelevante acumulado |

Cada padrão descreve o que foi observado. Nada é estimado ou inferido.

---

## Instalar

**Claude Code:**

1. Baixe [`orbit-prompt.skill`](https://github.com/IanVDev/orbit-prompt/releases)
2. Claude Code → Settings → Skills → Install

**Como prompt de sistema (qualquer LLM):**

```bash
unzip orbit-prompt.skill
# Use o conteúdo de SKILL.md como system prompt
```

---

## Dentro do `.skill`

```
orbit-prompt.skill
├── SKILL.md        — Definição, padrões e regras de ativação
├── QUICK-START.md  — Primeiros passos (3 min)
├── ONBOARDING.md   — Guia completo
└── EXAMPLES.md     — 6 cenários reais com diagnósticos
```

---

## Versão

```
Versão:  1.1.1
Status:  Pronto para produção
License: Copyright © 2026 Aurya. All rights reserved.
```

Desenvolvido pela Aurya como parte do Orbit Engine.
