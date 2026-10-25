// Public family pre-registration: API client and form rules. The rules mirror the backend's (PreinscriptionRules) so a family gets
// instant feedback, but the server is the authority and re-validates everything.

/** Backend base URL (no trailing slash, no /api/v1). Set VITE_API_BASE to point the form at another backend (local, staging). */
export const API_BASE = ((import.meta.env.VITE_API_BASE as string | undefined) ?? 'https://api.2c-algeria.com').replace(/\/+$/, '');
const API = `${API_BASE}/api/v1`;

export const MAX_CHILDREN = 6;
export const MAX_PICKUPS = 5;
export const MAX_CHILD_AGE_YEARS = 15;

export interface PublicCreche {
  token: string;
  name: string;
  wilaya: string | null;
}

export interface Pickup {
  name: string;
  phone: string;
  relation: string;
  notes: string;
}

export interface ChildDraft {
  /** Local key only - never sent. */
  uid: string;
  firstName: string;
  lastName: string;
  firstNameAr: string;
  lastNameAr: string;
  gender: '' | 'M' | 'F';
  birthdate: string;
  allergies: string;
  medicalNotes: string;
  pickups: Pickup[];
}

export interface ParentDraft {
  firstName: string;
  lastName: string;
  firstNameAr: string;
  lastNameAr: string;
  phone: string;
  email: string;
}

export const emptyParent = (): ParentDraft => ({ firstName: '', lastName: '', firstNameAr: '', lastNameAr: '', phone: '', email: '' });

let uidCounter = 0;
export const emptyChild = (): ChildDraft => ({
  uid: `c${++uidCounter}`,
  firstName: '',
  lastName: '',
  firstNameAr: '',
  lastNameAr: '',
  gender: '',
  birthdate: '',
  allergies: '',
  medicalNotes: '',
  pickups: [],
});

export const emptyPickup = (): Pickup => ({ name: '', phone: '', relation: '', notes: '' });

/** True when the family typed anything in this child's form (used before discarding it). */
export function childHasData(c: ChildDraft): boolean {
  return Boolean(
    c.firstName.trim() || c.lastName.trim() || c.firstNameAr.trim() || c.lastNameAr.trim() || c.gender || c.birthdate || c.allergies.trim() || c.medicalNotes.trim() ||
      c.pickups.some((p) => p.name.trim() || p.phone.trim() || p.relation.trim() || p.notes.trim()),
  );
}

// ---- validation -----------------------------------------------------------------------------------------------------------------

/** Error codes shared with the server; the UI translates them (pre.err.*). */
export type ErrorCode = 'required' | 'invalid' | 'too_long' | 'future' | 'too_old' | 'too_many';
export type Errors = Record<string, ErrorCode>;

