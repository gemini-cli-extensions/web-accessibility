import { installAccessibilityExtension, clearUserAccessibilityExtension } from "./env/extension.js";

import path from "node:path";
import fs from "node:fs";
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { AgentTestRunner } from "./runner/agent-test-runner.js";
import { GeminiCliRunner } from "./runner/gemini-cli-runner.js";
import { addCleanup } from "../mocha/hooks.js";
import { TemplateName, buildTemplates } from "./env/template.js";

export * from "./runner/agent-test-runner.js";

const dateName = new Date().toISOString().replace("T", "_").replace(/:/g, "-").replace(".", "-");

export async function setupEnvironment(): Promise<void> {
  if (process.env.BASE_GEMINI_CLI) {
    clearUserAccessibilityExtension();
  } else {
    installAccessibilityExtension();
  }
  await buildTemplates();
}

export interface AgentTestOptions {
  // Name of the directory that the template resides in (eg. templates/<name>)
  templateName?: TemplateName;
}

export async function startAgentTest(
  mocha: Mocha.Context,
  options?: AgentTestOptions
): Promise<{ runner: AgentTestRunner; projectDir: string }> {
  if (!mocha.test) {
    throw new Error(
      "startAgentTest must be called inside of an `it` block of a Mocha test."
    );
  }
  const testName = mocha.test.fullTitle();
  const { testDir, runDir } = createRunDirectory(testName);

  if (options?.templateName) {
    copyTemplate(options.templateName, runDir);
  }

  const run = new GeminiCliRunner(testName, testDir, runDir);
  await run.waitForReadyPrompt();

  addCleanup(async () => {
    await run.exit();
  });

  return { runner: run, projectDir: runDir };
}

function createRunDirectory(testName: string): { testDir: string; runDir: string } {
  const sanitizedName = testName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const testDir = path.resolve(
    path.join("output", dateName, `${sanitizedName}-${randomBytes(8).toString("hex")}`),
  );
  const runDir = path.join(testDir, "repo");
  mkdirSync(runDir, { recursive: true });
  return { testDir, runDir };
}

function copyTemplate(name: TemplateName, runDir: string) {
  const templateDir = path.resolve(path.join("templates", name));
  const templateContents = fs.readdirSync(templateDir);
  for (const item of templateContents) {
    const srcPath = path.join(templateDir, item);
    const destPath = path.join(runDir, item);
    fs.cpSync(srcPath, destPath, { recursive: true });
  }
}