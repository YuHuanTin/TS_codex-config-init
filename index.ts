import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import {exec} from "node:child_process";

if (process.argv.length !== 4) {
    console.log('node index.ts <URL> <Key>')
    process.exit(0);
}

console.log(`url = ${process.argv[2]}`)
console.log(`key = ${process.argv[3]}`)

let key = process.argv[2]
let url = process.argv[3]

///
let base = os.homedir();
let codexDir = path.join(base, '.codex')
let configPath = path.join(codexDir, 'config.toml')
let configBase =
    `model_provider = "codex"
model = "gpt-5.4"
model_reasoning_effort = "high"
disable_response_storage = true
sandbox_mode = "danger-full-access"

[model_providers.codex]
name = "codex"
base_url = "$BaseUrl"
wire_api = "responses"
env_key = "CODEX_API_KEY"

[features]
rmcp_client = true
streamable_shell = false
unified_exec = false
view_image_tool = true
multi_agent = true
prevent_idle_sleep = true
fast_mode = true`

function setEnv(key: string) {
    exec(`setx CODEX_API_KEY ${key}`, (error, stdout, stderr) => {
        console.log(`stdout = ${stdout}\nstderr = ${stderr}\nerr = ${error}`)
    });
}

function createConfig(url: string) {
    configBase = configBase.replace('$BaseUrl', url);
    fs.writeFileSync(configPath, configBase);
}

if (!fs.existsSync(configPath)) {
    createConfig(url)
    setEnv(key)
} else {
    console.log('already has config.toml, exit...')
}

