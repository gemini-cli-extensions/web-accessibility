import { startAgentTest } from "../pipeline/index.js";
import { AgentTestRunner } from "../pipeline/runner/agent-test-runner.js";
import { promises as fs } from "fs";
import path from "path";
import { expect } from "chai";
import "../mocha/hooks.js";

describe("Accessibility Eval Pipeline", function (this: Mocha.Suite) {
  // LLMs can be non-deterministic, so retries are a good idea.
  this.retries(2);

  let run: AgentTestRunner;
  let projectDir: string;

  before(async function (this: Mocha.Context) {
    // `startAgentTest` creates a new temporary directory for the test run,
    // and copies the template into it.
    const result = await startAgentTest(this, {
      templateName: "next-app-hello-world",
    });
    run = result.runner;
    projectDir = result.projectDir;
  });

  it("should generate an app, start the server, and run accessibility review", async function (this: Mocha.Context) {
    // 1. Prompt to generate a web application on top of the template
    await run.type(
      "Create a login form with a username field, a password field, and a submit button. Do not use any labels for the input fields, use placeholders instead."
    );
    // We need to wait for the app generation to complete.
    // We'll look for the "Project created" message from the CLI.
    await run.expectText("Project created successfully!");

    // 2. Start the development server (fixed command due to template)
    const serverOutput = await run.runCommand("npm run dev", /ready started server on/i);
    const urlMatch = serverOutput.match(/(http:\/\/localhost:\d+)/);
    expect(urlMatch, "Should find a localhost URL").to.not.be.null;
    const url = urlMatch![0];
    console.log(`Development server started at: ${url}`);

    // 3. Run the accessibility review command
    await run.type(`/accessibility:review ${url}`);
    await run.expectToolCalls(["a11y_audit_web_url"]);
    await run.expectText("Accessibility review complete.");

    // 4. Verify the output
    // Check if the ACCESSIBILITY_REVIEW_TODO.md file was created and has content.
    const reportPath = path.join(projectDir, "ACCESSIBILITY_REVIEW_TODO.md");
    const reportContent = await fs.readFile(reportPath, "utf-8");

    expect(reportContent).to.include(
      "Ensures every form element has a label"
    );
    expect(reportContent).to.include("[ ]"); // Check for un-checked boxes
  });
});