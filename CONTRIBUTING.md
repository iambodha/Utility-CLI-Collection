# Contributing

Use this repository as the canonical home for the collection. Open issues and pull requests here.

1. Install Node.js 20+ and run `npm ci`.
2. Keep each interactive utility in a clearly named root-level `.js` file.
3. Declare runtime dependencies in `package.json` and commit the updated lockfile.
4. Run `npm run check`, then manually try the affected flow in a terminal.
5. Use temporary files/directories for file operations and document API keys or system requirements.

Describe the concrete behavior change and the checks you performed. Keep credentials and personal data out of commits. The syntax/setup check is not a substitute for exercising changed behavior.
