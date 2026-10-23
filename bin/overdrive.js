#!/usr/bin/env node

import { cp, lstat, mkdir, readFile, readdir, rmdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_ROOT = path.join(PACKAGE_ROOT, 'skills');
const PACKAGE_VERSION = '0.1.0';
const PACKAGE_NAME = 'overdrive';
const ROUTER_SKILL = 'overdrive';
const MARKETPLACE_NAME = 'local-repo';
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BANNER_COLORS = ['38;5;51', '38;5;45', '38;5;81', '38;5;117', '38;5;141', '38;5;213'];

export const HOSTS = [
  { id: 'vscode', label: 'Visual Studio Code (GitHub Copilot)' },
  { id: 'claude-code', label: 'Claude Code (IDE + CLI)' },
  { id: 'codex', label: 'OpenAI Codex (IDE + CLI)' },
  { id: 'kiro', label: 'Kiro (IDE + CLI)' },
  { id: 'antigravity', label: 'Google Antigravity (IDE + CLI)' },
  { id: 'grok', label: 'Grok Build CLI' },
];

const HOST_IDS = new Set(HOSTS.map(({ id }) => id));

function isVSCodeTerminal(env) {
  return env.TERM_PROGRAM?.toLowerCase() === 'vscode' || Boolean(env.VSCODE_PID || env.VSCODE_IPC_HOOK_CLI);
}

function installedVSCodeExtensions(env) {
  const result = spawnSync('code --list-extensions', {
    encoding: 'utf8',
    env,
    shell: true,
    timeout: 1500,
    windowsHide: true,
  });
  if (result.error || result.status !== 0) return [];
  return result.stdout.split(/\r?\n/).map((id) => id.trim().toLowerCase()).filter(Boolean);
}

export function detectIDEHosts(env = process.env, extensionIds) {
  if (!isVSCodeTerminal(env)) return [];
  const extensions = (extensionIds ?? installedVSCodeExtensions(env)).map((id) => id.toLowerCase());
  const detected = new Set();
  for (const id of extensions) {
    if (id === 'openai.chatgpt') detected.add('codex');
    if (id === 'anthropic.claude-code') detected.add('claude-code');
    if (id === 'github.copilot' || id === 'github.copilot-chat') detected.add('vscode');
  }
  return detected.size ? [...detected] : ['vscode'];
}

function pluginManifest() {
  return {
    '$schema': 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
    name: PACKAGE_NAME,
    version: PACKAGE_VERSION,
    description: 'Adaptive engineering skills for software tasks.',
    author: { name: 'Hiroqt' },
  };
}

function antigravityManifest() {
  return {
    '$schema': 'https://antigravity.google/schemas/v1/plugin.json',
    name: PACKAGE_NAME,
    description: 'Adaptive engineering skills for software tasks.',
  };
}

function claudeCompatibleManifest() {
  return {
    name: PACKAGE_NAME,
    description: 'Adaptive engineering skills for software tasks.',
    version: PACKAGE_VERSION,
  };
}

function kiroPowerManifest() {
  return {
    ...pluginManifest(),
    author: { name: 'Hiroqt' },
    keywords: ['software', 'code', 'developer', 'repository', 'engineering', 'review', 'testing', 'security', 'frontend'],
  };
}

async function availableSkills(skillsRoot) {
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const names = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !NAME_PATTERN.test(entry.name)) continue;
    try {
      const info = await lstat(path.join(skillsRoot, entry.name, 'SKILL.md'));
      if (info.isFile()) names.push(entry.name);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return names.sort();
}

async function pathType(target) {
  try {
    const info = await lstat(target);
    if (info.isDirectory()) return 'directory';
    if (info.isFile()) return 'file';
    return null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export async function detectHosts(projectRoot) {
  const hints = new Map();
  const add = (id, reason) => {
    if (!hints.has(id)) hints.set(id, reason);
  };
  const directoryMarkers = [
    ['vscode', '.github/skills/'],
    ['claude-code', '.claude/'],
    ['codex', '.codex/'],
    ['codex', '.agents/skills/'],
    ['codex', '.agents/plugins/marketplace.json'],
    ['kiro', '.kiro/'],
    ['grok', '.grok/'],
  ];

  for (const [id, relative] of directoryMarkers) {
    const type = await pathType(path.join(projectRoot, relative));
    if (type && (relative.endsWith('/') ? type === 'directory' : type === 'file')) add(id, relative);
  }

  const pluginsRoot = path.join(projectRoot, '.agents/plugins');
  if (await pathType(pluginsRoot) === 'directory') {
    const entries = await readdir(pluginsRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const manifestPath = path.join(pluginsRoot, entry.name, 'plugin.json');
      if (await pathType(manifestPath) !== 'file') continue;
      try {
        const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
        if (typeof manifest.$schema === 'string' && manifest.$schema.startsWith('https://antigravity.google/schemas/')) {
          add('antigravity', `.agents/plugins/${entry.name}/plugin.json`);
          break;
        }
      } catch {
        // Ignore malformed plugin metadata; detection is advisory and must not block installation.
      }
    }
  }

  return HOSTS.filter(({ id }) => hints.has(id)).map(({ id }) => ({ id, reason: hints.get(id) }));
}

export async function showBanner(stream = process.stdout, { color, delayMs = 45, env = process.env } = {}) {
  const useColor = color ?? Boolean(stream.isTTY && !('NO_COLOR' in env) && env.TERM !== 'dumb');
  const wordmark = 'HIROQT';
  for (let index = 0; index < wordmark.length; index += 1) {
    const character = wordmark[index];
    stream.write(useColor ? `\u001b[${BANNER_COLORS[index]}m${character}\u001b[0m` : character);
    if (useColor && delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  stream.write('\nOVERDRIVE SKILLS INSTALLER\n\n');
}

function addBundle(bundles, destination, manifestPath, manifest, hostId, safetyRoot) {
  const current = bundles.get(destination);
  if (current) {
    if (current.manifestPath !== manifestPath || JSON.stringify(current.manifest) !== JSON.stringify(manifest)) {
      throw new Error(`Selected hosts require incompatible bundles at ${destination}. Install them separately.`);
    }
    current.hostIds.push(hostId);
    return;
  }
  bundles.set(destination, { destination, manifestPath, manifest, hostIds: [hostId], safetyRoot });
}

function addFlatSkill(flatSkills, root, skillName, hostId) {
  const destination = path.join(root, skillName);
  const current = flatSkills.get(destination);
  if (current) current.hostIds.push(hostId);
  else flatSkills.set(destination, { destination, skillName, hostIds: [hostId] });
}

function projectTargets({ hostIds, skillNames, base, scope, antigravitySurface, codexRoot }) {
  const bundles = new Map();
  const flatSkills = new Map();
  let codexSelected = false;

  for (const hostId of hostIds) {
    if (hostId === 'vscode') {
      const skillRoot = scope === 'project' ? path.join(base, '.github/skills') : path.join(base, '.copilot/skills');
      for (const skillName of skillNames) addFlatSkill(flatSkills, skillRoot, skillName, hostId);
    } else if (hostId === 'claude-code') {
      addBundle(
        bundles,
        path.join(base, '.claude/skills/overdrive'),
        '.claude-plugin/plugin.json',
        claudeCompatibleManifest(),
        hostId,
      );
    } else if (hostId === 'codex') {
      codexSelected = true;
      addBundle(bundles, path.join(codexRoot, 'plugins/overdrive'), 'plugin.json', pluginManifest(), hostId, codexRoot);
      for (const skillName of skillNames) addFlatSkill(flatSkills, path.join(base, '.agents/skills'), skillName, hostId);
    } else if (hostId === 'kiro' && scope === 'project') {
      for (const skillName of skillNames) addFlatSkill(flatSkills, path.join(base, '.kiro/skills'), skillName, hostId);
    } else if (hostId === 'kiro') {
      addBundle(bundles, path.join(base, '.kiro/powers/overdrive'), 'plugin.json', kiroPowerManifest(), hostId);
    } else if (hostId === 'antigravity') {
      if (scope === 'project') {
        addBundle(bundles, path.join(base, '.agents/plugins/overdrive'), 'plugin.json', antigravityManifest(), hostId);
      } else {
        const surfaces = antigravitySurface === 'both' ? ['ide', 'cli'] : [antigravitySurface];
        for (const surface of surfaces) {
          const relative = surface === 'ide'
            ? '.gemini/config/plugins/overdrive'
            : '.gemini/antigravity-cli/plugins/overdrive';
          addBundle(bundles, path.join(base, relative), 'plugin.json', antigravityManifest(), hostId);
        }
      }
    } else if (hostId === 'grok') {
      addBundle(bundles, path.join(base, '.grok/plugins/overdrive'), '.claude-plugin/plugin.json', claudeCompatibleManifest(), hostId);
    }
  }

  return { bundles: [...bundles.values()], flatSkills: [...flatSkills.values()], codexSelected };
}

function assertWithin(base, destination) {
  const relative = path.relative(base, destination);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
    throw new Error(`Install destination must be inside the selected root: ${destination}`);
  }
}

async function assertNoSymlinkComponents(base, destination) {
  assertWithin(base, destination);
  const relative = path.relative(base, destination);
  let current = base;
  for (const segment of relative.split(path.sep)) {
    current = path.join(current, segment);
    try {
      const info = await lstat(current);
      if (info.isSymbolicLink()) throw new Error(`Refusing to write through symbolic link: ${current}`);
      if (!info.isDirectory() && current !== destination) throw new Error(`Install path component is not a directory: ${current}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      break;
    }
  }
}

async function rejectSymlinks(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const source = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Skill package contains a symbolic link: ${source}`);
    if (entry.isDirectory()) await rejectSymlinks(source);
    else if (!entry.isFile()) throw new Error(`Skill package contains an unsupported file: ${source}`);
  }
}

async function destinationExists(destination) {
  try {
    await lstat(destination);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function readOptional(destination) {
  return await destinationExists(destination) ? readFile(destination, 'utf8') : null;
}

function mergeMarketplace(text, pluginPath) {
  let marketplace;
  if (text === null) marketplace = { name: MARKETPLACE_NAME, plugins: [] };
  else {
    try {
      marketplace = JSON.parse(text);
    } catch (error) {
      throw new Error(`Codex marketplace.json must contain valid JSON before Overdrive can register: ${error.message}`);
    }
  }
  if (!marketplace || typeof marketplace !== 'object' || Array.isArray(marketplace)) {
    throw new Error('Codex marketplace.json must be a JSON object.');
  }
  if (typeof marketplace.name !== 'string' || !marketplace.name.trim()) {
    throw new Error('Codex marketplace.json must contain a non-empty name.');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(marketplace.name)) {
    throw new Error('Codex marketplace.json name must contain only letters, numbers, hyphens, or underscores.');
  }
  if (marketplace.plugins === undefined) marketplace.plugins = [];
  if (!Array.isArray(marketplace.plugins)) throw new Error('Codex marketplace.json plugins must be an array.');

  const existing = marketplace.plugins.find((plugin) => plugin?.name === PACKAGE_NAME);
  if (existing) {
    if (existing.source?.source !== 'local' || existing.source?.path !== pluginPath) {
      throw new Error(`Codex marketplace already defines ${PACKAGE_NAME} with a different source; resolve the conflict before installing.`);
    }
  } else {
    marketplace.plugins.push({
      name: PACKAGE_NAME,
      source: { source: 'local', path: pluginPath },
      policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
      category: 'Productivity',
    });
  }
  return { text: `${JSON.stringify(marketplace, null, 2)}\n`, marketplaceName: marketplace.name };
}

function mergeCodexMarketplaceConfig(lines, marketplaceName, marketplaceRoot) {
  const section = `[marketplaces.${marketplaceName}]`;
  const expectedSource = JSON.stringify(marketplaceRoot);
  const starts = [];
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed.startsWith('[marketplaces.')) continue;
    const match = /^\[marketplaces\.(?:"([^"]+)"|([a-zA-Z0-9_-]+))\]\s*(?:#.*)?$/.exec(trimmed);
    if (!match) {
      const prefix = `[marketplaces.${marketplaceName}`;
      const next = trimmed[prefix.length];
      if (trimmed.startsWith(prefix) && [undefined, ']', '#', ' ', '\t'].includes(next)) {
        throw new Error(`Codex config.toml contains a malformed ${section} marketplace table near line ${index + 1}.`);
      }
      continue;
    }
    if ((match[1] ?? match[2]) === marketplaceName) starts.push(index);
  }
  if (starts.length > 1) throw new Error(`Codex config.toml contains duplicate ${section} tables.`);
  if (starts.length === 0) {
    while (lines.at(-1) === '') lines.pop();
    if (lines.length) lines.push('');
    lines.push(section, 'source_type = "local"', `source = ${expectedSource}`);
    return true;
  }

  const start = starts[0];
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^\s*\[{1,2}[^\]]+\]{1,2}\s*(?:#.*)?$/.test(lines[index])) {
      end = index;
      break;
    }
  }
  let changed = false;
  for (const [key, expectedValue] of [['source_type', '"local"'], ['source', expectedSource]]) {
    const values = [];
    const keyPattern = new RegExp(`^\\s*${key}\\s*=`);
    const expectedPattern = new RegExp(`^(\\s*${key}\\s*=\\s*)${expectedValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*(?:#.*)?)$`);
    for (let index = start + 1; index < end; index += 1) {
      if (!keyPattern.test(lines[index])) continue;
      const match = expectedPattern.exec(lines[index]);
      if (!match) throw new Error(`Codex config.toml already has a different or invalid ${key} value in ${section}.`);
      values.push(index);
    }
    if (values.length > 1) throw new Error(`Codex config.toml contains duplicate ${key} keys in ${section}.`);
    if (values.length === 0) {
      lines.splice(end, 0, `${key} = ${expectedValue}`);
      end += 1;
      changed = true;
    }
  }
  return changed;
}

function mergeCodexConfig(text, marketplaceName, marketplaceRoot = null) {
  const section = `[plugins."overdrive@${marketplaceName}"]`;
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  let changed = marketplaceRoot
    ? mergeCodexMarketplaceConfig(lines, marketplaceName, marketplaceRoot)
    : false;
  const starts = [];
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed.startsWith('[plugins."overdrive@')) {
      const match = /^\[plugins\."overdrive@([^"\]]+)"\]\s*(?:#.*)?$/.exec(trimmed);
      if (!match) throw new Error(`Codex config.toml contains a malformed Overdrive plugin registration near line ${index + 1}.`);
      if (match[1] !== marketplaceName) {
        throw new Error(`Codex config.toml already registers Overdrive with marketplace ${match[1]}; resolve the conflict before installing.`);
      }
      starts.push(index);
    }
  }
  if (starts.length > 1) throw new Error(`Codex config.toml contains duplicate ${section} tables.`);
  if (starts.length === 1) {
    const start = starts[0];
    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
      if (/^\s*\[{1,2}[^\]]+\]{1,2}\s*(?:#.*)?$/.test(lines[index])) {
        end = index;
        break;
      }
    }
    const enabled = [];
    for (let index = start + 1; index < end; index += 1) {
      const match = /^(\s*enabled\s*=\s*)(true|false)(\s*(?:#.*)?)$/.exec(lines[index]);
      if (match) enabled.push({ index, value: match[2], prefix: match[1], suffix: match[3] });
      else if (/^\s*enabled\s*=/.test(lines[index])) {
        throw new Error(`Codex config.toml has an invalid enabled value in ${section}.`);
      }
    }
    if (enabled.length > 1) throw new Error(`Codex config.toml contains duplicate enabled keys in ${section}.`);
    if (enabled.length === 1) {
      if (enabled[0].value === 'true') {
        return changed ? `${lines.join(newline).replace(/\n*$/, '').replace(/\r*$/, '')}${newline}` : text;
      }
      lines[enabled[0].index] = `${enabled[0].prefix}true${enabled[0].suffix}`;
    } else {
      lines.splice(start + 1, 0, 'enabled = true');
    }
    return `${lines.join(newline).replace(/\n*$/, '').replace(/\r*$/, '')}${newline}`;
  }
  while (lines.at(-1) === '') lines.pop();
  const body = lines.join(newline).replace(/(?:\r?\n)*$/, '');
  return `${body}${body ? `${newline}${newline}` : ''}${section}${newline}enabled = true${newline}`;
}

