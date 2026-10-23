import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { detectIDEHosts, detectHosts, executeInstall, installSkills, prepareInstall, showBanner } from '../../bin/overdrive.js';

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../bin/overdrive.js');

test('package metadata targets the public unscoped npm package', async () => {
  const packagePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../package.json');
  const metadata = JSON.parse(await readFile(packagePath, 'utf8'));

  assert.equal(metadata.name, 'overdrive-skills');
  assert.equal(metadata.publishConfig.access, 'public');
  assert.equal(metadata.repository.url, 'git+https://github.com/hiroqt/overdrive.git');
});

test('CLI help shows the unscoped npm install command', () => {
  const result = spawnSync(process.execPath, [CLI, '--help'], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: npx overdrive-skills install/);
  assert.match(result.stdout, /--scope global/);
  assert.doesNotMatch(result.stdout, /@hiroqt\/overdrive/);
});

test('banner restores the cyan-to-violet wordmark on color terminals', async () => {
  let output = '';
  const stream = { isTTY: true, write: (chunk) => { output += chunk; } };

  await showBanner(stream, { color: true, delayMs: 0 });

  assert.match(output, /\u001b\[38;5;51mH\u001b\[0m/);
  assert.match(output, /\u001b\[38;5;213mT\u001b\[0m/);
  assert.match(output, /OVERDRIVE SKILLS INSTALLER/);
});

test('banner stays plain in non-TTY output', async () => {
  let output = '';
  const stream = { isTTY: false, write: (chunk) => { output += chunk; } };

  await showBanner(stream, { delayMs: 0 });

  assert.match(output, /HIROQT/);
  assert.doesNotMatch(output, /\u001b\[/);
});

test('banner respects NO_COLOR in an interactive terminal', async () => {
  let output = '';
  const stream = { isTTY: true, write: (chunk) => { output += chunk; } };

  await showBanner(stream, { delayMs: 0, env: { NO_COLOR: '1', TERM: 'xterm-256color' } });

  assert.match(output, /HIROQT/);
  assert.doesNotMatch(output, /\u001b\[/);
});

test('banner stays plain in a dumb terminal', async () => {
  let output = '';
  const stream = { isTTY: true, write: (chunk) => { output += chunk; } };

  await showBanner(stream, { delayMs: 0, env: { TERM: 'dumb' } });

  assert.match(output, /HIROQT/);
  assert.doesNotMatch(output, /\u001b\[/);
});

test('project host detection returns only recognized marker hints', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await Promise.all([
    mkdir(path.join(paths.project, '.claude')),
    mkdir(path.join(paths.project, '.agents/skills'), { recursive: true }),
    mkdir(path.join(paths.project, '.kiro')),
    mkdir(path.join(paths.project, '.grok')),
    mkdir(path.join(paths.project, '.github/skills'), { recursive: true }),
  ]);

  const hints = await detectHosts(paths.project);

  assert.deepEqual(hints.map(({ id }) => id), ['vscode', 'claude-code', 'codex', 'kiro', 'grok']);
  assert.match(hints.find(({ id }) => id === 'codex').reason, /\.agents\/skills/);
  assert.match(hints.find(({ id }) => id === 'vscode').reason, /\.github\/skills/);
});

test('VS Code integrated terminal detects installed agent extensions and falls back to Copilot skills', () => {
  assert.deepEqual(detectIDEHosts({ TERM_PROGRAM: 'vscode' }, ['OpenAI.chatgpt']), ['codex']);
  assert.deepEqual(detectIDEHosts({ VSCODE_PID: '1234' }, ['Anthropic.claude-code']), ['claude-code']);
  assert.deepEqual(detectIDEHosts({ TERM_PROGRAM: 'vscode' }, ['GitHub.copilot-chat']), ['vscode']);
  assert.deepEqual(detectIDEHosts({ TERM_PROGRAM: 'vscode' }, []), ['vscode']);
  assert.deepEqual(detectIDEHosts({ TERM_PROGRAM: 'xterm-256color' }, ['OpenAI.chatgpt']), []);
});

test('project host detection recognizes Antigravity plugin metadata', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const pluginRoot = path.join(paths.project, '.agents/plugins/overdrive');
  await mkdir(pluginRoot, { recursive: true });
  await writeFile(path.join(pluginRoot, 'plugin.json'), JSON.stringify({
    '$schema': 'https://antigravity.google/schemas/v1/plugin.json',
  }));

  const hints = await detectHosts(paths.project);

  assert.deepEqual(hints.map(({ id }) => id), ['antigravity']);
});

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'overdrive-installer-'));
  const skillsRoot = path.join(root, 'source-skills');
  const project = path.join(root, 'project');
  const home = path.join(root, 'home');
  for (const folder of ['assert', 'review', 'overdrive', 'continuity']) {
    const skill = path.join(skillsRoot, folder);
    await mkdir(path.join(skill, 'references'), { recursive: true });
    await writeFile(path.join(skill, 'SKILL.md'),
      `---\nname: ${folder}\ndescription: A test skill.\n---\n\nUse the test skill.\n`);
    await writeFile(path.join(skill, 'references', 'guide.md'), 'Supporting instructions.\n');
    await mkdir(path.join(skill, 'agents'), { recursive: true });
    await writeFile(path.join(skill, 'agents/openai.yaml'), 'interface:\n  display_name: Test\n');
    if (folder === 'continuity') {
      await mkdir(path.join(skill, 'assets'), { recursive: true });
      await writeFile(path.join(skill, 'assets/always-on.md'),
        'For substantial tasks, use Continuity. Verify `.overdrive/continuity/checkpoint.md` against current source.\n');
    }
  }
  await Promise.all([mkdir(project), mkdir(home)]);
  return { root, skillsRoot, project, home };
}

test('continuity installs host-native project guidance and preserves existing AGENTS instructions', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await writeFile(path.join(paths.project, 'AGENTS.md'), '# Project rules\nKeep existing instructions.\n');

  const plan = await prepareInstall({
    scope: 'project',
    hostIds: ['claude-code', 'codex', 'kiro', 'antigravity', 'grok'],
    skillNames: ['continuity'],
    cwd: paths.project,
    homeDir: paths.home,
    skillsRoot: paths.skillsRoot,
  });
  const result = await executeInstall(plan, { skillsRoot: paths.skillsRoot });

  assert.deepEqual(plan.registrations.filter(({ kind }) => kind === 'continuity-guidance')
    .map(({ destination }) => path.relative(paths.project, destination)).sort(), [
    '.agents/rules/overdrive-continuity.md',
    '.claude/rules/overdrive-continuity.md',
    '.kiro/steering/overdrive-continuity.md',
    'AGENTS.md',
  ]);
  assert.match(await readFile(path.join(paths.project, 'AGENTS.md'), 'utf8'), /Keep existing instructions/);
  assert.match(await readFile(path.join(paths.project, 'AGENTS.md'), 'utf8'), /overdrive-continuity:start/);
  assert.match(await readFile(path.join(paths.project, '.agents/rules/overdrive-continuity.md'), 'utf8'), /trigger: always_on/);
  assert.match(await readFile(path.join(paths.project, '.kiro/steering/overdrive-continuity.md'), 'utf8'), /inclusion: always/);
  assert.match(await readFile(path.join(paths.project, '.claude/rules/overdrive-continuity.md'), 'utf8'), /For substantial tasks/);
  assert.match(await readFile(path.join(paths.project, '.claude/rules/overdrive-continuity.md'), 'utf8'), /\.overdrive\/continuity\/checkpoint\.md/);
  assert.deepEqual(result.registrations.filter((destination) => [
    path.join(paths.project, 'AGENTS.md'),
    path.join(paths.project, '.claude/rules/overdrive-continuity.md'),
    path.join(paths.project, '.kiro/steering/overdrive-continuity.md'),
    path.join(paths.project, '.agents/rules/overdrive-continuity.md'),
  ].includes(destination)).sort(), [
    path.join(paths.project, 'AGENTS.md'),
    path.join(paths.project, '.agents/rules/overdrive-continuity.md'),
    path.join(paths.project, '.claude/rules/overdrive-continuity.md'),
    path.join(paths.project, '.kiro/steering/overdrive-continuity.md'),
  ].sort());
});

test('continuity global guidance uses selected host homes and reports Grok global limitation', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const codexHome = path.join(paths.root, 'codex-home');

  const plan = await prepareInstall({
    scope: 'global',
    hostIds: ['claude-code', 'codex', 'kiro', 'antigravity', 'grok'],
    skillNames: ['continuity'],
    cwd: paths.project,
    homeDir: paths.home,
    codexHome,
    skillsRoot: paths.skillsRoot,
    antigravitySurface: 'both',
  });

  assert.deepEqual(plan.registrations.filter(({ kind }) => kind === 'continuity-guidance')
    .map(({ destination }) => destination).sort(), [
    path.join(paths.home, '.claude/rules/overdrive-continuity.md'),
    path.join(paths.home, '.gemini/config/rules/overdrive-continuity.md'),
    path.join(paths.home, '.kiro/steering/overdrive-continuity.md'),
    path.join(codexHome, 'AGENTS.md'),
  ].sort());
  assert.deepEqual(plan.guidanceUnavailable.map(({ hostId }) => hostId), ['grok']);
});

