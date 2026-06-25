globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabaseAdmin } from './supabase_C3sp2Zx_.mjs';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const MAX_NAME_LENGTH = 60;
const MAX_EMAIL_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 3e3;
const MAX_LINKS_PER_MESSAGE = 2;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const linkPattern = /\b(?:https?:\/\/|www\.)\S+/gi;
const repeatedCharactersPattern = /(.)\1{8,}/;
const allowedStatuses = /* @__PURE__ */ new Set(["new", "read", "replied", "archived", "spam"]);
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
const mapContactMessage = (message) => ({
  id: message.id,
  name: message.name,
  email: message.email,
  subject: message.subject,
  message: message.message,
  status: message.status,
  adminNote: message.admin_note,
  userAgent: message.user_agent,
  createdAt: message.created_at,
  updatedAt: message.updated_at
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
const toPlainText = (value) => value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const validateContactMessage = ({ name, email, subject = "", message }) => {
  const normalizedName = toPlainText(String(name ?? ""));
  const normalizedEmail = String(email ?? "").trim();
  const normalizedSubject = toPlainText(String(subject ?? ""));
  const normalizedMessage = toPlainText(String(message ?? ""));
  if (normalizedName.length < 2 || normalizedName.length > MAX_NAME_LENGTH) {
    return { error: "Name must be between 2 and 60 characters." };
  }
  if (!normalizedEmail || normalizedEmail.length > MAX_EMAIL_LENGTH || !emailPattern.test(normalizedEmail)) {
    return { error: "A valid email is required." };
  }
  if (normalizedSubject.length > MAX_SUBJECT_LENGTH) {
    return { error: "Subject must be 120 characters or fewer." };
  }
  if (normalizedMessage.length < 5 || normalizedMessage.length > MAX_MESSAGE_LENGTH) {
    return { error: "Message must be between 5 and 3000 characters." };
  }
  const linkCount = normalizedMessage.match(linkPattern)?.length ?? 0;
  if (linkCount > MAX_LINKS_PER_MESSAGE) {
    return { error: "Your message contains too many links." };
  }
  if (repeatedCharactersPattern.test(normalizedMessage)) {
    return { error: "Your message contains too many repeated characters." };
  }
  return {
    value: {
      name: normalizedName,
      email: normalizedEmail,
      subject: normalizedSubject,
      message: normalizedMessage
    }
  };
};
const assertServerAdmin = () => {
  if (!supabaseAdmin) {
    return { success: false, error: "Unable to save message." };
  }
  return null;
};
const sanitizeSearch = (search = "") => search.trim().replaceAll("%", "").replaceAll("*", "").replaceAll(",", " ").replace(/[()]/g, "").slice(0, 120);
async function createContactMessage(input) {
  const adminError = assertServerAdmin();
  if (adminError) {
    return adminError;
  }
  const validation = validateContactMessage(input);
  if ("error" in validation) {
    return { success: false, error: validation.error };
  }
  const userAgent = (input.request?.headers.get("user-agent") ?? "").slice(0, 300) || null;
  const ipHash = await hashIp(getRequestIp(input.request));
  const { error } = await supabaseAdmin.from("contact_messages").insert({
    name: validation.value.name,
    email: validation.value.email,
    subject: validation.value.subject || null,
    message: validation.value.message,
    status: "new",
    ip_hash: ipHash,
    user_agent: userAgent
  });
  if (error) {
    return { success: false, error: "Unable to save message." };
  }
  return { success: true };
}
async function adminListContactMessages({
  status,
  search,
  page,
  limit
} = {}) {
  if (!supabaseAdmin) {
    return [];
  }
  const { from, to } = normalizePagination({ page, limit });
  let query = supabaseAdmin.from("contact_messages").select("id,name,email,subject,message,status,admin_note,user_agent,created_at,updated_at").order("created_at", { ascending: false }).range(from, to);
  if (status && allowedStatuses.has(status)) {
    query = query.eq("status", status);
  }
  const normalizedSearch = sanitizeSearch(search);
  if (normalizedSearch) {
    const pattern = `%${normalizedSearch}%`;
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},subject.ilike.${pattern},message.ilike.${pattern}`
    );
  }
  const { data, error } = await query;
  if (error || !data) {
    return [];
  }
  return data.map(mapContactMessage);
}
async function adminGetContactMessageById(id) {
  if (!supabaseAdmin || !id) {
    return null;
  }
  const { data, error } = await supabaseAdmin.from("contact_messages").select("id,name,email,subject,message,status,admin_note,user_agent,created_at,updated_at").eq("id", id).maybeSingle();
  if (error || !data) {
    return null;
  }
  return mapContactMessage(data);
}
async function adminUpdateContactMessageStatus(id, status) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  if (!id || !allowedStatuses.has(status)) {
    return { success: false, error: "A valid contact message status is required." };
  }
  const { error } = await supabaseAdmin.from("contact_messages").update({ status }).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
async function adminUpdateContactMessageNote(id, adminNote) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  if (!id) {
    return { success: false, error: "A message id is required." };
  }
  const { error } = await supabaseAdmin.from("contact_messages").update({ admin_note: adminNote.trim() || null }).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export { adminUpdateContactMessageStatus as a, adminUpdateContactMessageNote as b, adminGetContactMessageById as c, adminListContactMessages as d, createContactMessage as e };
