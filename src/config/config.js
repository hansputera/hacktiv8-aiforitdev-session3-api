import { cleanEnv, host, port, str } from "envalid";

export const configEnv = cleanEnv(process.env, {
    GEMINI_API_KEY: str(),
    PORT: port({
        default: 3000,
        desc: "The port on which the server will run",
    }),
    HOSTNAME: host({
        default: "localhost",
        desc: "The hostname for the server",
    }),
});
