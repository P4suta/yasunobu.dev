import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
	copyFileSync,
	mkdirSync,
	mkdtempSync,
	rmSync,
	symlinkSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("HTML validation requires the homepage and checks nested pages", (t) => {
	const project = mkdtempSync(join(tmpdir(), "homepage-html-"));
	t.after(() => rmSync(project, { recursive: true, force: true }));
	for (const name of ["package.json", ".htmlvalidate.json"]) {
		copyFileSync(new URL(`../${name}`, import.meta.url), join(project, name));
	}
	symlinkSync(
		new URL("../node_modules", import.meta.url),
		join(project, "node_modules"),
		"junction",
	);

	const homepage = join(project, "dist/index.html");
	const notes = join(project, "dist/notes/index.html");
	const valid =
		'<!DOCTYPE html><html lang="en"><head><title>Notes</title></head><body><p>Notes</p></body></html>';
	mkdirSync(join(project, "dist/notes"), { recursive: true });
	writeFileSync(homepage, valid);
	writeFileSync(notes, valid);

	function lint() {
		const result = spawnSync(process.execPath, ["--run", "lint:html"], {
			cwd: project,
			encoding: "utf8",
		});
		if (result.error) throw result.error;
		assert.equal(result.signal, null);
		return { status: result.status, output: result.stdout + result.stderr };
	}

	const clean = lint();
	assert.equal(clean.status, 0, clean.output);

	writeFileSync(notes, valid.replace("<p>", '<p style="color: red">'));
	const invalid = lint();
	assert.equal(invalid.status, 1, invalid.output);
	assert.match(invalid.output, /no-inline-style/);

	writeFileSync(
		notes,
		valid.replace("<title>", '<meta charset="utf-8"><title>'),
	);
	const omittedVoid = lint();
	assert.equal(omittedVoid.status, 1, omittedVoid.output);
	assert.match(omittedVoid.output, /void-style/);

	writeFileSync(notes, valid);
	unlinkSync(homepage);
	const missing = lint();
	assert.equal(missing.status, 1, missing.output);
	assert.match(missing.output, /dist\/index\.html/);
});
