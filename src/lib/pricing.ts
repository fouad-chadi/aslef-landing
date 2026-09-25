// Aslef subscription pricing - billed per 3-month period, never monthly.
// This is the landing page's own estimate calculator (no backend behind this
// static site) - it mirrors the business rules given for the registration
// form, not the production billing engine.
export const CAPACITY_OPTIONS = [10, 20, 30, 40, 50] as const;
export type Capacity = (typeof CAPACITY_OPTIONS)[number];

export const ACCESS_OPTIONS = [2, 4] as const;
export type AccessCount = (typeof ACCESS_OPTIONS)[number];

// Each parent account is 1000 DA/3mo. Additional children on the same parent
// account are +500 DA/3mo each, but that only applies once a real parent
// account has real children - not to the initial capacity chosen at
// registration (child counts aren't known yet).
export const PARENT_BASE_PRICE = 1000;
export const EXTRA_CHILD_PRICE = 500;

// 2 access is included in the base price. Going to 4 access adds 1000 DA/3mo
// - per parent account, same as the base price, not a flat one-time fee.
export const ACCESS_UPGRADE_PRICE = 1000;

export function pricePerAccount(access: AccessCount): number {
  return PARENT_BASE_PRICE + (access === 4 ? ACCESS_UPGRADE_PRICE : 0);
}

export function totalEstimate(capacity: Capacity, access: AccessCount): number {
  return capacity * pricePerAccount(access);
}

export function formatDA(amount: number): string {
  return amount.toLocaleString('fr-FR').replace(/ /g, ' ');
}
