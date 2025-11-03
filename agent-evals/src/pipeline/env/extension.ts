import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execPromise = promisify(exec);

export async function installAccessibilityExtension() {
  const accessibilityExtensionRoot = getAccessibilityExtensionRoot();
  console.log(`Installing Accessibility Extension at ${accessibilityExtensionRoot}`);
  await execPromise("yes | gemini extensions link .", { cwd: accessibilityExtensionRoot });
}

function getAccessibilityExtensionRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
}

export async function clearUserAccessibilityExtension() {
  console.log(`Clearing existing web-accessibility extension and web-accessibility-mcpserver...`);
  try {
    await execPromise("gemini extensions uninstall web-accessibility");
  } catch (_: any) {
    /* This can fail if there's nothing installed, so ignore that */
  }
  try {
    await execPromise("gemini mcp remove web-accessibility-mcpserver");
  } catch (_: any) {
    /* This can fail if there's nothing installed, so ignore that */
  }
}
