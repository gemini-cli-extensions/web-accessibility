import { spawn } from "node:child_process";
import { addCleanupAgentTest } from "../../pipeline/index.js";

/**
 * Runs a shell command in the test's project directory and waits for it
 * to emit a specific pattern on stdout, then returns the output.
 * This is useful for starting a dev server and getting its URL.
 */
export async function runCommand(
    projectDir: string,
    command: string,
    waitFor?: string | RegExp
): Promise<string> {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, {
            cwd: projectDir,
            shell: true, // Use shell to support commands like `npx` and arguments
        });

        let stdout = "";
        let stderr = "";
        let resolved = false;

        const cleanup = () => {
            childProcess.stdout.removeAllListeners();
            childProcess.stderr.removeAllListeners();
            childProcess.removeAllListeners();
        };

        const cleanupAndResolve = (value: string) => {
            if (!resolved) {
                resolved = true;
                cleanup();
                resolve(value);
            }
        };

        const cleanupAndReject = (err: Error) => {
            if (!resolved) {
                resolved = true;
                cleanup();
                reject(err);
            }
        };

        childProcess.stdout.on("data", (data) => {
            const chunk = data.toString();
            stdout += chunk;
            console.log(`[${command} stdout]: ${chunk}`, waitFor);
            if (waitFor && stdout.match(waitFor)) {
                cleanupAndResolve(stdout);
            }
        });

        childProcess.stderr.on("data", (data) => {
            const chunk = data.toString();
            stderr += chunk;
            console.error(`[${command} stderr]: ${chunk}`);
        });

        childProcess.on("error", (err) => {
            cleanupAndReject(err);
        });

        childProcess.on("close", (code) => {
            if (resolved) {
                return;
            }
            if (waitFor) {
                cleanupAndReject(
                    new Error(
                        `Command "${command}" exited with code ${code} before 'waitFor' pattern was found.\n${stderr}`
                    )
                );
            } else if (code !== 0) {
                cleanupAndReject(
                    new Error(
                        `Command "${command}" exited with code ${code}:\n${stderr}`
                    )
                );
            } else {
                cleanupAndResolve(stdout);
            }
        });
        addCleanupAgentTest(async () => {
            childProcess.kill();
            return Promise.resolve();
        });
    });
}