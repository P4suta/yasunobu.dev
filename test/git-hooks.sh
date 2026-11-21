#!/bin/sh
set -eu

project=$(pwd)
fixture=$(mktemp -d)
trap 'rm -rf "${fixture}"' EXIT

# Git exports repository paths to hooks, including the index of the calling checkout.
for name in $(git rev-parse --local-env-vars); do
	unset "${name}"
done
export GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null
cd "${fixture}"
git init --quiet --initial-branch=main
ln -s "${project}/mise.toml" mise.toml
ln -s "${project}/node_modules" node_modules
cp "${project}/Justfile" "${project}/lefthook.yml" "${project}/committed.toml" "${project}/package.json" "${project}/.prettierrc.json" .
cp -R "${project}/.lefthook" .
lefthook install

expect_rejection() {
	diagnostic=$1
	shift
	if output=$("$@" 2>&1); then
		printf 'Expected rejection from %s\n' "$*" >&2
		exit 1
	fi
	case "${output}" in
	*"${diagnostic}"*) ;;
	*)
		printf 'Missing diagnostic %s in:\n%s\n' "${diagnostic}" "${output}" >&2
		exit 1
		;;
	esac
}

message=".git/sample message"
printf 'docs: document local checks\n' >"${message}"
git hook run commit-msg -- "${message}"
printf 'Document local checks\n' >"${message}"
expect_rejection 'Missing type' git hook run commit-msg -- "${message}"

printf '{"ready":true}\n' >"sample page.json"
git add -- "sample page.json"
expect_rejection 'sample page.json' git hook run pre-commit
printf '{ "ready": true }\n' >"sample page.json"
git add -- "sample page.json"
git hook run pre-commit

git config user.name Fixture
git config user.email fixture@example.invalid
tree=$(git write-tree)
base=$(git commit-tree "${tree}" -m 'test: start history')
git update-ref HEAD "${base}"
printf '{"ready":false}\n' >"sample page.json"
git add -- "sample page.json"
printf '{ "ready": false }\n' >"sample page.json"
expect_rejection 'sample page.json' git hook run pre-commit
git add -- "sample page.json"
printf '{"ready":false}\n' >"sample page.json"
git hook run pre-commit

page=$(git commit-tree "${tree}" -p "${base}" -m 'feat: add a page')
notes=$(git commit-tree "${tree}" -p "${base}" -m 'docs: describe the page')
merge=$(git commit-tree "${tree}" -p "${page}" -p "${notes}" -m 'Merge topic into main')
just commit-messages "${base}..${merge}"
invalid=$(git commit-tree "${tree}" -p "${base}" -m 'Update the page')
tip=$(git commit-tree "${tree}" -p "${invalid}" -m 'docs: describe the update')
expect_rejection 'Missing type' just commit-messages "${base}..${tip}"

printf 'fixture=ghp_%s%s%s%s\n' D4k8tP2m9 R5w1sA7y3 Z8j6L2p4V n3X9h0C5q >token.txt
git add -- token.txt
expect_rejection 'leaks found' git hook run pre-commit

# Exercise the pre-push hook with a failing check and no outgoing file list.
git remote add origin .
git update-ref refs/remotes/origin/main "${base}"
git branch --quiet --set-upstream-to=origin/main
printf 'check:\n    @echo "project check failed" >&2\n    @exit 1\n' >Justfile
expect_rejection 'project check failed' git hook run pre-push