async function prepareCodexRegistration(base, codexRoot, bundleWillInstall, pluginDestination) {
  if (!bundleWillInstall) return { registrations: [], marketplaceName: null, marketplaceRoot: null };
  const relativeCodexRoot = path.relative(base, codexRoot);
  const usesPersonalMarketplace = relativeCodexRoot === ''
    || (!relativeCodexRoot.startsWith(`..${path.sep}`) && relativeCodexRoot !== '..' && !path.isAbsolute(relativeCodexRoot));
  const marketplaceRoot = usesPersonalMarketplace ? base : codexRoot;
  const relativePluginPath = path.relative(marketplaceRoot, pluginDestination).split(path.sep).join('/');
  const pluginPath = relativePluginPath.startsWith('./') ? relativePluginPath : `./${relativePluginPath}`;
  const marketplacePath = path.join(marketplaceRoot, '.agents/plugins/marketplace.json');
  const configPath = path.join(codexRoot, 'config.toml');
  await Promise.all([
    assertNoSymlinkComponents(marketplaceRoot, marketplacePath),
    assertNoSymlinkComponents(codexRoot, configPath),
  ]);
  const [marketplaceText, configText] = await Promise.all([
    readOptional(marketplacePath),
    readOptional(configPath),
  ]);
  const marketplace = mergeMarketplace(marketplaceText, pluginPath);
  const config = mergeCodexConfig(configText ?? '', marketplace.marketplaceName,
    usesPersonalMarketplace ? null : marketplaceRoot);
  return {
    marketplaceName: marketplace.marketplaceName,
    marketplaceRoot,
    registrations: [
      { destination: marketplacePath, original: marketplaceText, text: marketplace.text },
      { destination: configPath, original: configText, text: config },
    ],
  };
}

