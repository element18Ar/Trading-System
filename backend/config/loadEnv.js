import DotenvFlow from "dotenv-flow";
import path from "path";
import { fileURLToPath } from "url";

export function loadEnv(moduleUrl) {
  const __filename = fileURLToPath(moduleUrl);
  const __dirname = path.dirname(__filename);

  // Load global .env
  DotenvFlow.config({ path: path.resolve(__dirname, "../") });

  // Load service-specific .env
  DotenvFlow.config({ path: path.resolve(__dirname, ".") });
}