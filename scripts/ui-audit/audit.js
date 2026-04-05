import { chromium } from '@playwright/test';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGET_URL = process.env.TARGET_URL || 'https://bhadra23.vercel.app';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const REPORT_PATH = path.join(__dirname, 'report.json');

// Ensure screenshots directory exists
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

/**
 * Take a full-page screenshot and return its path.
 */
async function screenshot(page, filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

/**
 * Run the Playwright agent, capturing screenshots at each step.
 * Returns { steps: StepLog[], screenshotPaths: string[] }
 */
async function runPlaywrightAgent() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const steps = [];
  const screenshotPaths = [];

  // Helper to record a step
  function recordStep(stepName, action, screenshotPath, error = null) {
    steps.push({ stepName, action, screenshotPath, error });
    if (screenshotPath) screenshotPaths.push(screenshotPath);
  }

  // Step 1 — Navigate to homepage
  try {
    console.log('Step 1: Navigating to homepage…');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    const p = await screenshot(page, 'step-01-homepage.png');
    recordStep('Homepage', `Navigated to ${TARGET_URL} and waited for networkidle`, p);
  } catch (err) {
    console.error('Step 1 error:', err.message);
    recordStep('Homepage', `Navigate to ${TARGET_URL}`, null, err.message);
  }

  // Step 2 — Click first visible button or nav link
  try {
    console.log('Step 2: Clicking first button or nav link…');
    const clickable = page.locator('button:visible, nav a:visible, a[href]:visible').first();
    const count = await clickable.count();
    let action = 'No clickable button or nav link found';
    if (count > 0) {
      const label = await clickable.textContent().catch(() => '');
      action = `Clicked first visible element: "${label?.trim() || '(no text)'}"`;
      await clickable.click({ timeout: 10000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    }
    const p = await screenshot(page, 'step-02-after-first-click.png');
    recordStep('First click', action, p);
  } catch (err) {
    console.error('Step 2 error:', err.message);
    const p = await screenshot(page, 'step-02-after-first-click.png').catch(() => null);
    recordStep('First click', 'Attempted to click first button/link', p, err.message);
  }

  // Step 3 — Scroll to bottom
  try {
    console.log('Step 3: Scrolling to bottom…');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const p = await screenshot(page, 'step-03-scrolled-bottom.png');
    recordStep('Scroll to bottom', 'Scrolled to bottom of page', p);
  } catch (err) {
    console.error('Step 3 error:', err.message);
    recordStep('Scroll to bottom', 'Attempted scroll to bottom', null, err.message);
  }

  // Step 4 — Scroll back to top
  try {
    console.log('Step 4: Scrolling back to top…');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const p = await screenshot(page, 'step-04-back-top.png');
    recordStep('Scroll to top', 'Scrolled back to top of page', p);
  } catch (err) {
    console.error('Step 4 error:', err.message);
    recordStep('Scroll to top', 'Attempted scroll to top', null, err.message);
  }

  // Step 5 — Type into first input field (if any)
  try {
    console.log('Step 5: Looking for input fields…');
    const input = page.locator('input:visible, textarea:visible').first();
    const count = await input.count();
    let action = 'No visible input field found';
    if (count > 0) {
      action = 'Typed "test" into first visible input field';
      await input.click({ timeout: 5000 }).catch(() => {});
      await input.fill('test', { timeout: 5000 }).catch(() => {});
    }
    const p = await screenshot(page, 'step-05-interaction.png');
    recordStep('Input interaction', action, p);
  } catch (err) {
    console.error('Step 5 error:', err.message);
    const p = await screenshot(page, 'step-05-interaction.png').catch(() => null);
    recordStep('Input interaction', 'Attempted to type into input field', p, err.message);
  }

  await browser.close();
  return { steps, screenshotPaths };
}

/**
 * Encode a screenshot file as a base64 data URL.
 */
function toDataURL(filePath) {
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

/**
 * Call OpenAI GPT-4o Vision to score the UI and identify bugs.
 */
async function analyzeWithOpenAI(steps, screenshotPaths) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Build a textual summary of steps
  const stepSummary = steps
    .map((s, i) => `Step ${i + 1} — ${s.stepName}: ${s.action}${s.error ? ` [ERROR: ${s.error}]` : ''}`)
    .join('\n');

  // Build content array: text block first, then one image per screenshot
  const userContent = [
    {
      type: 'text',
      text: `The following screenshots were captured during an automated walkthrough of ${TARGET_URL}.\n\nSteps performed:\n${stepSummary}\n\nPlease analyze each screenshot and return the JSON report as instructed.`,
    },
    ...screenshotPaths.map((p) => ({
      type: 'image_url',
      image_url: { url: toDataURL(p), detail: 'low' },
    })),
  ];

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1500,
    messages: [
      {
        role: 'system',
        content: `You are a senior UX engineer and QA expert. You will be given a series of screenshots from a web application along with descriptions of what actions were taken. Your job is to:
1. Give an overall UI Score from 0–100 based on visual design quality, usability, responsiveness, clarity, and interaction feedback.
2. List specific bugs or UX issues you observe, each with:
   - severity: "critical" | "major" | "minor"
   - location: where on the page
   - description: what the issue is
   - suggestion: how to fix it
Return ONLY valid JSON in this exact format:
{
  "ui_score": <number 0-100>,
  "score_rationale": "<brief explanation>",
  "bugs": [
    {
      "severity": "critical|major|minor",
      "location": "<page area>",
      "description": "<what's wrong>",
      "suggestion": "<how to fix>"
    }
  ],
  "summary": "<2-3 sentence overall assessment>"
}`,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  // Strip markdown code fences if present
  const jsonText = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(jsonText);
}

async function main() {
  console.log(`\n🚀 Starting UI audit for ${TARGET_URL}\n`);

  const { steps, screenshotPaths } = await runPlaywrightAgent();

  const stepsCompleted = steps.filter((s) => !s.error).length;
  const stepsFailed = steps.filter((s) => s.error).length;

  console.log(`\n📸 Captured ${screenshotPaths.length} screenshot(s). Analysing with GPT-4o…\n`);

  let aiResult = null;
  let aiError = null;

  if (!process.env.OPENAI_API_KEY) {
    aiError = 'OPENAI_API_KEY is not set — skipping AI analysis.';
    console.warn(aiError);
  } else if (screenshotPaths.length === 0) {
    aiError = 'No screenshots available for analysis.';
    console.warn(aiError);
  } else {
    try {
      aiResult = await analyzeWithOpenAI(steps, screenshotPaths);
      console.log(`✅ AI analysis complete. UI Score: ${aiResult.ui_score}/100`);
    } catch (err) {
      aiError = err.message;
      console.error('OpenAI call failed:', err.message);
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    target_url: TARGET_URL,
    steps_completed: stepsCompleted,
    steps_failed: stepsFailed,
    ui_score: aiResult ? aiResult.ui_score : null,
    score_rationale: aiResult ? aiResult.score_rationale : null,
    bugs: aiResult ? aiResult.bugs : [],
    summary: aiResult ? aiResult.summary : null,
    step_log: steps,
    ...(aiError ? { error: aiError } : {}),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report written to ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
