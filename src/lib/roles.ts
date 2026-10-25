// Lets any link on the page open the "Pour qui ?" section on a given role tab (the navbar's
// "Pour qui ?" always shows Parent first; the footer links open their own role).
export type RoleKey = 'parent' | 'educator' | 'transport' | 'manager';

export const ROLE_EVENT = 'aslef:select-role';

export function selectRole(key: RoleKey) {
  window.dispatchEvent(new CustomEvent<RoleKey>(ROLE_EVENT, { detail: key }));
}