function mergeContinuityGuidance(original, guidance) {
  const start = '<!-- overdrive-continuity:start -->';
  const end = '<!-- overdrive-continuity:end -->';
  const starts = original.split(start).length - 1;
  const ends = original.split(end).length - 1;
  if (starts || ends) {
    if (starts !== 1 || ends !== 1 || original.indexOf(start) > original.indexOf(end)) {
      throw new Error('AGENTS.md has incomplete or duplicate Overdrive Continuity markers; resolve them before installing.');
    }
    return null;
  }

  const block = `${start}\n${guidance.trim()}\n${end}`;
  const separator = original ? (original.endsWith('\n\n') ? '' : original.endsWith('\n') ? '\n' : '\n\n') : '';
  return `${original}${separator}${block}\n`;
}

async function prepareContinuityGuidance({ scope, hostIds, base, codexRoot, skillsRoot, skillNames }) {
  const registrations = [];
  const guidanceSkipped = [];
  const guidanceUnavailable = [];
  if (!skillNames.includes('continuity')) return { registrations, guidanceSkipped, guidanceUnavailable };

  const guidance = await readFile(path.join(skillsRoot, 'continuity/assets/always-on.md'), 'utf8');
  const targets = new Map();
  const add = (hostId, root, destination, format) => {
    const current = targets.get(destination);
    if (current) current.hostIds.push(hostId);
    else targets.set(destination, { hostIds: [hostId], root, destination, format });
  };

  for (const hostId of hostIds) {
    if (scope === 'global' && hostId === 'grok') {
      guidanceUnavailable.push({ hostId, reason: 'Grok documents project AGENTS.md guidance but no global always-loaded guidance path.' });
    } else if (hostId === 'codex' || hostId === 'grok') {
      const root = hostId === 'codex' && scope === 'global' ? codexRoot : base;
      add(hostId, root, path.join(root, 'AGENTS.md'), 'agents');
    } else {
      const relative = {
        'claude-code': '.claude/rules/overdrive-continuity.md',
        kiro: '.kiro/steering/overdrive-continuity.md',
        antigravity: scope === 'global'
          ? '.gemini/config/rules/overdrive-continuity.md'
          : '.agents/rules/overdrive-continuity.md',
      }[hostId];
      const root = base;
      add(hostId, root, path.join(root, relative), hostId);
    }
  }

  for (const target of targets.values()) {
    await assertNoSymlinkComponents(target.root, target.destination);
    const original = await readOptional(target.destination);
    let text;
    if (target.format === 'agents') {
      text = mergeContinuityGuidance(original ?? '', guidance);
      if (text === null) {
        guidanceSkipped.push({ destination: target.destination, reason: 'managed block already exists' });
        continue;
      }
    } else {
      if (original !== null) {
        guidanceSkipped.push({ destination: target.destination, reason: 'host rule already exists' });
        continue;
      }
      const metadata = target.format === 'kiro'
        ? 'inclusion: always'
        : target.format === 'antigravity'
          ? 'trigger: always_on\ndescription: Keep long coding sessions oriented through verified project context.'
          : null;
      text = metadata ? `---\n${metadata}\n---\n\n${guidance.trim()}\n` : guidance;
    }
    registrations.push({ destination: target.destination, original, text, kind: 'continuity-guidance', hostIds: target.hostIds });
  }

  return { registrations, guidanceSkipped, guidanceUnavailable };
}

