import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const generated = new Set([
	".build",
	".git",
	".wrangler",
	"dist",
	"node_modules",
]);

test("the build writes the script-free homepage and public files to dist", (t) => {
	const project = mkdtempSync(join(tmpdir(), "homepage-build-"));
	t.after(() => rmSync(project, { recursive: true, force: true }));
	cpSync(root, project, {
		recursive: true,
		filter: (source) => !generated.has(basename(source)),
	});
	symlinkSync(
		join(root, "node_modules"),
		join(project, "node_modules"),
		"junction",
	);
	mkdirSync(join(project, "dist"));
	writeFileSync(join(project, "dist/stale.html"), "<p>stale</p>");

	const result = spawnSync(process.execPath, ["--run", "build"], {
		cwd: project,
		encoding: "utf8",
	});
	if (result.error) throw result.error;
	assert.equal(result.status, 0, result.stdout + result.stderr);

	const html = readFileSync(join(project, "dist/index.html"), "utf8");
	assert.match(html, /^<!DOCTYPE html><html lang="en"><head>/);
	assert.match(html, /<meta charset="utf-8"\/?>/);
	assert.match(
		html,
		/<meta name="viewport" content="width=device-width, initial-scale=1"\/?>/,
	);
	assert.match(html, /<title>hi! \| Yasunobu Sakashita<\/title>/);
	assert.match(html, /<body><p>hi!<\/p><\/body><\/html>$/);
	assert.doesNotMatch(html, /<script/i);

	assert.equal(
		readFileSync(join(project, "dist/_headers"), "utf8"),
		readFileSync(join(root, "public/_headers"), "utf8"),
	);
	assert.equal(existsSync(join(project, "dist/stale.html")), false);
});
