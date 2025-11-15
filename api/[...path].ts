import dotenv from "dotenv";
import serverless from "serverless-http";
import { createServer } from "../server/index";

// Load environment variables
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// Create Express app
const app = createServer();

// Export serverless handler
export default serverless(app);
