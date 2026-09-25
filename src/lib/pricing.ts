// Aslef subscription pricing - billed per 3-month period, never monthly.
// This is the landing page's own estimate calculator (no backend behind this
// static site) - it mirrors the business rules given for the registration
// form, not the production billing engine.
export const CAPACITY_OPTIONS = [10, 20, 30, 40, 50] as const;
export type Capacity = (typeof CAPACITY_OPTIONS)[number];

export const ACCESS_OPTIONS = [2, 4] as const;
export type AccessCount = (typeof ACCESS_OPTIONS)[number];

// 1 parent account / 1 child, per 3 months. Additional children on the same
// parent account are +500 DA/3mo each, but that only applies once real
// parent accounts with real children exist - not to the initial capacity
// chosen at registration.
export const PARENT_BASE_PRICE = 1000;
export const EXTRA_CHILD_PRICE = 500;

const ACCESS_PRICE: Record<AccessCount, number> = { 2: 1000, 4: 2000 };

export function accessPrice(access: AccessCount): number {
  return ACCESS_PRICE[access];
}

export function totalEstimate(access: AccessCount): number {
  return PARENT_BASE_PRICE + accessPrice(access);
}