test('continuity skips an existing host rule instead of overwriting it', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const existing = path.join(paths.project, '.claude/rules/overdrive-continuity.md');
  await mkdir(path.dirname(existing), { recursive: true });
  await writeFile(existing, 'User-owned rule.\n');

  const plan = await prepareInstall({
    scope: 'project', hostIds: ['claude-code'], skillNames: ['continuity'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.equal(plan.registrations.length, 0);
  assert.equal(plan.guidanceSkipped[0].destination, existing);
  const result = await executeInstall(plan, { skillsRoot: paths.skillsRoot });
  assert.equal(await readFile(existing, 'utf8'), 'User-owned rule.\n');
  assert.equal(result.guidanceSkipped.length, 1);
});

test('other skills do not install continuity steering guidance', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  const plan = await prepareInstall({
    scope: 'project', hostIds: ['kiro', 'antigravity'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.deepEqual(plan.registrations, []);
  assert.deepEqual(plan.guidanceSkipped, []);
});

test('continuity does not duplicate an existing managed AGENTS block', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const agentsPath = path.join(paths.project, 'AGENTS.md');
  await writeFile(agentsPath, '<!-- overdrive-continuity:start -->\nExisting managed guidance.\n<!-- overdrive-continuity:end -->\n');

  const plan = await prepareInstall({
    scope: 'project', hostIds: ['codex'], skillNames: ['continuity'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.equal(plan.registrations.some(({ kind }) => kind === 'continuity-guidance'), false);
  assert.equal(plan.guidanceSkipped[0].destination, agentsPath);
  assert.match(plan.guidanceSkipped[0].reason, /managed block already exists/);
});

test('continuity adds guidance only for the selected host', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  const plan = await prepareInstall({
    scope: 'project', hostIds: ['kiro'], skillNames: ['continuity'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });
  await executeInstall(plan, { skillsRoot: paths.skillsRoot });

  assert.deepEqual(plan.registrations.filter(({ kind }) => kind === 'continuity-guidance')
    .map(({ destination }) => path.relative(paths.project, destination)), [
    '.kiro/steering/overdrive-continuity.md',
  ]);
  await assert.rejects(readFile(path.join(paths.project, 'AGENTS.md')), { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(paths.project, '.claude/rules/overdrive-continuity.md')), { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(paths.project, '.agents/rules/overdrive-continuity.md')), { code: 'ENOENT' });
});

test('continuity rejects malformed managed AGENTS markers before installing', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const agentsPath = path.join(paths.project, 'AGENTS.md');
  await writeFile(agentsPath, 'Project rules.\n<!-- overdrive-continuity:start -->\n');

  await assert.rejects(prepareInstall({
    scope: 'project', hostIds: ['codex', 'grok'], skillNames: ['continuity'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  }), /incomplete or duplicate Overdrive Continuity markers/);
  assert.equal(await readFile(agentsPath, 'utf8'), 'Project rules.\n<!-- overdrive-continuity:start -->\n');
});

test('plugin installs contain only selected skills when the router is omitted', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  await installSkills({
    scope: 'project', hostIds: ['antigravity'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  const bundle = path.join(paths.project, '.agents/plugins/overdrive');
  assert.match(await readFile(path.join(bundle, 'skills/assert/SKILL.md'), 'utf8'), /name: assert/);
  await assert.rejects(readFile(path.join(bundle, 'skills/overdrive/SKILL.md')), { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(bundle, 'skills/review/SKILL.md')), { code: 'ENOENT' });
});

test('flat skill installs omit the router when it was not selected', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  await installSkills({
    scope: 'project', hostIds: ['kiro'], skillNames: ['review'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.match(await readFile(path.join(paths.project, '.kiro/skills/review/SKILL.md'), 'utf8'), /name: review/);
  await assert.rejects(readFile(path.join(paths.project, '.kiro/skills/overdrive/SKILL.md')), { code: 'ENOENT' });
});

test('selected router installs with a catalog of only selected domain skills', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  await installSkills({
    scope: 'project', hostIds: ['kiro'], skillNames: ['overdrive', 'review'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  const router = path.join(paths.project, '.kiro/skills/overdrive');
  assert.match(await readFile(path.join(router, 'SKILL.md'), 'utf8'), /name: overdrive/);
  const installed = await readFile(path.join(router, 'references/installed-skills.md'), 'utf8');
  assert.match(installed, /- review\n/);
  assert.doesNotMatch(installed, /- overdrive\n|- assert\n/);
});

test('the routing map covers every domain skill exactly once', async () => {
  const skillsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../skills');
  const packageNames = (await readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== 'overdrive')
    .map((entry) => entry.name)
    .sort();
  const routeMap = await readFile(path.join(skillsRoot, 'overdrive/references/skill-map.md'), 'utf8');
  const mappedNames = [...routeMap.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]).sort();

  assert.deepEqual(mappedNames, packageNames);
});

test('installs only the selected Claude Code host as a namespaced plugin bundle', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  const result = await installSkills({
    scope: 'project',
    hostIds: ['claude-code'],
    skillNames: ['review'],
    cwd: paths.project,
    homeDir: paths.home,
    skillsRoot: paths.skillsRoot,
  });

  const bundle = path.join(paths.project, '.claude/skills/overdrive');
  assert.equal(result.installed.length, 1);
  assert.deepEqual(JSON.parse(await readFile(path.join(bundle, '.claude-plugin/plugin.json'), 'utf8')),
    { name: 'overdrive', description: 'Adaptive engineering skills for software tasks.', version: '0.1.0' });
  assert.match(await readFile(path.join(bundle, 'skills/review/SKILL.md'), 'utf8'), /name: review/);
  assert.equal(await readFile(path.join(bundle, 'skills/review/references/guide.md'), 'utf8'), 'Supporting instructions.\n');
  await assert.rejects(readFile(path.join(paths.project, '.agents/plugins/overdrive/plugin.json')),
    { code: 'ENOENT' });
});

test('Codex installs a CLI plugin and flat IDE skills while preserving selected config', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await mkdir(path.join(paths.project, '.agents/plugins'), { recursive: true });
  await writeFile(path.join(paths.project, '.agents/plugins/marketplace.json'), JSON.stringify({
    name: 'local-repo', plugins: [{ name: 'existing', source: { source: 'local', path: './other' } }], metadata: { owner: 'user' },
  }, null, 2));
  await mkdir(path.join(paths.project, '.codex'), { recursive: true });
  await writeFile(path.join(paths.project, '.codex/config.toml'), 'model = "gpt-6"\n\n[features]\nplugins = true\n');

  await installSkills({
    scope: 'project', hostIds: ['codex'], skillNames: ['assert', 'review'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  const plugin = path.join(paths.project, '.codex/plugins/overdrive');
  const marketplace = JSON.parse(await readFile(path.join(paths.project, '.agents/plugins/marketplace.json'), 'utf8'));
  assert.equal(JSON.parse(await readFile(path.join(plugin, 'plugin.json'), 'utf8')).name, 'overdrive');
  assert.equal(await readFile(path.join(plugin, 'skills/review/references/guide.md'), 'utf8'), 'Supporting instructions.\n');
  assert.equal(marketplace.metadata.owner, 'user');
  assert.deepEqual(marketplace.plugins.map(({ name }) => name), ['existing', 'overdrive']);
  assert.match(await readFile(path.join(paths.project, '.codex/config.toml'), 'utf8'), /model = "gpt-6"/);
  assert.match(await readFile(path.join(paths.project, '.codex/config.toml'), 'utf8'), /\[plugins\."overdrive@local-repo"\]\s+enabled = true/);
  assert.match(await readFile(path.join(paths.project, '.agents/skills/review/SKILL.md'), 'utf8'), /name: review/);
  assert.match(await readFile(path.join(paths.project, '.agents/skills/review/agents/openai.yaml'), 'utf8'), /interface:/);
});

test('Codex global installation keeps custom CODEX_HOME marketplace sources inside their root', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const codexHome = path.join(paths.root, 'custom-codex-home');
  const marketplacePath = path.join(codexHome, '.agents/plugins/marketplace.json');
  await mkdir(path.dirname(marketplacePath), { recursive: true });
  await writeFile(marketplacePath, JSON.stringify({ name: 'custom-source', plugins: [] }, null, 2));

  const plan = await prepareInstall({
    scope: 'global', hostIds: ['codex'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, codexHome, skillsRoot: paths.skillsRoot,
  });
  const activations = [];
  const result = await executeInstall(plan, {
    skillsRoot: paths.skillsRoot,
    activateCodex: true,
    runCommand: (command, args, options) => {
      activations.push({ command, args, cwd: options.cwd });
      return { status: 0, stdout: '{}', stderr: '' };
    },
  });

  assert.equal(JSON.parse(await readFile(path.join(codexHome, 'plugins/overdrive/plugin.json'), 'utf8')).name,
    'overdrive');
  const config = await readFile(path.join(codexHome, 'config.toml'), 'utf8');
  assert.match(config, /\[marketplaces\.custom-source\]\s+source_type = "local"/);
  assert.match(config, new RegExp(`source = ${JSON.stringify(codexHome).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.match(config, /\[plugins\."overdrive@custom-source"\]\s+enabled = true/);
  const marketplace = JSON.parse(await readFile(marketplacePath, 'utf8'));
  assert.equal(marketplace.plugins[0].source.path, './plugins/overdrive');
  assert.deepEqual(activations, [
    { command: 'codex', args: ['plugin', 'marketplace', 'add', codexHome, '--json'], cwd: codexHome },
    { command: 'codex', args: ['plugin', 'add', 'overdrive@custom-source', '--json'], cwd: codexHome },
  ]);
  assert.equal(result.codexActivation.status, 'installed');
  assert.equal(plan.codexActivation.destination,
    path.join(codexHome, 'plugins/cache/custom-source/overdrive/0.1.0'));
  assert.equal(plan.codexActivation.marketplaceRoot, codexHome);
  assert.equal(plan.codexActivation.configPath, path.join(codexHome, 'config.toml'));
  await assert.rejects(readFile(path.join(paths.home, '.agents/plugins/marketplace.json')),
    { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(paths.home, '.codex/plugins/overdrive/plugin.json')),
    { code: 'ENOENT' });
});

test('Codex reports unavailable and failing CLI activation without hiding completed file writes', async (t) => {
  for (const expected of ['unavailable', 'failed']) {
    const paths = await fixture();
    t.after(() => rm(paths.root, { recursive: true, force: true }));
    const plan = await prepareInstall({
      scope: 'project', hostIds: ['codex'], skillNames: ['assert'],
      cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
    });
    const calls = [];
    const result = await executeInstall(plan, {
      skillsRoot: paths.skillsRoot,
      activateCodex: true,
      runCommand: (command, args) => {
        calls.push(args);
        if (expected === 'unavailable') return { status: null, error: { code: 'ENOENT', message: 'codex missing' } };
        return calls.length === 1
          ? { status: 0, stdout: '{}', stderr: '' }
          : { status: 1, stdout: '', stderr: 'plugin command unavailable' };
      },
    });
    assert.equal(result.codexActivation.status, expected);
    assert.deepEqual(calls, expected === 'unavailable'
      ? [['plugin', 'marketplace', 'add', paths.project, '--json']]
      : [
        ['plugin', 'marketplace', 'add', paths.project, '--json'],
        ['plugin', 'add', 'overdrive@local-repo', '--json'],
      ]);
    assert.match(result.codexActivation.command, /codex plugin marketplace add .*codex plugin add overdrive@local-repo/);
    assert.equal(await readFile(path.join(paths.project, '.codex/plugins/overdrive/plugin.json'), 'utf8')
      .then((json) => JSON.parse(json).name), 'overdrive');
  }
});

test('Codex merges a commented Overdrive table header instead of creating a duplicate TOML table', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await mkdir(path.join(paths.project, '.codex'), { recursive: true });
  await writeFile(path.join(paths.project, '.codex/config.toml'),
    '[plugins."overdrive@local-repo"] # keep this comment\nenabled = false # installer enables this\n');

  await installSkills({
    scope: 'project', hostIds: ['codex'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  const config = await readFile(path.join(paths.project, '.codex/config.toml'), 'utf8');
  assert.equal((config.match(/^\[plugins\."overdrive@local-repo"\]/gm) ?? []).length, 1);
  assert.match(config, /\[plugins\."overdrive@local-repo"\] # keep this comment\s+enabled = true # installer enables this/);
});

test('Codex installation activates the registered plugin after writing its files', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const plan = await prepareInstall({
    scope: 'project', hostIds: ['codex'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });
  const calls = [];
  const result = await executeInstall(plan, {
    skillsRoot: paths.skillsRoot,
    activateCodex: true,
    runCommand: (command, args, options) => {
      calls.push({ command, args, cwd: options.cwd });
      return { status: 0, stdout: '{"installedPath":"plugin-cache"}', stderr: '' };
    },
  });

  assert.deepEqual(calls, [
    { command: 'codex', args: ['plugin', 'marketplace', 'add', paths.project, '--json'], cwd: paths.project },
    { command: 'codex', args: ['plugin', 'add', 'overdrive@local-repo', '--json'], cwd: paths.project },
  ]);
  assert.equal(result.codexActivation.status, 'installed');
  assert.equal(plan.codexActivation.marketplaceRoot, paths.project);
  assert.equal(plan.codexActivation.configPath, path.join(paths.home, '.codex/config.toml'));
  assert.equal(await readFile(path.join(paths.project, '.codex/plugins/overdrive/plugin.json'), 'utf8'),
    `${JSON.stringify({
      '$schema': 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
      name: 'overdrive', version: '0.1.0', description: 'Adaptive engineering skills for software tasks.',
      author: { name: 'Hiroqt' },
    }, null, 2)}\n`);
});

test('Codex does not install a plugin when marketplace registration fails', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const plan = await prepareInstall({
    scope: 'project', hostIds: ['codex'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });
  const calls = [];
  const result = await executeInstall(plan, {
    skillsRoot: paths.skillsRoot,
    activateCodex: true,
    runCommand: (command, args) => {
      calls.push(args);
      return { status: 1, stdout: '', stderr: 'marketplace registration failed' };
    },
  });

  assert.deepEqual(calls, [['plugin', 'marketplace', 'add', paths.project, '--json']]);
  assert.equal(result.codexActivation.status, 'failed');
});

test('Codex rejects malformed registration before creating bundle or skill files', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await mkdir(path.join(paths.project, '.agents/plugins'), { recursive: true });
  await writeFile(path.join(paths.project, '.agents/plugins/marketplace.json'), '{broken');

  await assert.rejects(installSkills({
    scope: 'project', hostIds: ['codex'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  }), /marketplace\.json.*valid JSON/i);
  await assert.rejects(readFile(path.join(paths.project, '.codex/plugins/overdrive/plugin.json')),
    { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(paths.project, '.agents/skills/assert/SKILL.md')),
    { code: 'ENOENT' });
});

test('Codex rejects malformed Overdrive TOML registration before writing', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await mkdir(path.join(paths.project, '.codex'), { recursive: true });
  await writeFile(path.join(paths.project, '.codex/config.toml'), '[plugins."overdrive@local-repo"\nenabled = true\n');

  await assert.rejects(installSkills({
    scope: 'project', hostIds: ['codex'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  }), /malformed Overdrive plugin registration/i);
  await assert.rejects(readFile(path.join(paths.project, '.codex/plugins/overdrive/plugin.json')),
    { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(paths.project, '.agents/plugins/marketplace.json')),
    { code: 'ENOENT' });
});

test('Codex rejects a second Overdrive marketplace registration before writing', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await mkdir(path.join(paths.project, '.codex'), { recursive: true });
  await writeFile(path.join(paths.project, '.codex/config.toml'), '[plugins."overdrive@another-marketplace"]\nenabled = true\n');

  await assert.rejects(installSkills({
    scope: 'project', hostIds: ['codex'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  }), /already registers Overdrive with marketplace another-marketplace/i);
  await assert.rejects(readFile(path.join(paths.project, '.codex/plugins/overdrive/plugin.json')),
    { code: 'ENOENT' });
});

test('Kiro project installs flat skill folders and global scope installs one Power bundle', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await installSkills({
    scope: 'project', hostIds: ['kiro'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });
  await installSkills({
    scope: 'global', hostIds: ['kiro'], skillNames: ['review'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.match(await readFile(path.join(paths.project, '.kiro/skills/assert/SKILL.md'), 'utf8'), /name: assert/);
  assert.equal(await readFile(path.join(paths.home, '.kiro/powers/overdrive/skills/review/references/guide.md'), 'utf8'),
    'Supporting instructions.\n');
  await assert.rejects(readFile(path.join(paths.home, '.kiro/skills/review/SKILL.md')),
    { code: 'ENOENT' });
});

test('VS Code installs workspace skills in .github/skills and user skills in .copilot/skills', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  const projectPlan = await prepareInstall({
    scope: 'project', hostIds: ['vscode'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });
  const globalPlan = await prepareInstall({
    scope: 'global', hostIds: ['vscode'], skillNames: ['review'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.deepEqual(projectPlan.flatSkills.map(({ destination }) => destination), [
    path.join(paths.project, '.github/skills/assert'),
  ]);
  assert.deepEqual(globalPlan.flatSkills.map(({ destination }) => destination), [
    path.join(paths.home, '.copilot/skills/review'),
  ]);
});

test('Antigravity global surface selection targets only the requested plugin root', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  await installSkills({
    scope: 'global', hostIds: ['antigravity'], antigravitySurface: 'ide', skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.deepEqual(JSON.parse(await readFile(path.join(paths.home, '.gemini/config/plugins/overdrive/plugin.json'), 'utf8')),
    {
      '$schema': 'https://antigravity.google/schemas/v1/plugin.json',
      name: 'overdrive',
      description: 'Adaptive engineering skills for software tasks.',
    });
  await assert.rejects(readFile(path.join(paths.home, '.gemini/config/plugins/overdrive/skills/assert/agents/openai.yaml')),
    { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(paths.home, '.gemini/antigravity-cli/plugins/overdrive/plugin.json')),
    { code: 'ENOENT' });
});

test('Grok installs a Claude-compatible plugin bundle without Codex-only metadata', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));

  await installSkills({
    scope: 'project', hostIds: ['grok'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  const bundle = path.join(paths.project, '.grok/plugins/overdrive');
  assert.deepEqual(JSON.parse(await readFile(path.join(bundle, '.claude-plugin/plugin.json'), 'utf8')),
    { name: 'overdrive', description: 'Adaptive engineering skills for software tasks.', version: '0.1.0' });
  assert.match(await readFile(path.join(bundle, 'skills/assert/SKILL.md'), 'utf8'), /name: assert/);
  await assert.rejects(readFile(path.join(bundle, 'skills/assert/agents/openai.yaml')),
    { code: 'ENOENT' });
});

test('existing grouped bundles are skipped as a unit without merging', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const bundle = path.join(paths.project, '.agents/plugins/overdrive');
  await mkdir(bundle, { recursive: true });
  await writeFile(path.join(bundle, 'owner.txt'), 'user data\n');

  const result = await installSkills({
    scope: 'project', hostIds: ['antigravity'], skillNames: ['assert'],
    cwd: paths.project, homeDir: paths.home, skillsRoot: paths.skillsRoot,
  });

  assert.equal(result.installed.length, 0);
  assert.equal(result.skipped.length, 1);
  assert.equal(await readFile(path.join(bundle, 'owner.txt'), 'utf8'), 'user data\n');
  await assert.rejects(readFile(path.join(bundle, 'skills/assert/SKILL.md')),
    { code: 'ENOENT' });
});

test('CLI requires an explicit host and installs only the requested Antigravity skill after preview', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const run = spawnSync(process.execPath, [CLI, 'install', '--host', 'antigravity'], {
    cwd: paths.project,
    input: '\nassert\ny\n',
    encoding: 'utf8',
    env: { ...process.env, HOME: paths.home, USERPROFILE: paths.home },
  });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Hosts: antigravity/);
  assert.match(run.stdout, /\.agents\/plugins\/overdrive/);
  assert.match(run.stdout, /Existing bundle destinations are skipped whole/);
  assert.match(await readFile(path.join(paths.project, '.agents/plugins/overdrive/skills/assert/SKILL.md'), 'utf8'), /name: assert/);
  await assert.rejects(readFile(path.join(paths.project, '.claude/skills/overdrive/.claude-plugin/plugin.json')),
    { code: 'ENOENT' });
});

test('interactive install suggests hosts from project markers and requires confirmation', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  await Promise.all([
    mkdir(path.join(paths.project, '.claude')),
    mkdir(path.join(paths.project, '.kiro')),
  ]);
  const run = spawnSync(process.execPath, [CLI, 'install', '--skill', 'assert'], {
    cwd: paths.project,
    input: '\n\ny\n',
    encoding: 'utf8',
    env: {
      ...process.env, HOME: paths.home, USERPROFILE: paths.home, NO_COLOR: '1',
      TERM_PROGRAM: 'xterm-256color', VSCODE_PID: '', VSCODE_IPC_HOOK_CLI: '',
    },
  });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Detected project host hints: claude-code, kiro/);
  assert.match(run.stdout, /press Enter to accept detected hosts/);
  assert.match(run.stdout, /Hosts: claude-code, kiro/);
  assert.match(run.stdout, /\.claude\/skills\/overdrive/);
  assert.match(run.stdout, /\.kiro\/skills\/assert/);
  assert.doesNotMatch(run.stdout, /\u001b\[/);
});

test('interactive global install detects Antigravity and installs only the chosen surface', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const pluginRoot = path.join(paths.project, '.agents/plugins/overdrive');
  await mkdir(pluginRoot, { recursive: true });
  await writeFile(path.join(pluginRoot, 'plugin.json'), JSON.stringify({
    '$schema': 'https://antigravity.google/schemas/v1/plugin.json',
  }));
  const run = spawnSync(process.execPath, [CLI, 'install', '--skill', 'assert'], {
    cwd: paths.project,
    input: '2\ncli\ny\n',
    encoding: 'utf8',
    env: {
      ...process.env, HOME: paths.home, USERPROFILE: paths.home, NO_COLOR: '1',
      TERM_PROGRAM: 'xterm-256color', VSCODE_PID: '', VSCODE_IPC_HOOK_CLI: '',
    },
  });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Install scope:.*Global/);
  assert.match(run.stdout, /Detected project host hints: antigravity/);
  assert.doesNotMatch(run.stdout, /Choose host\(s\):/);
  assert.match(run.stdout, /Scope: global/);
  assert.match(run.stdout, /Antigravity surface: cli/);
  assert.match(await readFile(path.join(paths.home, '.gemini/antigravity-cli/plugins/overdrive/skills/assert/SKILL.md'), 'utf8'), /name: assert/);
  await assert.rejects(readFile(path.join(paths.home, '.gemini/config/plugins/overdrive/plugin.json')),
    { code: 'ENOENT' });
});

test('interactive VS Code install detects the IDE and skips the host picker', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const projectRun = spawnSync(process.execPath, [CLI, 'install', '--skill', 'assert'], {
    cwd: paths.project,
    input: '1\ny\n',
    encoding: 'utf8',
    env: {
      ...process.env, HOME: paths.home, USERPROFILE: paths.home,
      TERM_PROGRAM: 'vscode', NO_COLOR: '1', PATH: paths.home,
    },
  });

  assert.equal(projectRun.status, 0, projectRun.stderr);
  assert.match(projectRun.stdout, /This project \(Visual Studio Code workspace\)/);
  assert.match(projectRun.stdout, /Detected IDE: Visual Studio Code/);
  assert.match(projectRun.stdout, /Scope: project \(Visual Studio Code workspace:/);
  assert.doesNotMatch(projectRun.stdout, /Choose host\(s\):/);
  assert.match(projectRun.stdout, /Hosts: vscode/);
  assert.match(await readFile(path.join(paths.project, '.github/skills/assert/SKILL.md'), 'utf8'), /name: assert/);

  const globalRun = spawnSync(process.execPath, [CLI, 'install', '--scope', 'global', '--skill', 'review'], {
    cwd: paths.project,
    input: 'y\n',
    encoding: 'utf8',
    env: {
      ...process.env, HOME: paths.home, USERPROFILE: paths.home,
      TERM_PROGRAM: 'vscode', NO_COLOR: '1', PATH: paths.home,
    },
  });

  assert.equal(globalRun.status, 0, globalRun.stderr);
  assert.doesNotMatch(globalRun.stdout, /Choose host\(s\):/);
  assert.match(globalRun.stdout, /Scope: global \(Visual Studio Code user skills:/);
  assert.match(globalRun.stdout, /Hosts: vscode/);
  assert.match(await readFile(path.join(paths.home, '.copilot/skills/review/SKILL.md'), 'utf8'), /name: review/);
});

test('global Grok continuity install reports that always-on guidance is unavailable', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const run = spawnSync(process.execPath, [CLI, 'install', '--scope', 'global', '--host', 'grok', '--skill', 'continuity'], {
    cwd: paths.project,
    input: 'y\n',
    encoding: 'utf8',
    env: { ...process.env, HOME: paths.home, USERPROFILE: paths.home, NO_COLOR: '1' },
  });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /grok always-on guidance unavailable/);
  assert.match(await readFile(path.join(paths.home, '.grok/plugins/overdrive/skills/continuity/SKILL.md'), 'utf8'), /name: continuity/);
  await assert.rejects(readFile(path.join(paths.home, 'AGENTS.md')), { code: 'ENOENT' });
});

test('interactive host selection cannot default to every host', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const run = spawnSync(process.execPath, [CLI, 'install', '--scope', 'project', '--skill', 'assert'], {
    cwd: paths.project,
    input: '\nantigravity\ny\n',
    encoding: 'utf8',
    env: {
      ...process.env, HOME: paths.home, USERPROFILE: paths.home,
      TERM_PROGRAM: 'xterm-256color', VSCODE_PID: '', VSCODE_IPC_HOOK_CLI: '',
    },
  });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Choose host\(s\):/);
  assert.match(run.stdout, /Hosts: antigravity/);
  await assert.rejects(readFile(path.join(paths.project, '.claude/skills/overdrive/.claude-plugin/plugin.json')),
    { code: 'ENOENT' });
});

test('interactive skill picker defaults to all skills including the optional router', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const run = spawnSync(process.execPath, [CLI, 'install', '--host', 'kiro'], {
    cwd: paths.project,
    input: '\n\ny\n',
    encoding: 'utf8',
    env: { ...process.env, HOME: paths.home, USERPROFILE: paths.home, NO_COLOR: '1' },
  });

  assert.equal(run.status, 0, run.stderr);
  const skillNames = ['assert', 'continuity', 'forge', 'guard', 'overdrive', 'prune', 'refactor', 'render', 'review', 'signal', 'trace', 'verify'];
  assert.ok(run.stdout.includes(`Skills: ${skillNames.join(', ')}`));
  assert.match(run.stdout, /Router: selected/);
  for (const skill of skillNames) {
    assert.match(await readFile(path.join(paths.project, `.kiro/skills/${skill}/SKILL.md`), 'utf8'), /name:/);
  }
});

test('declining a continuity preview creates no bundle or guidance files', async (t) => {
  const paths = await fixture();
  t.after(() => rm(paths.root, { recursive: true, force: true }));
  const run = spawnSync(process.execPath, [CLI, 'install', '--host', 'codex', '--skill', 'continuity'], {
    cwd: paths.project,
    input: '\nn\n',
    encoding: 'utf8',
    env: { ...process.env, HOME: paths.home, USERPROFILE: paths.home },
  });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Installation cancelled/);
  assert.match(run.stdout, /register\/merge .*AGENTS\.md/);
  for (const target of [
    '.codex/plugins/overdrive/plugin.json', '.agents/plugins/marketplace.json',
    '.agents/skills/continuity/SKILL.md', '.codex/config.toml', 'AGENTS.md',
  ]) {
    await assert.rejects(readFile(path.join(paths.project, target)), { code: 'ENOENT' });
  }
});
