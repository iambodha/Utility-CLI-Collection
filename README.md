# Utility CLI Collection

> **Canonical CLI repository.** This is the main home for this JavaScript CLI collection. Use this repository for future development and new issues.

24 interactive JavaScript utilities for the terminal: inspect files, manipulate text/data, explore algorithms, and run small personal utilities. Each tool is a standalone script at the repository root.

## Install and run

Requires Node.js 20+ and npm. Use a terminal with interactive input.

```sh
git clone https://github.com/iambodha/Utility-CLI-Collection.git
cd Utility-CLI-Collection
npm ci
node calculator-cli.js
```

Choose a different script to launch a different tool:

```sh
node algorithm-visualizer.js
node directory-size-calculator.js
node json-manipulator.js
```

There is no global installer or shared launcher. The package is marked private to prevent accidental npm publication; the source repository remains public and MIT-licensed.

## Tools

| Group | Scripts |
| --- | --- |
| Learning and reference | `algorithm-visualizer.js`, `calculator-cli.js`, `cheat-sheet.js` |
| Files and documents | `directory-organizer.js`, `directory-size-calculator.js`, `file-encryption.js`, `pdf-tool.js` |
| Text and data | `csv-manipulator.js`, `json-manipulator.js`, `text-diff.js` |
| Images | `image-resizer.js`, `image-metadata-extractor.js` |
| Personal utilities | `calendar.js`, `notes.js`, `finance-tracker.js`, `password-generator.js`, `random-quote-generator.js` |
| Network and external services | `network-scanner.js`, `website-monitor.js`, `news-fetcher.js`, `crypto-price-checker.js`, `stock-price-checker.js` |
| Development and system | `git-commit-visualizer.js`, `system-monitor.js` |

The algorithm visualizer includes sorting, searching, and dynamic-programming examples, including Fibonacci, knapsack, longest common subsequence, and coin change.

## Requirements and maturity

These are personal utility prototypes, with varying validation coverage. Some scripts write files or move directory contents; use fixture files and a temporary directory when trying those tools. Local notes, calendar entries, and finance data are stored relative to the working directory by their respective scripts.

- `news-fetcher.js` contains a NewsAPI key placeholder and `stock-price-checker.js` contains an Alpha Vantage placeholder. Configure those locally before use; do not commit real credentials.
- Price, quote, news, and website tools need network access. External endpoints and rate limits can change independently of this repository.
- `network-scanner.js` uses the system's ping utility. `git-commit-visualizer.js` needs Git and an accessible repository.
- Image resizing uses Sharp's platform-specific binaries, installed by npm.
- The encryption and password scripts are experiments and have not undergone a security review.

## Development checks

```sh
npm run check
```

This syntax-checks all 24 root CLI scripts and verifies that the declared packages resolve. CI repeats installation and those checks on Node.js 22. It does not execute interactive utilities, touch user files, contact external APIs, or certify their results.

Keep new development here. When adding a tool, document its input/output behavior, declare its packages, and exercise it against temporary fixtures. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT License](LICENSE).