export async function prepareInstall({
  scope,
  hostIds,
  skillNames,
  cwd,
  homeDir,
  codexHome,
  skillsRoot = SKILLS_ROOT,
  antigravitySurface,
}) {
  if (!['project', 'global'].includes(scope)) throw new Error(`Unknown install scope: ${scope}`);
  if (!Array.isArray(hostIds) || hostIds.length === 0) throw new Error('Select at least one host.');
  if (hostIds.some((id) => !HOST_IDS.has(id))) throw new Error(`Unknown host: ${hostIds.find((id) => !HOST_IDS.has(id))}`);
  if (new Set(hostIds).size !== hostIds.length) throw new Error('Select each host only once.');
  if (!Array.isArray(skillNames) || skillNames.length === 0) throw new Error('Select at least one skill.');
  if (new Set(skillNames).size !== skillNames.length) throw new Error('Select each skill only once.');
  if (hostIds.includes('antigravity') && scope === 'global' && !['ide', 'cli', 'both'].includes(antigravitySurface)) {
    throw new Error('Choose Antigravity global surface: ide, cli, or both.');
  }
  if (antigravitySurface && (!hostIds.includes('antigravity') || scope !== 'global')) {
    throw new Error('--surface applies only to global Antigravity installs.');
  }

  const base = path.resolve(scope === 'project' ? cwd : homeDir);
  const codexHomeRoot = path.resolve(codexHome ?? path.join(homeDir, '.codex'));
  const codexRoot = scope === 'project' ? path.join(base, '.codex') : codexHomeRoot;
  const available = await availableSkills(skillsRoot);
  for (const skillName of skillNames) {
    if (!available.includes(skillName)) throw new Error(`Unknown skill: ${skillName}`);
    await rejectSymlinks(path.join(skillsRoot, skillName));
  }
  const domainSkillNames = skillNames.filter((name) => name !== ROUTER_SKILL);

  const targets = projectTargets({
    hostIds,
    skillNames,
    base,
    scope,
    antigravitySurface,
    codexRoot,
  });
  for (const target of [...targets.bundles, ...targets.flatSkills]) {
    await assertNoSymlinkComponents(target.safetyRoot ?? base, target.destination);
  }
  for (const bundle of targets.bundles) bundle.skip = await destinationExists(bundle.destination);
  for (const skill of targets.flatSkills) skill.skip = await destinationExists(skill.destination);

  const codexBundle = targets.bundles.find(({ hostIds: bundleHosts }) => bundleHosts.includes('codex'));
  const codexRegistration = targets.codexSelected
    ? await prepareCodexRegistration(base, codexRoot, codexBundle && !codexBundle.skip, codexBundle?.destination)
    : { registrations: [], marketplaceName: null };
  const continuityGuidance = await prepareContinuityGuidance({
    scope, hostIds, base, codexRoot, skillsRoot, skillNames,
  });
  const codexActivation = codexRegistration.marketplaceName
    ? {
      marketplaceName: codexRegistration.marketplaceName,
      marketplaceRoot: codexRegistration.marketplaceRoot,
      configPath: path.join(codexHomeRoot, 'config.toml'),
      cwd: scope === 'project' ? base : codexRoot,
      destination: path.join(codexRoot, 'plugins/cache', codexRegistration.marketplaceName, PACKAGE_NAME, PACKAGE_VERSION),
    }
    : null;
  return {
    base, scope, hostIds, skillNames, domainSkillNames, ...targets,
    registrations: [...codexRegistration.registrations, ...continuityGuidance.registrations],
    guidanceSkipped: continuityGuidance.guidanceSkipped,
    guidanceUnavailable: continuityGuidance.guidanceUnavailable,
    codexActivation,
  };
}

