import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const TYPES_PATH = path.join(ROOT, 'types.ts');
const REPORTS_ROOT = path.join(ROOT, 'reports', 'playwright-audit');
const AUDIT_PORT = Number(process.env.PLAYWRIGHT_PORT || '4173');
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${AUDIT_PORT}`;
const START_SERVER = process.env.PLAYWRIGHT_START_SERVER === 'true';
const MAX_CONTROLS_PER_ROUTE = Number(process.env.PLAYWRIGHT_MAX_CONTROLS || '250');
const PAGE_WAIT_MS = Number(process.env.PLAYWRIGHT_WAIT_MS || '600');
const NAV_TIMEOUT_MS = Number(process.env.PLAYWRIGHT_NAV_TIMEOUT_MS || '12000');
const ROUTE_LIMIT = Number(process.env.PLAYWRIGHT_ROUTE_LIMIT || '0');
const ROUTE_FILTER = process.env.PLAYWRIGHT_ROUTE_FILTER || '';

const CLICKABLE_SELECTOR = 'button, a[href], [role="button"], input[type="button"], input[type="submit"]';
const SKIP_PROTOCOLS = ['mailto:', 'sms:', 'tel:', 'javascript:'];

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function safeName(value) {
  return (value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'item';
}

function normalizeRoute(route) {
  return route.startsWith('/') ? route : `/${route}`;
}

function isSkippableHref(href) {
  if (!href) return true;
  return SKIP_PROTOCOLS.some((protocol) => href.startsWith(protocol));
}

async function readRoutesFromEnum() {
  const text = await fs.readFile(TYPES_PATH, 'utf8');
  const match = text.match(/export enum AppView\s*\{([\s\S]*?)\n\}/);
  if (!match) {
    throw new Error('Unable to locate AppView enum in types.ts');
  }
  const values = [];
  for (const line of match[1].split('\n')) {
    const m = line.match(/=\s*'([^']+)'/);
    if (m?.[1]) values.push(m[1]);
  }
  return values.map(normalizeRoute);
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  let lastError = '';
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return;
      lastError = `HTTP ${res.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not become reachable at ${url}. Last error: ${lastError}`);
}

function startDevServer() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCmd, ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(AUDIT_PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
  });
  return child;
}

function routeExistsOnApp(urlValue, knownRoutes) {
  try {
    const u = new URL(urlValue);
    const pathname = u.pathname;
    if (pathname === '/') return true;
    if (knownRoutes.has(pathname)) return true;
    if (/^\/profile\/[^/]+$/.test(pathname)) return true;
    if (/^\/profile\/[^/]+\/followers$/.test(pathname)) return true;
    if (/^\/profile\/[^/]+\/following$/.test(pathname)) return true;
    return false;
  } catch {
    return false;
  }
}

async function validateHref(href, currentPageUrl) {
  if (!href) return { ok: true, skipped: true, reason: 'empty href' };
  if (isSkippableHref(href)) return { ok: true, skipped: true, reason: 'skipped protocol' };

  let absolute;
  try {
    absolute = new URL(href, currentPageUrl).toString();
  } catch (error) {
    return { ok: false, reason: `invalid URL: ${error instanceof Error ? error.message : String(error)}` };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(absolute, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.status >= 400) {
      return { ok: false, url: absolute, status: response.status, reason: `HTTP ${response.status}` };
    }
    return { ok: true, url: absolute, status: response.status };
  } catch (error) {
    return { ok: false, url: absolute, reason: error instanceof Error ? error.message : String(error) };
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function shortLabel(meta) {
  return meta.label || meta.ariaLabel || meta.title || meta.tag || `control-${meta.index + 1}`;
}

async function main() {
  const runId = nowStamp();
  const runDir = path.join(REPORTS_ROOT, runId);
  const screenshotsDir = path.join(runDir, 'screenshots');
  await ensureDir(screenshotsDir);

  const allRoutes = await readRoutesFromEnum();
  let routes = allRoutes;
  if (ROUTE_FILTER) {
    routes = routes.filter((route) => route.includes(ROUTE_FILTER));
  }
  if (ROUTE_LIMIT > 0) {
    routes = routes.slice(0, ROUTE_LIMIT);
  }
  const knownRoutes = new Set(allRoutes);

  let devServer;
  if (START_SERVER) {
    devServer = startDevServer();
    try {
      await waitForServer(BASE_URL, 45000);
    } catch (error) {
      throw new Error(
        `Could not start audit dev server at ${BASE_URL}. If port ${AUDIT_PORT} is busy, free it or run with PLAYWRIGHT_PORT and PLAYWRIGHT_BASE_URL overrides.`
      );
    }
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Executable doesn't exist")) {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    } else {
      throw error;
    }
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const results = {
    runId,
    baseUrl: BASE_URL,
    startedAt: new Date().toISOString(),
    totals: {
      routes: routes.length,
      controlsSeen: 0,
      controlsClicked: 0,
      deadActions: 0,
      deadLinks: 0,
      potentialNoOps: 0,
      routeNavigationErrors: 0,
    },
    routeResults: [],
    deadActions: [],
    deadLinks: [],
    potentialNoOps: [],
  };

  try {
    for (const route of routes) {
      console.log(`Auditing route ${results.routeResults.length + 1}/${routes.length}: ${route}`);
      const routeUrl = new URL(route, BASE_URL).toString();
      const routeKey = safeName(route.replace(/\//g, '-'));
      const routeResult = {
        route,
        routeUrl,
        status: 'ok',
        controlsFound: 0,
        controlsClicked: 0,
        deadActions: 0,
        deadLinks: 0,
        potentialNoOps: 0,
        screenshot: '',
      };

      try {
        await page.goto(routeUrl, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
        await page.waitForTimeout(PAGE_WAIT_MS);
      } catch (error) {
        routeResult.status = 'navigation_error';
        results.totals.routeNavigationErrors += 1;
        results.routeResults.push(routeResult);
        results.deadActions.push({
          route,
          label: 'route-navigation',
          reason: error instanceof Error ? error.message : String(error),
          screenshot: '',
        });
        results.totals.deadActions += 1;
        continue;
      }

      const routeScreenshot = path.join(screenshotsDir, `${routeKey}.png`);
      await page.screenshot({ path: routeScreenshot, fullPage: true });
      routeResult.screenshot = path.relative(runDir, routeScreenshot);

      const controls = await page.$$eval(CLICKABLE_SELECTOR, (elements) => {
        return elements.map((el, index) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          const labelText = (el.innerText || '').replace(/\s+/g, ' ').trim();
          const ariaLabel = (el.getAttribute('aria-label') || '').trim();
          const title = (el.getAttribute('title') || '').trim();
          const href = (el.getAttribute('href') || '').trim();
          const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
          const disabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
          return {
            index,
            tag: el.tagName.toLowerCase(),
            label: labelText,
            ariaLabel,
            title,
            href,
            visible,
            disabled,
          };
        });
      });

      const visibleControls = controls.filter((c) => c.visible && !c.disabled).slice(0, MAX_CONTROLS_PER_ROUTE);
      routeResult.controlsFound = visibleControls.length;
      results.totals.controlsSeen += visibleControls.length;

      for (const controlMeta of visibleControls) {
        await page.goto(routeUrl, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
        await page.waitForTimeout(PAGE_WAIT_MS);

        const beforeBodyLen = await page.evaluate(() => document.body.innerText.length);
        const beforeUrl = page.url();
        const label = shortLabel(controlMeta);
        const auditName = `${routeKey}-${controlMeta.index}-${safeName(label)}`;

        const liveControl = page.locator(CLICKABLE_SELECTOR).nth(controlMeta.index);
        const stillVisible = await liveControl.isVisible().catch(() => false);
        if (!stillVisible) {
          continue;
        }

        let clickError = null;
        try {
          await liveControl.click({ timeout: 4000 });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const intercepted = /intercepts pointer events|not receiving pointer events/i.test(message);
          if (intercepted) {
            try {
              await liveControl.scrollIntoViewIfNeeded();
              await page.waitForTimeout(100);
              await liveControl.click({ timeout: 4000, force: true });
            } catch (forcedError) {
              clickError = forcedError instanceof Error ? forcedError.message : String(forcedError);
            }
          } else {
            clickError = message;
          }
        }

        if (clickError) {
          const shot = path.join(screenshotsDir, `${auditName}-dead-action.png`);
          await page.screenshot({ path: shot, fullPage: true }).catch(() => undefined);
          const deadAction = {
            route,
            label,
            reason: clickError,
            screenshot: path.relative(runDir, shot),
          };
          results.deadActions.push(deadAction);
          routeResult.deadActions += 1;
          results.totals.deadActions += 1;
          continue;
        }
        results.totals.controlsClicked += 1;
        routeResult.controlsClicked += 1;
        await page.waitForTimeout(PAGE_WAIT_MS);

        const afterUrl = page.url();
        const afterBodyLen = await page.evaluate(() => document.body.innerText.length);

        if (controlMeta.href) {
          const linkAudit = await validateHref(controlMeta.href, beforeUrl);
          if (!linkAudit.ok) {
            const shot = path.join(screenshotsDir, `${auditName}-dead-link.png`);
            await page.screenshot({ path: shot, fullPage: true }).catch(() => undefined);
            const deadLink = {
              route,
              label,
              href: controlMeta.href,
              resolvedUrl: linkAudit.url || '',
              status: linkAudit.status || null,
              reason: linkAudit.reason || 'link check failed',
              screenshot: path.relative(runDir, shot),
            };
            results.deadLinks.push(deadLink);
            routeResult.deadLinks += 1;
            results.totals.deadLinks += 1;
          }
        }

        if (afterUrl !== beforeUrl && afterUrl.startsWith(BASE_URL) && !routeExistsOnApp(afterUrl, knownRoutes)) {
          const shot = path.join(screenshotsDir, `${auditName}-dead-internal-route.png`);
          await page.screenshot({ path: shot, fullPage: true }).catch(() => undefined);
          const deadLink = {
            route,
            label,
            href: afterUrl,
            resolvedUrl: afterUrl,
            status: null,
            reason: 'navigated to route not defined by AppView router',
            screenshot: path.relative(runDir, shot),
          };
          results.deadLinks.push(deadLink);
          routeResult.deadLinks += 1;
          results.totals.deadLinks += 1;
        }

        const noNav = afterUrl === beforeUrl;
        const noContentChange = afterBodyLen === beforeBodyLen;
        if (!controlMeta.href && noNav && noContentChange) {
          const shot = path.join(screenshotsDir, `${auditName}-potential-noop.png`);
          await page.screenshot({ path: shot, fullPage: true }).catch(() => undefined);
          const noOp = {
            route,
            label,
            reason: 'click produced no URL or visible content change',
            screenshot: path.relative(runDir, shot),
          };
          results.potentialNoOps.push(noOp);
          routeResult.potentialNoOps += 1;
          results.totals.potentialNoOps += 1;
        }
      }

      results.routeResults.push(routeResult);
    }
  } finally {
    await browser.close().catch(() => undefined);
    if (devServer) {
      devServer.kill('SIGTERM');
    }
  }

  results.finishedAt = new Date().toISOString();

  const jsonPath = path.join(runDir, 'report.json');
  await fs.writeFile(jsonPath, JSON.stringify(results, null, 2), 'utf8');

  const md = [];
  md.push('# Playwright Route + Interaction Audit');
  md.push('');
  md.push(`- Run ID: \`${results.runId}\``);
  md.push(`- Base URL: \`${results.baseUrl}\``);
  md.push(`- Started: ${results.startedAt}`);
  md.push(`- Finished: ${results.finishedAt}`);
  md.push('');
  md.push('## Summary');
  md.push('');
  md.push(`- Routes audited: **${results.totals.routes}**`);
  md.push(`- Controls discovered: **${results.totals.controlsSeen}**`);
  md.push(`- Controls clicked: **${results.totals.controlsClicked}**`);
  md.push(`- Dead actions: **${results.totals.deadActions}**`);
  md.push(`- Dead links: **${results.totals.deadLinks}**`);
  md.push(`- Potential no-op controls: **${results.totals.potentialNoOps}**`);
  md.push(`- Route navigation errors: **${results.totals.routeNavigationErrors}**`);
  md.push('');

  md.push('## Dead Actions');
  md.push('');
  if (results.deadActions.length === 0) {
    md.push('- None');
  } else {
    for (const item of results.deadActions) {
      md.push(`- Route \`${item.route}\` | Control: \`${item.label}\` | Reason: ${item.reason} | Screenshot: \`${item.screenshot}\``);
    }
  }
  md.push('');

  md.push('## Dead Links');
  md.push('');
  if (results.deadLinks.length === 0) {
    md.push('- None');
  } else {
    for (const item of results.deadLinks) {
      const status = item.status == null ? 'n/a' : item.status;
      md.push(`- Route \`${item.route}\` | Control: \`${item.label}\` | Href: \`${item.href}\` | Status: ${status} | Reason: ${item.reason} | Screenshot: \`${item.screenshot}\``);
    }
  }
  md.push('');

  md.push('## Potential No-Op Controls');
  md.push('');
  if (results.potentialNoOps.length === 0) {
    md.push('- None');
  } else {
    for (const item of results.potentialNoOps) {
      md.push(`- Route \`${item.route}\` | Control: \`${item.label}\` | Reason: ${item.reason} | Screenshot: \`${item.screenshot}\``);
    }
  }
  md.push('');

  md.push('## Per-Route Stats');
  md.push('');
  md.push('| Route | Status | Controls Found | Clicked | Dead Actions | Dead Links | Potential No-Ops | Screenshot |');
  md.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |');
  for (const item of results.routeResults) {
    md.push(`| \`${item.route}\` | ${item.status} | ${item.controlsFound} | ${item.controlsClicked} | ${item.deadActions} | ${item.deadLinks} | ${item.potentialNoOps} | \`${item.screenshot}\` |`);
  }
  md.push('');

  const mdPath = path.join(runDir, 'report.md');
  await fs.writeFile(mdPath, md.join('\n'), 'utf8');

  console.log(`Playwright audit complete.\n- JSON: ${path.relative(ROOT, jsonPath)}\n- Markdown: ${path.relative(ROOT, mdPath)}`);
}

main().catch((error) => {
  console.error('Playwright audit failed:', error);
  process.exitCode = 1;
});
