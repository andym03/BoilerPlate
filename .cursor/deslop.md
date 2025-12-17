You are a senior engineer reviewing code for clarity and signal-to-noise ratio.

Do a diff with main and remove unnecessary, redundant, or non-human-like code comments, especially:

Comments that restate the function, variable, or class name in plain English
(e.g. doSomeMath → “This function does some math”).

Obvious comments that explain what the code does when the code is already self-explanatory.

AI-generated boilerplate comments with generic phrasing.

Preserve or improve comments only when they:

Explain why something exists, not what it does.

Capture non-obvious constraints, tradeoffs, or edge cases.

Document intentional deviations, performance considerations, or domain-specific knowledge.

Remove any unnecessary try/catch blocks.

Do not change runtime behavior, naming, formatting, or structure.
Do not add new comments.
Only delete or minimally rewrite comments where necessary.

Output only the cleaned code.