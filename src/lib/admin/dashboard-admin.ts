import { getSupabaseAdminConfigError, supabaseAdmin } from '../supabase';

export interface AdminDashboardStats {
  totalGames: number;
  totalReports: number;
  totalPlays: number;
  pendingComments: number;
  approvedComments: number;
  newContactMessages: number;
  totalContactMessages: number;
  activePromptTemplates: number;
  totalPromptTemplates: number;
  error?: string;
}

const getCount = async (
  table: 'games' | 'game_reports' | 'game_comments' | 'contact_messages' | 'ai_prompt_templates',
) => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }

  const { count, error } = await supabaseAdmin
    .from(table)
    .select('id', { count: 'exact', head: true });

  return { count: count ?? 0, error: error?.message };
};

const getCommentCount = async (status: 'pending' | 'approved') => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }

  const { count, error } = await supabaseAdmin
    .from('game_comments')
    .select('id', { count: 'exact', head: true })
    .eq('status', status);

  return { count: count ?? 0, error: error?.message };
};

const getContactMessageCount = async (status?: 'new') => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }

  let query = supabaseAdmin
    .from('contact_messages')
    .select('id', { count: 'exact', head: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { count, error } = await query;

  return { count: count ?? 0, error: error?.message };
};

const getPromptTemplateCount = async (activeOnly = false) => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }

  let query = supabaseAdmin
    .from('ai_prompt_templates')
    .select('id', { count: 'exact', head: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { count, error } = await query;

  return { count: count ?? 0, error: error?.message };
};

export async function adminGetDashboardStats(): Promise<AdminDashboardStats> {
  if (!supabaseAdmin) {
    return {
      totalGames: 0,
      totalReports: 0,
      totalPlays: 0,
      pendingComments: 0,
      approvedComments: 0,
      newContactMessages: 0,
      totalContactMessages: 0,
      activePromptTemplates: 0,
      totalPromptTemplates: 0,
      error: getSupabaseAdminConfigError(),
    };
  }

  const [
    gamesResult,
    reportsResult,
    pendingCommentsResult,
    approvedCommentsResult,
    newContactMessagesResult,
    totalContactMessagesResult,
    activePromptTemplatesResult,
    totalPromptTemplatesResult,
    playsResult,
  ] = await Promise.all([
    getCount('games'),
    getCount('game_reports'),
    getCommentCount('pending'),
    getCommentCount('approved'),
    getContactMessageCount('new'),
    getContactMessageCount(),
    getPromptTemplateCount(true),
    getPromptTemplateCount(),
    supabaseAdmin.from('games').select('plays'),
  ]);

  if (
    gamesResult.error
    || reportsResult.error
    || pendingCommentsResult.error
    || approvedCommentsResult.error
    || newContactMessagesResult.error
    || totalContactMessagesResult.error
    || activePromptTemplatesResult.error
    || totalPromptTemplatesResult.error
    || playsResult.error
  ) {
    return {
      totalGames: gamesResult.count,
      totalReports: reportsResult.count,
      pendingComments: pendingCommentsResult.count,
      approvedComments: approvedCommentsResult.count,
      newContactMessages: newContactMessagesResult.count,
      totalContactMessages: totalContactMessagesResult.count,
      activePromptTemplates: activePromptTemplatesResult.count,
      totalPromptTemplates: totalPromptTemplatesResult.count,
      totalPlays: 0,
      error: gamesResult.error
        ?? reportsResult.error
        ?? pendingCommentsResult.error
        ?? approvedCommentsResult.error
        ?? newContactMessagesResult.error
        ?? totalContactMessagesResult.error
        ?? activePromptTemplatesResult.error
        ?? totalPromptTemplatesResult.error
        ?? playsResult.error?.message,
    };
  }

  const totalPlays = (playsResult.data ?? []).reduce((total, game) => {
    const plays = typeof game.plays === 'number' ? game.plays : Number.parseInt(String(game.plays ?? '0'), 10);
    return total + (Number.isNaN(plays) ? 0 : plays);
  }, 0);

  return {
    totalGames: gamesResult.count,
    totalReports: reportsResult.count,
    pendingComments: pendingCommentsResult.count,
    approvedComments: approvedCommentsResult.count,
    newContactMessages: newContactMessagesResult.count,
    totalContactMessages: totalContactMessagesResult.count,
    activePromptTemplates: activePromptTemplatesResult.count,
    totalPromptTemplates: totalPromptTemplatesResult.count,
    totalPlays,
  };
}