/** Algerian numbers: 10 digits starting with 0; +213 / 00213 / 213 prefixes are accepted. Returns the normalised number or null. */
export function normalizePhone(value: string): string | null {
  let d = value.trim().replace(/[\s.\-()]/g, '');
  if (d.startsWith('+213')) d = `0${d.slice(4)}`;
  else if (d.startsWith('00213')) d = `0${d.slice(5)}`;
  else if (d.startsWith('213') && d.length === 12) d = `0${d.slice(3)}`;
  return /^0[1-9]\d{8}$/.test(d) ? d : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Removes the blanks (spaces, tabs, no-break and zero-width spaces) at the start and the end of an e-mail address. Blanks INSIDE the
 *  address are kept: such an address is invalid and the visitor must fix it. Mirrors the backend's PreinscriptionRules.normalizeEmail. */
export function normalizeEmail(value: string): string {
  return value.replace(/^[\s\u200B]+|[\s\u200B]+$/g, '');
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function oldestBirthdateIso(): string {
  const d = new Date();
  return `${d.getFullYear() - MAX_CHILD_AGE_YEARS}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function validateParent(p: ParentDraft): Errors {
  const e: Errors = {};
  if (!p.firstName.trim()) e.firstName = 'required';
  if (!p.lastName.trim()) e.lastName = 'required';
  if (!p.phone.trim()) e.phone = 'required';
  else if (!normalizePhone(p.phone)) e.phone = 'invalid';
  const email = normalizeEmail(p.email);
  if (!email) e.email = 'required';
  else if (!EMAIL.test(email)) e.email = 'invalid';
  return e;
}

export function validateChild(c: ChildDraft): Errors {
  const e: Errors = {};
  if (!c.firstName.trim()) e.firstName = 'required';
  if (!c.lastName.trim()) e.lastName = 'required';
  if (!c.gender) e.gender = 'required';
  if (!c.birthdate) e.birthdate = 'required';
  else if (c.birthdate > todayIso()) e.birthdate = 'future';
  else if (c.birthdate < oldestBirthdateIso()) e.birthdate = 'too_old';
  c.pickups.forEach((p, i) => {
    const any = p.name.trim() || p.phone.trim() || p.relation.trim() || p.notes.trim();
    if (!any) return;
    if (!p.name.trim()) e[`pickups.${i}.name`] = 'required';
    if (p.phone.trim() && !normalizePhone(p.phone)) e[`pickups.${i}.phone`] = 'invalid';
  });
  return e;
}

// ---- API ------------------------------------------------------------------------------------------------------------------------

export type SubmitFailure =
  | { kind: 'validation'; field: string; code: ErrorCode }
  | { kind: 'duplicate' }
  | { kind: 'creche' }
  | { kind: 'rate' }
  | { kind: 'network' }
  | { kind: 'server' };

async function request(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 20000);
  try {
    return await fetch(`${API}${path}`, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchCreches(): Promise<PublicCreche[]> {
  const res = await request('/public/preinscription/creches', { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`creches ${res.status}`);
  return (await res.json()) as PublicCreche[];
}

export interface Submission {
  crecheToken: string;
  parent: ParentDraft;
  children: ChildDraft[];
  locale: 'fr' | 'ar';
  consent: boolean;
  /** Honeypot: always empty for a real visitor. */
  website: string;
}

/** Resolves with the request reference, or rejects with a SubmitFailure. Nothing sensitive is ever logged. */
export async function submitPreinscription(s: Submission): Promise<string> {
  const body = {
    crecheToken: s.crecheToken,
    firstName: s.parent.firstName.trim(),
    lastName: s.parent.lastName.trim(),
    firstNameAr: s.parent.firstNameAr.trim(),
    lastNameAr: s.parent.lastNameAr.trim(),
    phone: s.parent.phone.trim(),
    // Blanks around an address are a typing slip: removed here (the server does it again and stays the reference).
    email: normalizeEmail(s.parent.email),
    locale: s.locale,
    consent: s.consent,
    website: s.website,
    children: s.children.map((c) => ({
      firstName: c.firstName,
      lastName: c.lastName,
      firstNameAr: c.firstNameAr,
      lastNameAr: c.lastNameAr,
      gender: c.gender,
      birthdate: c.birthdate,
      allergies: c.allergies,
      medicalNotes: c.medicalNotes,
      pickups: c.pickups,
    })),
  };
  let res: Response;
  try {
    res = await request('/public/preinscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw { kind: 'network' } satisfies SubmitFailure;
  }
  if (res.ok) return ((await res.json()) as { reference: string }).reference;
  let data: { error?: string; field?: string; code?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error body */
  }
  if (res.status === 400 && data.error === 'validation') throw { kind: 'validation', field: data.field ?? '', code: (data.code ?? 'invalid') as ErrorCode } satisfies SubmitFailure;
  if (res.status === 409) throw { kind: 'duplicate' } satisfies SubmitFailure;
  if (res.status === 404) throw { kind: 'creche' } satisfies SubmitFailure;
  if (res.status === 429) throw { kind: 'rate' } satisfies SubmitFailure;
  throw { kind: 'server' } satisfies SubmitFailure;
}
