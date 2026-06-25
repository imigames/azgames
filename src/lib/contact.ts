import { supabaseAdmin } from './supabase';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const MAX_NAME_LENGTH = 60;
const MAX_EMAIL_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 3_000;
const MAX_LINKS_PER_MESSAGE = 2;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const linkPattern = /\b(?:https?:\/\/|www\.)\S+/gi;
const repeatedCharactersPattern = /(.)\1{8,}/;
const allowedStatuses = new Set(['new', 'read', 'replied', 'archived', 'spam']);

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  adminNote: string | null;
  userAgent: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  admin_note: string | null;
  user_agent: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface CreateContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  request?: Request;
}

interface AdminListContactMessagesOptions extends PaginationOptions {
  status?: string;
  search?: string;
}

interface ContactMutationResult {
  success: boolean;
  error?: string;
}

const normalizePagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }: PaginationOptions = {}) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit)
    ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit)))
    : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    from,
    to: from + safeLimit - 1,
  };
};

const mapContactMessage = (message: ContactMessageRow): ContactMessage => ({
  id: message.id,
  name: message.name,
  email: message.email,
  subject: message.subject,
  message: message.message,
  status: message.status,
  adminNote: message.admin_note,
  userAgent: message.user_agent,
  createdAt: message.created_at,
  updatedAt: message.updated_at,
});

const getRequestIp = (request?: Request) => {
  if (!request) {
    return '';
  }

  const forwardedFor = request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-forwarded-for')
    ?? '';
  return forwardedFor.split(',')[0]?.trim() ?? '';
};

const hashIp = async (ip: string) => {
  if (!ip || !globalThis.crypto?.subtle) {
    return null;
  }

  try {
    const encoded = new TextEncoder().encode(ip);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return null;
  }
};

const toPlainText = (value: string) =>
  value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const validateContactMessage = ({ name, email, subject = '', message }: CreateContactMessageInput) => {
  const normalizedName = toPlainText(String(name ?? ''));
  const normalizedEmail = String(email ?? '').trim();
  const normalizedSubject = toPlainText(String(subject ?? ''));
  const normalizedMessage = toPlainText(String(message ?? ''));

  if (normalizedName.length < 2 || normalizedName.length > MAX_NAME_LENGTH) {
    return { error: 'Name must be between 2 and 60 characters.' };
  }

  if (
    !normalizedEmail
    || normalizedEmail.length > MAX_EMAIL_LENGTH
    || !emailPattern.test(normalizedEmail)
  ) {
    return { error: 'A valid email is required.' };
  }

  if (normalizedSubject.length > MAX_SUBJECT_LENGTH) {
    return { error: 'Subject must be 120 characters or fewer.' };
  }

  if (normalizedMessage.length < 5 || normalizedMessage.length > MAX_MESSAGE_LENGTH) {
    return { error: 'Message must be between 5 and 3000 characters.' };
  }

  const linkCount = normalizedMessage.match(linkPattern)?.length ?? 0;

  if (linkCount > MAX_LINKS_PER_MESSAGE) {
    return { error: 'Your message contains too many links.' };
  }

  if (repeatedCharactersPattern.test(normalizedMessage)) {
    return { error: 'Your message contains too many repeated characters.' };
  }

  return {
    value: {
      name: normalizedName,
      email: normalizedEmail,
      subject: normalizedSubject,
      message: normalizedMessage,
    },
  };
};

const assertServerAdmin = (): ContactMutationResult | null => {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Unable to save message.' };
  }

  return null;
};

const sanitizeSearch = (search = '') =>
  search
    .trim()
    .replaceAll('%', '')
    .replaceAll('*', '')
    .replaceAll(',', ' ')
    .replace(/[()]/g, '')
    .slice(0, 120);

export async function createContactMessage(
  input: CreateContactMessageInput,
): Promise<ContactMutationResult> {
  const adminError = assertServerAdmin();

  if (adminError) {
    return adminError;
  }

  const validation = validateContactMessage(input);

  if ('error' in validation) {
    return { success: false, error: validation.error };
  }

  const userAgent = (input.request?.headers.get('user-agent') ?? '').slice(0, 300) || null;
  const ipHash = await hashIp(getRequestIp(input.request));

  const { error } = await supabaseAdmin!.from('contact_messages').insert({
    name: validation.value.name,
    email: validation.value.email,
    subject: validation.value.subject || null,
    message: validation.value.message,
    status: 'new',
    ip_hash: ipHash,
    user_agent: userAgent,
  });

  if (error) {
    return { success: false, error: 'Unable to save message.' };
  }

  return { success: true };
}

export async function adminListContactMessages({
  status,
  search,
  page,
  limit,
}: AdminListContactMessagesOptions = {}): Promise<ContactMessage[]> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return [];
  }

  const { from, to } = normalizePagination({ page, limit });
  let query = supabaseAdmin
    .from('contact_messages')
    .select('id,name,email,subject,message,status,admin_note,user_agent,created_at,updated_at')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status && allowedStatuses.has(status)) {
    query = query.eq('status', status);
  }

  const normalizedSearch = sanitizeSearch(search);

  if (normalizedSearch) {
    const pattern = `%${normalizedSearch}%`;
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},subject.ilike.${pattern},message.ilike.${pattern}`,
    );
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map(mapContactMessage);
}

export async function adminGetContactMessageById(id: string): Promise<ContactMessage | null> {
  if (!import.meta.env.SSR || !supabaseAdmin || !id) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .select('id,name,email,subject,message,status,admin_note,user_agent,created_at,updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapContactMessage(data as ContactMessageRow);
}

export async function adminUpdateContactMessageStatus(
  id: string,
  status: string,
): Promise<ContactMutationResult> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  if (!id || !allowedStatuses.has(status)) {
    return { success: false, error: 'A valid contact message status is required.' };
  }

  const { error } = await supabaseAdmin
    .from('contact_messages')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function adminUpdateContactMessageNote(
  id: string,
  adminNote: string,
): Promise<ContactMutationResult> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  if (!id) {
    return { success: false, error: 'A message id is required.' };
  }

  const { error } = await supabaseAdmin
    .from('contact_messages')
    .update({ admin_note: adminNote.trim() || null })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export const adminDeleteContactMessage = (id: string): Promise<ContactMutationResult> =>
  adminUpdateContactMessageStatus(id, 'archived');

export async function adminUpdateContactMessage({
  id,
  status,
  adminNote,
}: {
  id: string;
  status?: string;
  adminNote?: string;
}): Promise<ContactMutationResult> {
  if (status) {
    const statusResult = await adminUpdateContactMessageStatus(id, status);

    if (!statusResult.success) {
      return statusResult;
    }
  }

  if (adminNote !== undefined) {
    return adminUpdateContactMessageNote(id, adminNote);
  }

  return { success: true };
}
