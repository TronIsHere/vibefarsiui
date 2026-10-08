#!/usr/bin/env node
import { parseArgs } from "./args.js";
import { runAdd, runList } from "./add.js";
import { runInit } from "./init.js";
import { color, fail, hint } from "./log.js";
const VERSION = "2.0.0";
const HELP = `
${color.bold("vibefarsi")} v2  Persian RTL components for React + Tailwind

Usage
  npx vibefarsi@latest init
  npx vibefarsi add button calendar price
  npx vibefarsi list [components|charts|blocks|animations|backgrounds|templates|themes|skills|lib]

Commands
  init     dir="rtl", Vazirmatn/IRANSans, Graphite tokens, lib/utils.ts, lib/jalali.ts,
           agent rules in AGENTS.md + docs/ (Persian RTL and UI craft)
  add      Pull items from the registry into your app (components, blocks, themes, skills…)
  list     Show registry slugs

Flags
  --cwd <dir>          Project directory (default: .)
  --registry <url>     Registry root (default: https://vibefarsi.ir/r)
  --font vazirmatn|iransans
  --theme <slug>       Design tokens to apply on init (default: graphite)
  --overwrite          Replace existing files
  --no-install         Do not npm-install dependencies
  --dry-run            Print actions without writing
  -y, --yes            Non-interactive (default)

Examples
  npx vibefarsi@latest init --font vazirmatn
  npx vibefarsi add button
  npx vibefarsi add calendar          # also pulls lib/jalali.ts
  npx vibefarsi add button calendar price --registry http://localhost:3000/r
`.trim();
async function main() {
    let flags;
    try {
        flags = parseArgs(process.argv.slice(2));
    }
    catch (err) {
        fail(err instanceof Error ? err.message : String(err));
        process.exitCode = 1;
        return;
    }
    if (flags.version) {
        console.log(VERSION);
        return;
    }
    if (flags.help || !flags.command) {
        console.log(HELP);
        return;
    }
    switch (flags.command) {
        case "init":
            await runInit(flags);
            break;
        case "add":
            await runAdd(flags);
            break;
        case "list":
            await runList(flags);
            break;
        default:
            fail(`Unknown command: ${flags.command}`);
            hint("npx vibefarsi --help");
            process.exitCode = 1;
    }
}
main().catch((err) => {
    fail(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
});
