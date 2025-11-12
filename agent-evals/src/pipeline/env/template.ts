import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";

enum TemplatePlatform {
  NODE,
  STATIC,
}

const templates = [
  {
    name: "next-app-hello-world",
    platform: TemplatePlatform.NODE,
  }
] as const;

export type TemplateName = (typeof templates)[number]["name"];

interface Template {
  // Name of the directory that the template resides in (eg. templates/<name>)
  name: TemplateName;
  platform: TemplatePlatform;
}

export async function buildTemplates(): Promise<void> {
  console.log("Building templates");
  for (const template of templates) {
    switch (template.platform) {
      case TemplatePlatform.NODE: {
        await buildNodeTemplate(template);
      }
    }
  }
}

async function buildNodeTemplate(template: Template): Promise<void> {
  const templateDir = path.resolve(path.join("templates", template.name));
  if (fs.existsSync(path.join(templateDir, "node_modules"))) {
    return;
  }

  console.log(`Running \`npm install\` in template ${template.name}`);
  execSync("npm install", {
    cwd: templateDir,
    stdio: "inherit",
    timeout: 30000,
  });
}
