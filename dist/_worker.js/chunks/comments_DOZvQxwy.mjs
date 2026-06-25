globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabaseAdmin, a as supabase } from './supabase_C3sp2Zx_.mjs';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_BODY_NAME_LENGTH = 40;
const MAX_BODY_COMMENT_LENGTH = 1e3;
const MAX_EMAIL_LENGTH = 120;
const MAX_LINKS_PER_COMMENT = 2;
const MAX_RECENT_COMMENTS_PER_IP = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1e3;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const linkPattern = /\b(?:https?:\/\/|www\.)\S+/gi;
const repeatedCharactersPattern = /(.)\1{8,}/;
const allowedCommentStatuses = /* @__PURE__ */ new Set(["approved", "pending", "spam", "deleted"]);
const normalizePagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit) ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit))) : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;
  return {
    page: safePage,
    limit: safeLimit,
    from,
    to: from + safeLimit - 1
  };
};
const mapComment = (comment) => ({
  id: comment.id,
  gameSlug: comment.game_slug,
  name: comment.name,
  comment: comment.comment,
  createdAt: comment.created_at
});
const mapAdminComment = (comment) => ({
  ...mapComment(comment),
  status: comment.status
});
const getRequestIp = (request) => {
  if (!request) {
    return "";
  }
  const forwardedFor = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "";
  return forwardedFor.split(",")[0]?.trim() ?? "";
};
const hashIp = async (ip) => {
  if (!ip || !globalThis.crypto?.subtle) {
    return null;
  }
  try {
    const encoded = new TextEncoder().encode(ip);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
};
const validateCreateInput = ({ gameSlug, name, email = "", comment }) => {
  const normalizedGameSlug = String(gameSlug ?? "").trim();
  const normalizedName = String(name ?? "").trim();
  const normalizedEmail = String(email ?? "").trim();
  const normalizedComment = String(comment ?? "").trim();
  if (!slugPattern.test(normalizedGameSlug) || normalizedGameSlug.length > 120) {
    return { error: "A valid gameSlug is required." };
  }
  if (normalizedName.length < 2 || normalizedName.length > MAX_BODY_NAME_LENGTH) {
    return { error: "Name must be between 2 and 40 characters." };
  }
  if (normalizedEmail && (normalizedEmail.length > MAX_EMAIL_LENGTH || !emailPattern.test(normalizedEmail))) {
    return { error: "A valid email is required." };
  }
  if (normalizedComment.length < 3 || normalizedComment.length > MAX_BODY_COMMENT_LENGTH) {
    return { error: "Comment must be between 3 and 1000 characters." };
  }
  const linkCount = normalizedComment.match(linkPattern)?.length ?? 0;
  if (linkCount > MAX_LINKS_PER_COMMENT) {
    return { error: "Your comment contains too many links." };
  }
  if (repeatedCharactersPattern.test(normalizedComment)) {
    return { error: "Your comment contains too many repeated characters." };
  }
  return {
    value: {
      gameSlug: normalizedGameSlug,
      name: normalizedName,
      email: normalizedEmail,
      comment: normalizedComment
    }
  };
};
async function getApprovedCommentsByGameSlug(gameSlug, options = {}) {
  if (!supabase || !gameSlug) {
    return [];
  }
  const { from, to } = normalizePagination(options);
  const { data, error } = await supabase.from("game_comments").select("id,game_slug,name,comment,created_at").eq("game_slug", gameSlug).eq("status", "approved").order("created_at", { ascending: false }).range(from, to);
  if (error || !data) {
    return [];
  }
  return data.map(mapComment);
}
const isRateLimited = async (ipHash) => {
  if (!ipHash || !supabaseAdmin) {
    return false;
  }
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error } = await supabaseAdmin.from("game_comments").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if (error) {
    return false;
  }
  return (count ?? 0) >= MAX_RECENT_COMMENTS_PER_IP;
};
async function createGameComment(input) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const validation = validateCreateInput(input);
  if ("error" in validation) {
    return { success: false, error: validation.error };
  }
  const { gameSlug, name, email, comment } = validation.value;
  const { data: game, error: gameError } = await supabaseAdmin.from("games").select("id,slug").eq("slug", gameSlug).eq("is_active", true).maybeSingle();
  if (gameError) {
    return { success: false, error: gameError.message };
  }
  if (!game) {
    return { success: false, error: "Game not found." };
  }
  const userAgent = (input.request?.headers.get("user-agent") ?? "").slice(0, 300) || null;
  const ipHash = await hashIp(getRequestIp(input.request));
  if (await isRateLimited(ipHash)) {
    return { success: false, error: "Please wait before posting another comment." };
  }
  const { error } = await supabaseAdmin.from("game_comments").insert({
    game_id: game.id,
    game_slug: game.slug,
    name,
    email: email || null,
    comment,
    status: "pending",
    ip_hash: ipHash,
    user_agent: userAgent
  });
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
async function adminListComments({
  status,
  page,
  limit
} = {}) {
  if (!supabaseAdmin) {
    return [];
  }
  const { from, to } = normalizePagination({ page, limit });
  let query = supabaseAdmin.from("game_comments").select("id,game_slug,name,comment,status,created_at").order("created_at", { ascending: false }).range(from, to);
  if (status && allowedCommentStatuses.has(status)) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error || !data) {
    return [];
  }
  return data.map(mapAdminComment);
}
async function adminUpdateCommentStatus(id, status) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  if (!id || !allowedCommentStatuses.has(status)) {
    return { success: false, error: "A valid comment status is required." };
  }
  const { error } = await supabaseAdmin.from("game_comments").update({ status }).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
const adminDeleteComment = (id) => adminUpdateCommentStatus(id, "deleted");

export { adminDeleteComment as a, adminUpdateCommentStatus as b, adminListComments as c, createGameComment as d, getApprovedCommentsByGameSlug as g };
