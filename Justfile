default:
    @just --list

# Check the site, Git history, and repository configuration.
check revisions="HEAD": (commit-messages revisions)
    just --fmt --check --unstable
    lefthook validate
    shellcheck .lefthook/pre-push/check test/git-hooks.sh
    actionlint
    zizmor --pedantic .github/workflows
    gitleaks git --log-opts="--diff-merges=first-parent HEAD" --redact --no-banner
    sh test/git-hooks.sh
    npm run check

[private]
[script("sh", "-eu")]
commit-messages $revisions:
    commits=$(git rev-list --no-merges --no-walk --end-of-options "$revisions" --)
    for commit in $commits; do
        committed "$commit"
    done
