import { reports } from '../data/reports';
import { withMockDelay } from './config';

export async function submitReport(payload) {
  return withMockDelay({ id: `report_${reports.length + 1}`, status: 'open', ...payload });
}

export async function listReports() {
  return withMockDelay(reports);
}

export async function updateReportStatus(reportId, status) {
  return withMockDelay({ id: reportId, status, updatedAt: new Date().toISOString() });
}
