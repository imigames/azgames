import { supabaseAdmin } from '../supabase';

export type AdminReportStatus = 'new' | 'resolved' | 'ignored';

export interface AdminReport {
  id: string;
  gameId: string | null;
  gameSlug: string | null;
  gameTitle: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
}

interface AdminReportRow {
  id: string;
  game_id: string | null;
  game_slug: string | null;
  reason: string;
  details: string | null;
  status: string | null;
  created_at: string | null;
  games?: { title?: string | null; slug?: string | null } | null;
}

export interface AdminListReportsResult {
  reports: AdminReport[];
  error?: string;
}

export interface AdminMutationResult {
  success: boolean;
  error?: string;
}

const reportStatuses = new Set<AdminReportStatus>(['new', 'resolved', 'ignored']);

const mapReport = (report: AdminReportRow): AdminReport => ({
  id: report.id,
  gameId: report.game_id,
  gameSlug: report.game_slug ?? report.games?.slug ?? null,
  gameTitle: report.games?.title ?? report.game_slug ?? 'Unknown game',
  reason: report.reason,
  details: report.details,
  status: report.status ?? 'new',
  createdAt: report.created_at ?? '',
});

export async function adminListReports(status = ''): Promise<AdminListReportsResult> {
  if (!supabaseAdmin) {
    return { reports: [], error: 'Supabase admin client is not configured.' };
  }

  let query = supabaseAdmin
    .from('game_reports')
    .select('id,game_id,game_slug,reason,details,status,created_at,games(title,slug)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (status && reportStatuses.has(status as AdminReportStatus)) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return { reports: [], error: error.message };
  }

  return { reports: (data ?? []).map((report) => mapReport(report as AdminReportRow)) };
}

export async function adminUpdateReportStatus(
  id: string,
  status: AdminReportStatus,
): Promise<AdminMutationResult> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  if (!reportStatuses.has(status)) {
    return { success: false, error: 'Invalid report status.' };
  }

  const { error } = await supabaseAdmin.from('game_reports').update({ status }).eq('id', id);

  return error ? { success: false, error: error.message } : { success: true };
}
