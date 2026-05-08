import { defaultShareSlug, hasShareSlug, shareSlugScenarios } from '../scenarios/shareSlugScenarios';

const NETWORK_DELAY_MS = 150;

function withDelay(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), NETWORK_DELAY_MS);
  });
}

export function getScanScenarios() {
  return withDelay(shareSlugScenarios);
}

export async function simulateQrScan(scenarioId) {
  const selected = shareSlugScenarios.find((scenario) => scenario.id === scenarioId);
  return withDelay({ shareSlug: selected?.shareSlug || defaultShareSlug });
}

export async function validateManualShareSlug(shareSlug) {
  const normalized = shareSlug.trim();
  if (!normalized) {
    return withDelay({ ok: false, message: 'Enter a code first.' });
  }

  if (!hasShareSlug(normalized)) {
    return withDelay({ ok: false, message: 'Code not found in mock scenarios.' });
  }

  return withDelay({ ok: true, shareSlug: normalized });
}
