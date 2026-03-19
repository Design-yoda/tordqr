---
name: safe-ui-implementation
description: Use this when the user wants a strong implementation prompt for Claude Code, Codex, or another coding agent to fix a bug, add a feature, or update UI without breaking existing functionality. Do not use for pure brainstorming, generic copywriting, or open-ended redesign exploration.
---

# Purpose
Turn messy product requests into precise, execution-ready prompts that another coding agent can implement safely.

# Use this skill when
- The user says “give me a prompt for Claude”
- The user wants to fix a bug without disrupting anything else
- The user wants a feature added to an existing product
- The user wants UI or workflow updates while preserving current logic
- The user gives screenshots or rough notes and wants them turned into a proper implementation prompt

# Do not use this skill when
- The user only wants brainstorming
- The user wants raw code instead of a prompt
- The user wants marketing copy, essays, or social posts
- The user wants a PRD instead of an implementation prompt

# Core principles
- Preserve working behavior
- Make the scope explicit
- Ask for the smallest safe change
- Prevent unnecessary rewrites
- Avoid vague wording
- Convert rough user language into precise engineering language
- Include what should remain unchanged

# Inputs to look for
- Existing feature or page
- Bug symptom
- Requested improvement
- Constraints like “do not break export”
- Screenshots or UI references
- Technical stack if mentioned

# Workflow
1. Identify the real task.
2. Separate requested changes from protected areas.
3. Convert ambiguous user wording into explicit implementation intent.
4. Add guardrails so the coding agent avoids regressions.
5. Require diagnosis before modification if it is a bug.
6. Require minimal, scoped edits.
7. Require preservation of existing working features.
8. Output a polished prompt that can be pasted directly into Claude Code or Codex.

# Prompt structure to produce
Use this structure when generating the final prompt:

## 1. Task
State exactly what needs to be fixed, added, or updated.

## 2. Goal
Describe the intended result from the user’s perspective.

## 3. Constraints
List what must not break, change, or regress.

## 4. Implementation guidance
Tell the coding agent how to approach the task safely.

## 5. Deliverable requirements
Specify what the coding agent should return after making the change.

# Writing rules
- Write in direct instruction style
- Be concrete, not fluffy
- Avoid filler like “improve the app”
- Replace vague phrases with observable outcomes
- Preserve user intent even if their wording is rough
- Include “do not disrupt any existing working logic” when relevant
- Include regression protection for exports, rendering, auth, payments, animations, or shared components when mentioned
- If the request is about UI, mention visual consistency with the current product
- If the request is about bugs, require root-cause identification first
- If the request is about new features, require integration into existing architecture rather than bolted-on hacks

# Default output format
Return:

1. A title
2. A final ready-to-paste implementation prompt
3. Optional note with any assumptions, only if necessary

# Prompt template
Use this as the default shape:

Title: [Clear task title]

Prompt:
You are working on an existing product. Make the requested update without breaking any existing feature or workflow that already works correctly.

Task:
[Insert exact task]

Goal:
[Insert intended outcome]

Constraints:
- Preserve all existing working functionality
- Do not introduce unrelated UI or logic changes
- Do not refactor unrelated parts of the codebase
- Reuse the current architecture, components, and styling patterns where possible
- Keep the implementation clean, minimal, and production-safe
- [Insert task-specific protected areas]

Implementation requirements:
- First inspect the current implementation and identify the root cause if this is a bug
- Make the smallest safe set of changes required
- Ensure the feature integrates naturally into the current system
- Maintain visual and interaction consistency with the rest of the product
- Avoid placeholder logic or incomplete workarounds
- Do not remove or degrade any existing capability unless explicitly required

After implementation, return:
- What was causing the issue
- What you changed
- Files touched
- Any edge cases handled
- Confirmation of what existing behavior remains unaffected

# Examples of protected-area language
Use these patterns when relevant:
- Do not disrupt export to any format
- Do not affect current rendering logic
- Do not break authentication, payments, or routing
- Do not alter existing animations unless required for the task
- Do not change the current layer structure or object selection behavior outside the requested fix
- Preserve current responsive behavior unless the task is specifically about responsiveness

# Quality bar
A good output from this skill should feel like something a senior product designer or product engineer would hand to an implementation agent with confidence.