async function copyContents(source, destination, { includeCodexMetadata = false } = {}) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name === 'agents' && !includeCodexMetadata) continue;
    await cp(path.join(source, entry.name), path.join(destination, entry.name), {
      recursive: true,
      force: false,
      errorOnExist: true,
    });
  }
}

async function reserveDirectory(destination) {
  try {
    await mkdir(destination);
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') return false;
    throw error;
  }
}

async function writeInstalledSkills(routerDestination, skillNames) {
  const manifest = path.join(routerDestination, 'references/installed-skills.md');
  await mkdir(path.dirname(manifest), { recursive: true });
  const lines = skillNames.length ? skillNames.map((name) => `- ${name}`) : ['- none'];
  await writeFile(manifest, `# Installed Overdrive skills\n\n${lines.join('\n')}\n`, { flag: 'wx' });
}

async function installDirectory(source, destination, manifestPath, manifest) {
  await mkdir(path.dirname(destination), { recursive: true });
  const reserved = await reserveDirectory(destination);
  if (!reserved) return false;
  try {
    await mkdir(path.join(destination, 'skills'));
    for (const name of manifest.skillNames) {
      await copyContents(
        path.join(source, name),
        path.join(destination, 'skills', name),
        { includeCodexMetadata: manifest.hostIds.includes('codex') },
      );
      if (name === ROUTER_SKILL) await writeInstalledSkills(path.join(destination, 'skills', name), manifest.selectedSkillNames);
    }
    const manifestFile = path.join(destination, manifestPath);
    await mkdir(path.dirname(manifestFile), { recursive: true });
    await writeFile(manifestFile, `${JSON.stringify(manifest.content, null, 2)}\n`, { flag: 'wx' });
    return true;
  } catch (error) {
    await rmdir(destination).catch(() => {});
    throw new Error(
      `Could not install bundle to ${destination}: ${error.message}. If a partial folder remains, remove it before retrying.`,
      { cause: error },
    );
  }
}

