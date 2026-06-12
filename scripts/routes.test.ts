/**
 * App-route smoke test for the V2 playable route.
 * Run with: npx tsx scripts/routes.test.ts
 */

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let failures = 0;

function assert(condition: boolean, label: string): void {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

function exists(path: string): boolean {
  try {
    return statSync(join(root, path)).isFile();
  } catch {
    return false;
  }
}

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

console.log("\n— App routes —");
for (const path of [
  "src/app/page.tsx",
  "src/app/game/page.tsx",
  "src/app/(game)/map/page.tsx",
  "src/app/(game)/quests/page.tsx",
  "src/app/(game)/quest/[questId]/page.tsx",
  "src/app/settings/page.tsx",
]) {
  assert(exists(path), `${path} exists`);
}

const gamePage = read("src/app/game/page.tsx");
assert(gamePage.includes("@/game/PhaserGame"), "/game renders the Phaser shell");

const phaserShell = read("src/game/PhaserGame.tsx");
assert(phaserShell.includes('import("phaser")'), "Phaser runtime loads only in the browser");
assert(phaserShell.includes("bootError"), "Phaser shell exposes startup errors instead of a blank screen");

const menu = read("src/features/menu/MainMenu.tsx");
assert(menu.includes('router.push("/game")'), "main menu launches the playable V2 route");
assert(!menu.includes('router.push("/map")'), "main menu no longer starts on the old map route");

console.log("\n— Phaser modules —");
for (const path of [
  "src/game/PhaserGame.tsx",
  "src/game/createGameConfig.ts",
  "src/game/scenes/BootScene.ts",
  "src/game/scenes/PreloadScene.ts",
  "src/game/scenes/WorldScene.ts",
  "src/game/scenes/HudScene.ts",
  "src/game/scenes/DialogueScene.ts",
  "src/game/scenes/PauseScene.ts",
]) {
  assert(exists(path), `${path} exists`);
}

console.log(failures === 0 ? "\n✅ ROUTES OK" : `\n❌ ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
