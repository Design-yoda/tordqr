# AGENTS.md

## Project working rules
- Preserve all existing working functionality unless the user explicitly requests a change.
- Prefer the smallest safe implementation that solves the stated problem.
- Do not introduce speculative refactors.
- Do not rename files, routes, components, variables, or functions unless required for the requested task.
- Do not change styling, layout, animations, interactions, export behavior, rendering logic, payment logic, auth flow, or data flow outside the scope of the task.
- If a request involves UI updates, treat existing logic as stable by default.
- If a request involves fixing a bug, identify the root cause before proposing broader rewrites.
- Always call out assumptions instead of inventing missing product behavior.
- Keep copy concise, human, and implementation-ready.
- When asked for a prompt for another coding agent, output a production-ready prompt, not advice about what a prompt should contain.

## Code change rules
- Prefer localized edits over large rewrites.
- Preserve backward compatibility.
- Avoid introducing new dependencies unless absolutely necessary.
- Reuse existing design tokens, components, utilities, and patterns where possible.
- Keep accessibility intact for UI work.
- If multiple solutions exist, prefer the one with the lowest risk of regressions.

## Output preference
When the user asks for implementation help, default to one of these:
1. A clean prompt for Claude Code / Codex
2. A scoped implementation plan
3. Direct code only if explicitly requested

## For prompt-writing tasks
A strong implementation prompt should:
- Restate the exact task
- State what must not break
- Mention relevant constraints
- Ask for root-cause diagnosis before edits
- Require minimal, surgical changes
- Require preserving all working features
- Ask for a summary of what changed