async function installFlatSkill(sourceRoot, target, selectedSkillNames) {
  await mkdir(path.dirname(target.destination), { recursive: true });
  const reserved = await reserveDirectory(target.destination);
  if (!reserved) return false;
  try {
    await copyContents(path.join(sourceRoot, target.skillName), target.destination,
      { includeCodexMetadata: target.hostIds.includes('codex') });
    if (target.skillName === ROUTER_SKILL) await writeInstalledSkills(target.destination, selectedSkillNames);
    return true;
  } catch (error) {
    await rmdir(target.destination).catch(() => {});
    throw new Error(
      `Could not install ${target.skillName} to ${target.destination}: ${error.message}. If a partial folder remains, remove it before retrying.`,
      { cause: error },
    );
  }
}

async function writeRegistration(registration) {
  const current = await destinationExists(registration.destination)
    ? await readFile(registration.destination, 'utf8')
    : null;
  if (current !== registration.original) {
    throw new Error(`Registration changed after preview; refusing to overwrite ${registration.destination}.`);
  }
  if (current === registration.text) return false;
  await mkdir(path.dirname(registration.destination), { recursive: true });
  await writeFile(registration.destination, registration.text, { flag: current === null ? 'wx' : 'w' });
  return true;
}

export async function executeInstall(plan, {
  skillsRoot = SKILLS_ROOT,
  activateCodex = false,
  runCommand = spawnSync,
} = {}) {
  const result = {
    installed: [],
    skipped: [],
    registrations: [],
    guidanceSkipped: [...plan.guidanceSkipped],
    guidanceUnavailable: [...plan.guidanceUnavailable],
  };
  for (const bundle of plan.bundles) {
    if (bundle.skip) {
      result.skipped.push(bundle);
      continue;
    }
    const installed = await installDirectory(skillsRoot, bundle.destination, bundle.manifestPath, {
      content: bundle.manifest,
      skillNames: plan.skillNames,
      selectedSkillNames: plan.domainSkillNames,
      hostIds: bundle.hostIds,
    });
    if (installed) result.installed.push(bundle);
    else result.skipped.push(bundle);
  }
  for (const skill of plan.flatSkills) {
    if (skill.skip) {
      result.skipped.push(skill);
      continue;
    }
    const installed = await installFlatSkill(skillsRoot, skill, plan.domainSkillNames);
    if (installed) result.installed.push(skill);
    else result.skipped.push(skill);
  }
  for (const registration of plan.registrations) {
    if (await writeRegistration(registration)) result.registrations.push(registration.destination);
  }
  if (activateCodex && plan.codexActivation) {
    const { marketplaceName, marketplaceRoot, cwd } = plan.codexActivation;
    const command = `codex plugin marketplace add ${JSON.stringify(marketplaceRoot)} --json && codex plugin add overdrive@${marketplaceName} --json`;
    const marketplace = runCommand('codex', ['plugin', 'marketplace', 'add', marketplaceRoot, '--json'], {
      cwd,
      encoding: 'utf8',
    });
    if (marketplace.error?.code === 'ENOENT') {
      result.codexActivation = { status: 'unavailable', command };
    } else if (marketplace.status !== 0) {
      const detail = marketplace.error?.message || marketplace.stderr?.trim() || marketplace.stdout?.trim() || `exit ${marketplace.status}`;
      result.codexActivation = { status: 'failed', command, detail };
    } else {
      const activation = runCommand('codex', ['plugin', 'add', `overdrive@${marketplaceName}`, '--json'], {
        cwd,
        encoding: 'utf8',
      });
      if (activation.error?.code === 'ENOENT') {
        result.codexActivation = { status: 'unavailable', command };
      } else if (activation.status !== 0) {
        const detail = activation.error?.message || activation.stderr?.trim() || activation.stdout?.trim() || `exit ${activation.status}`;
        result.codexActivation = { status: 'failed', command, detail };
      } else {
        result.codexActivation = { status: 'installed', command };
      }
    }
  }
  return result;
}

export async function installSkills(options) {
  const plan = await prepareInstall(options);
  return executeInstall(plan, { skillsRoot: options.skillsRoot ?? SKILLS_ROOT });
}

