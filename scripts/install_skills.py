#!/usr/bin/env python3
"""Install Hiroqt skills to supported coding agents in this project or globally."""

import os
from pathlib import Path
import subprocess
import sys
import time


ROOT = Path(__file__).resolve().parents[1]
AGENTS = (
    "claude-code", "codex", "gemini-cli", "antigravity", "cursor", "kiro-cli",
)


def show_banner(stream=None, color=None, delay=0.045):
    stream = stream or sys.stdout
    if color is None:
        color = (getattr(stream, "isatty", lambda: False)()
                 and "NO_COLOR" not in os.environ
                 and os.environ.get("TERM") != "dumb")
    wordmark = "HIROQT"
    palette = ("38;5;51", "38;5;45", "38;5;81", "38;5;117", "38;5;141", "38;5;213")
    for index, character in enumerate(wordmark):
        if color:
            stream.write("\033[{}m{}\033[0m".format(palette[index], character))
            stream.flush()
            if delay:
                time.sleep(delay)
        else:
            stream.write(character)
    stream.write("\nAgent Skills Installer\n\n")


def choose_scope(input_fn=input, write=None):
    write = write or sys.stdout.write
    while True:
        write("Where should Hiroqt skills be installed?\n")
        write("  1) This project\n  2) Global (your user account)\n")
        choice = input_fn("Choose 1 or 2: ").strip().lower()
        if choice in ("1", "project", "p"):
            return "project"
        if choice in ("2", "global", "g"):
            return "global"
        write("Choose 1 or 2.\n\n")


def build_command(scope, source=ROOT):
    command = ["npx", "--yes", "skills@latest", "add", str(source), "--skill", "*", "--copy"]
    for agent in AGENTS:
        command.extend(("--agent", agent))
    if scope == "global":
        command.append("--global")
    command.append("--yes")
    return command


def main(input_fn=input, output=None, cwd=None, run=subprocess.run):
    output = output or sys.stdout
    cwd = Path(cwd or Path.cwd()).resolve()
    try:
        show_banner(output)
        scope = choose_scope(input_fn, output.write)
        destination = str(cwd) if scope == "project" else "your user-level agent skill folders"
        output.write("\nInstall every Hiroqt skill for {}?\n".format(destination))
        output.write("Agents: {}\n".format(", ".join(AGENTS)))
        if input_fn("Continue? [y/N]: ").strip().lower() not in ("y", "yes"):
            output.write("Installation cancelled.\n")
            return 0
    except (EOFError, KeyboardInterrupt):
        output.write("\nInstallation cancelled.\n")
        return 130

    try:
        completed = run(build_command(scope), cwd=str(cwd), check=False)
    except FileNotFoundError:
        output.write("Could not start npx. Install Node.js/npm, then try again.\n")
        return 127
    if completed.returncode == 0:
        output.write("\nHiroqt skills installed for {}.\n".format(destination))
    else:
        output.write("\nInstaller exited with status {}.\n".format(completed.returncode))
    return completed.returncode


if __name__ == "__main__":
    sys.exit(main())
