import { startAgentTest } from "../pipeline/index.js";
import { AgentTestRunner } from "../pipeline/runner/agent-test-runner.js";
import { expect } from "chai";
import "../mocha/hooks.js";

async function runReviewFixWorkflow(run: AgentTestRunner, url: string) {
  // Run the accessibility review command
  await run.type(`/accessibility:review ${url}`);
  await run.expectToolCalls(["a11y_audit_web_url"]);
  await run.expectToolCalls(["write_file"]);
  await run.expectText(/ACCESSIBILTY_REVIEW_TODO.md/i);

  // Run the accessibility fix command
  await run.type(`/accessibility:fix`);
  await run.expectText(/All accessibility issues have been fixed/i);
}

describe("Review & Fix workflow should fix accessibility violations", function (this: Mocha.Suite) {
  let run: AgentTestRunner;
  let projectDir: string;

  beforeEach(async function (this: Mocha.Context) {
    // `startAgentTest` creates a new temporary directory for the test run,
    // and copies the template into it.
    const result = await startAgentTest(this, {
      templateName: "accessible_u",
    });
    run = result.runner;
    projectDir = result.projectDir;
  });

  it("should generate an app, start the server, and run accessibility review", async function (this: Mocha.Context) {
    // Start the development server
    const serverOutput = await run.runCommand("npx serve .", /Accepting connections at/i);
    const urlMatch = serverOutput.match(/(http:\/\/localhost:\d+)/);
    expect(urlMatch, "Should find a localhost URL").to.not.be.null;
    const url = urlMatch![0] + '/before_u';
    console.log(`Development server started at: ${url}`);

    // Run the accessibility review command
    await run.type(`/accessibility:review ${url}`);
    await run.expectToolCalls(["a11y_audit_web_url"]);
    await run.expectToolCalls(["write_file"]);
    await run.expectText(/ACCESSIBILTY_REVIEW_TODO.md/i);


  });
});