function usage() {
  return [
    'Usage: npx overdrive-skills install [--host <id[,id]>] [--scope project|global]',
    '       [--skill <name[,name]>] [--surface ide|cli|both]',
    '',
    `Hosts: ${HOSTS.map(({ id }) => id).join(', ')}`,
    'Host selection is required. Project scope and all skills (including the optional router) are the defaults.',
    'Use --scope global to install for your user from any IDE terminal.',
    '--surface applies to global Antigravity installs only.',
  ].join('\n');
}

function parseArguments(args) {
  const options = { hostIds: [], skillNames: [] };
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (!['--host', '--scope', '--skill', '--surface'].includes(flag)) throw new Error(`Unknown option: ${flag}`);
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Expected a value after ${flag}.`);
    index += 1;
    if (flag === '--host') options.hostIds.push(...value.split(',').map((entry) => entry.trim()).filter(Boolean));
    else if (flag === '--skill') options.skillNames.push(...value.split(',').map((entry) => entry.trim()).filter(Boolean));
    else if (flag === '--scope') {
      if (options.scope) throw new Error('Use --scope once.');
      options.scope = value;
    } else {
      if (options.antigravitySurface) throw new Error('Use --surface once.');
      options.antigravitySurface = value;
    }
  }
  if (options.hostIds.some((id) => !HOST_IDS.has(id))) throw new Error(`Unknown host: ${options.hostIds.find((id) => !HOST_IDS.has(id))}`);
  if (options.scope && !['project', 'global'].includes(options.scope)) throw new Error(`Unknown install scope: ${options.scope}`);
  return options;
}

async function askSelection(question, label, choices, { defaultAll = false, defaultIds = [] } = {}) {
  const valid = new Set(choices.map(({ id }) => id));
  const choiceList = choices.map(({ id, label: name }) => `  ${id}${name ? ` — ${name}` : ''}`).join('\n');
  while (true) {
    const suffix = defaultAll ? ' or press Enter for all' : defaultIds.length ? ' or press Enter to accept detected hosts' : '';
    const answer = (await question(`${label}\n${choiceList}\nEnter comma-separated IDs${suffix}: `)).trim();
    if (!answer && defaultAll) return [...valid];
    if (!answer && defaultIds.length) return [...defaultIds];
    const selected = [...new Set(answer.split(',').map((value) => value.trim()).filter(Boolean))];
    const invalid = selected.filter((value) => !valid.has(value));
    if (selected.length && !invalid.length && !selected.includes('all')) return selected;
    process.stdout.write(`Choose one or more listed IDs${invalid.length ? `; unknown: ${invalid.join(', ')}` : ''}.\n\n`);
  }
}

function describePlan(plan) {
  const targets = [];
  for (const bundle of plan.bundles) targets.push(`${bundle.skip ? 'skip existing bundle' : 'bundle'} ${bundle.destination}`);
  for (const skill of plan.flatSkills) targets.push(`${skill.skip ? 'skip existing skill' : 'skill'} ${skill.destination}`);
  return targets;
}

async function promptInstall(options) {
  const skills = await availableSkills(SKILLS_ROOT);
  const skillChoices = skills.map((name) => ({ id: name, label: name === ROUTER_SKILL ? 'optional task router' : '' }));
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const abort = new AbortController();
  rl.on('SIGINT', () => abort.abort());
  const lines = rl[Symbol.asyncIterator]();
  const cancelled = new Promise((_, reject) => {
    abort.signal.addEventListener('abort', () => reject(Object.assign(new Error('Cancelled'), { name: 'AbortError' })), { once: true });
  });
  const question = async (message) => {
    process.stdout.write(message);
    const answer = await Promise.race([lines.next(), cancelled]);
    if (answer.done) throw Object.assign(new Error('Input ended'), { name: 'AbortError' });
    return answer.value;
  };

  try {
    await showBanner();
    const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir();
    const cwd = process.cwd();
    const codexHome = process.env.CODEX_HOME ? path.resolve(process.env.CODEX_HOME) : path.join(homeDir, '.codex');
    const ideLabel = isVSCodeTerminal(process.env) ? 'Visual Studio Code' : null;
    const ideHosts = options.hostIds.length ? [] : detectIDEHosts();
    let scope = options.scope;
    while (!scope) {
      const projectLabel = ideLabel ? `This project (${ideLabel} workspace)` : 'This project';
      const globalLabel = ideLabel ? `Global user install (${ideLabel})` : 'Global user install';
      const answer = (await question(`Install scope: 1) ${projectLabel} [default]  2) ${globalLabel}: `)).trim().toLowerCase();
      if (!answer || ['1', 'project', 'p'].includes(answer)) scope = 'project';
      else if (['2', 'global', 'g'].includes(answer)) scope = 'global';
      else process.stdout.write('Choose 1 for this project or 2 for global.\n');
    }

    let hostIds = options.hostIds;
    if (!hostIds.length) {
      const detectedProjectHosts = await detectHosts(cwd);
      if (ideLabel) process.stdout.write(`Detected IDE: ${ideLabel}\n`);
      if (ideHosts.length) process.stdout.write(`Detected IDE host(s): ${ideHosts.join(', ')}\n`);
      if (detectedProjectHosts.length) {
        process.stdout.write(`Detected project host hints: ${detectedProjectHosts.map(({ id }) => id).join(', ')}\n`);
        for (const { id, reason } of detectedProjectHosts) process.stdout.write(`  ${id} from ${reason}\n`);
      }
      const detectedIds = [...new Set([
        ...ideHosts,
        ...detectedProjectHosts.map(({ id }) => id),
      ])];
      if (detectedIds.length === 1) {
        hostIds = detectedIds;
        process.stdout.write(`Using detected host: ${detectedIds[0]}\n`);
      } else {
        hostIds = await askSelection(question, 'Choose host(s):', HOSTS, {
          defaultIds: detectedIds,
        });
      }
    }
    const skillNames = options.skillNames.length
      ? options.skillNames
      : await askSelection(question, 'Skills:', skillChoices, { defaultAll: true });
    let antigravitySurface = options.antigravitySurface;
    if (hostIds.includes('antigravity') && scope === 'global' && !antigravitySurface) {
      const surfaceChoices = [
        { id: 'ide', label: 'Antigravity IDE' },
        { id: 'cli', label: 'Antigravity CLI' },
        { id: 'both', label: 'IDE and CLI' },
      ];
      antigravitySurface = await askSelection(question, 'Global Antigravity surface:', surfaceChoices);
      antigravitySurface = antigravitySurface[0];
    }

    const plan = await prepareInstall({ scope, hostIds, skillNames, cwd, homeDir, codexHome, antigravitySurface });
    const scopeLabel = ideLabel
      ? (scope === 'project' ? `${ideLabel} workspace` : `${ideLabel} user skills`)
      : scope;
    process.stdout.write(`\nScope: ${scope} (${scopeLabel}: ${path.resolve(scope === 'project' ? cwd : homeDir)})\n`);
    process.stdout.write(`Hosts: ${hostIds.join(', ')}\nSkills: ${skillNames.join(', ')}\nRouter: ${skillNames.includes(ROUTER_SKILL) ? 'selected' : 'not selected'}\n`);
    if (hostIds.includes('antigravity') && scope === 'global') process.stdout.write(`Antigravity surface: ${antigravitySurface}\n`);
    process.stdout.write('\nPreview:\n');
    for (const target of describePlan(plan)) process.stdout.write(`  ${target}\n`);
    for (const registration of plan.registrations) {
      process.stdout.write(`  register/merge ${registration.destination}\n`);
    }
    for (const item of plan.guidanceSkipped) {
      process.stdout.write(`  skip existing continuity guidance ${item.destination} (${item.reason})\n`);
    }
    for (const item of plan.guidanceUnavailable) {
      process.stdout.write(`  ${item.hostId} always-on guidance unavailable: ${item.reason}\n`);
    }
    if (plan.codexActivation) {
      process.stdout.write(`  register Codex CLI marketplace in ${plan.codexActivation.configPath} from ${plan.codexActivation.marketplaceRoot}\n`);
      process.stdout.write(`  activate Codex CLI at ${plan.codexActivation.destination} with overdrive@${plan.codexActivation.marketplaceName}\n`);
    }
    process.stdout.write('Existing bundle destinations are skipped whole; existing flat skills are skipped individually.\n');
    if (!['y', 'yes'].includes((await question('Continue? [y/N]: ')).trim().toLowerCase())) {
      process.stdout.write('Installation cancelled.\n');
      return 0;
    }

    const result = await executeInstall(plan, { activateCodex: true });
    for (const item of result.installed) process.stdout.write(`Installed ${item.destination}\n`);
    for (const item of result.skipped) process.stdout.write(`Skipped existing ${item.destination}\n`);
    for (const item of result.registrations) process.stdout.write(`Registered ${item}\n`);
    for (const item of result.guidanceSkipped) process.stdout.write(`Skipped existing continuity guidance ${item.destination}\n`);
    for (const item of result.guidanceUnavailable) process.stdout.write(`${item.hostId} always-on guidance unavailable: ${item.reason}\n`);
    if (result.codexActivation?.status === 'installed') {
      process.stdout.write(`Activated Codex CLI at ${plan.codexActivation.destination}. Start a new Codex session to load its commands.\n`);
    } else if (result.codexActivation?.status === 'unavailable') {
      process.stdout.write(`Codex CLI was not found; its files and registration are ready. Install Codex CLI, then run ${result.codexActivation.command}.\n`);
    } else if (result.codexActivation?.status === 'failed') {
      process.stderr.write(`Codex plugin activation failed after file registration: ${result.codexActivation.detail}\nRun ${result.codexActivation.command} after resolving this error.\n`);
      return 1;
    }
    process.stdout.write(`\nDone: ${result.installed.length} installed, ${result.skipped.length} skipped, ${result.registrations.length} registrations updated.\n`);
    return 0;
  } catch (error) {
    if (error.name === 'AbortError') {
      process.stdout.write('\nInstallation cancelled.\n');
      return 130;
    }
    throw error;
  } finally {
    rl.close();
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === '--help' || command === '-h' || args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  if (command !== 'install') {
    process.stderr.write(`${usage()}\n`);
    return 2;
  }
  const options = parseArguments(args);
  return promptInstall(options);
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((status) => { process.exitCode = status; }).catch((error) => {
    process.stderr.write(`Install failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
