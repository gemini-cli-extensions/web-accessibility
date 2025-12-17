# Web Accessibility Gemini CLI Extension

The Web Accessibility extension is an open-source Gemini CLI extension that is designed to enhance your development workflow by connecting Gemini CLI with accessibility expertise. This integration aims to automate web accessibility testing and remediation directly within your command line, with the goal of streamlining the creation of more inclusive software.

**Note:** Gemini can make mistakes and may not catch all accessibility issues. Please use responsibly and review results with care.

## Features

-   **Accessible Code Writing Mindset:** Write code considering accessibility from the start, making it an integral part of the development workflow.
-   **Finds Accessibility Issues:** Designed to run an accessibility audit on your local web application using the powerful `axe-core` engine and generate a clear `ACCESSIBILITY_REVIEW_TODO.md` file listing certain types of violations.
-   **Fixes Violations Automatically:** Reads the generated `ACCESSIBILITY_REVIEW_TODO.md` file and attempts to fix the identified violations in your codebase.
-   **Works Within Your Terminal:** The entire process, from auditing to fixing, happens in your command line using [Gemini CLI](https://github.com/google-gemini/gemini-cli), so you don't have to switch between different tools.

## Prerequisites

Before you begin, ensure you have the following:

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) installed with version **+v0.6.0**.

## Installation

Install the web-accessibility extension by running the following command from your terminal (requires Gemini CLI v0.4.0 or newer):

```bash
gemini extensions install https://github.com/gemini-cli-extensions/web-accessibility
```

The extension comes with platform-specific browser binaries pre-installed, so it's ready to use immediately after installation.

## Usage Workflow

This extension adds two new commands to Gemini CLI, `/accessibility:review` and `/accessibility:fix`. Here’s a typical workflow for using these commands to help improve the accessibility of your web application:

### Step 1: Navigate to Your Project

Open your terminal and change the directory to the root of your web application's project.

```bash
cd /path/to/your-web-app
```

### Step 2: Start Your Development Server

Run your local development server as you normally would. For example:

```bash
npm run dev
```

Make sure your application is running and accessible.

### Step 3: Run the Accessibility Review

Use the `review` command to audit your running application. You must provide the URL where your application is being served (e.g., `http://localhost:3000`).

```bash
/accessibility:review <url>
```

The extension will perform an audit and create a file named `ACCESSIBILITY_REVIEW_TODO.md` in your project's root directory. This file contains a checklist of accessibility violations identified.

**Important:** It is recommended to run this command from the root directory of your web application's codebase, as the generated `ACCESSIBILITY_REVIEW_TODO.md` file is looked for and used by the `fix` command to work on your codebase and resolve the accessibility violations.

### Step 4: Automatically Fix Violations

After the review is complete, you can use the `fix` command to automatically correct the issues listed in the `ACCESSIBILITY_REVIEW_TODO.md` file.

```bash
/accessibility:fix
```

The extension will go through the checklist, apply fixes, and provide explanations for each change. Once the process is complete, it will update the `ACCESSIBILITY_REVIEW_TODO.md` file to mark the resolved issues.

**Important:** This command must be run from the root directory of your web application's codebase. The Gemini CLI extension operates on the current working directory, and it is the user's responsibility to ensure the command is executed in the correct location for the agent to have the proper codebase context.

## Uninstallation

To remove the extension:

```bash
gemini extensions uninstall web-accessibility
```

This removes the extension and all bundled browser binaries from `~/.gemini/extensions/web-accessibility` (macOS/Linux) or `%USERPROFILE%\.gemini\extensions\web-accessibility` (Windows).

## Powered by Open Source

This extension is built upon the work of several powerful open-source libraries:

-   **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)** and **[axe-core](https://www.deque.com/axe/)**: The accessibility analysis is powered by the `axe-core` engine for identifying accessibility violations.
-   **[playwright](https://playwright.dev)**: Used for browser automation to run the accessibility audits on your web application.
-   **[color-contrast-picker](https://github.com/abelmcelroy/color-contrast-picker)**: Helps in automatically finding compliant color contrasts to fix accessibility issues.
-   **[@modelcontextprotocol/sdk](https://modelcontextprotocol.io)**: The underlying SDK for building Gemini CLI extensions.

We are grateful to the maintainers and contributors of these projects for their invaluable work.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](docs/contributing.md) for more information about contributing to this project.

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for more details.