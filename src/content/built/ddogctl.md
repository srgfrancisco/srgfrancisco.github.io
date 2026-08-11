---
name: ddogctl
repo: https://github.com/srgfrancisco/ddogctl
pypi: https://pypi.org/project/ddogctl
license: MIT
summary: "A CLI for the Datadog API, built end to end with Claude Code as the method."
stack: [Python 3.10+, Datadog API, Claude Code, PyPI]
verified: 2026-08-11
---

## The gap

Investigating a production incident through the Datadog web UI means a lot of
tab-switching: a trace here, the correlated logs there, the slow query in a
third place. I wanted that flow in a terminal, close to where I was already
working, so I built it as an internal tool at Kojo to speed up production
investigation, then genericised it and open-sourced it under MIT.

Dogshell already exists and covers a different surface; the ddogctl README
compares the two directly.

## What it does

- APM trace search
- Log querying with trace correlation
- Database monitoring — slow queries and execution plans
- Monitors
- Cross-signal investigation workflows that stitch the above together

Eight releases, v1.0.0 through v2.1.0, between February and May 2026.
74 commits.

## Why it is here

Not because of its reach — it is a small tool with a small audience. It is here
because it is the one piece of my AI-assisted development argument that is
public and inspectable rather than described.

I built it end to end with Claude Code as the development workflow: initial
design, implementation, packaging, releases. Then I maintained it for three
months and eight releases. Everything about that is verifiable from the commit
history and the PyPI release timeline, which is more than I can offer for work
that happened inside private repositories.
