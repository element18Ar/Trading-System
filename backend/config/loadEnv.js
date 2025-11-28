import DotenvFlow from "dotenv-flow";
import path from "path";
import { fileURLToPath } from "url";

export function loadEnv(moduleUrl) {
  const callerFile = fileURLToPath(moduleUrl);
  const serviceDir = path.dirname(callerFile);
  const backendDir = path.resolve(serviceDir, "../");
  const projectRoot = path.resolve(serviceDir, "../../");

  // 1) Load project root .env (optional)
  DotenvFlow.config({ path: projectRoot, silent: true });

  // 2) Load service-specific .env (primary, override root values)
  DotenvFlow.config({ path: serviceDir, silent: false, override: true });
}
