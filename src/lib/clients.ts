// Crèches that already use Aslef, as provided by the Aslef team (logos placed in /public).
// The names are the ones written on each logo. `logo` is a 256px WebP copy made for the site;
// `original` is the file as provided, kept untouched.
export interface ClientCreche {
  name: string;
  logo: string;
  original: string;
  /** Intrinsic size of `logo`, so the browser reserves the space before it loads. */
  width: number;
  height: number;
}

export const CLIENT_CRECHES: ClientCreche[] = [
  { name: 'Crèche Bel Air', logo: '/clients/creche-bel-air.webp', original: '/crech bel air logo.jpg', width: 256, height: 256 },
  { name: 'Les Poussinettes', logo: '/clients/les-poussinettes.webp', original: '/les poussinettes logo.jpg', width: 256, height: 256 },
  { name: 'Palais des Princes', logo: '/clients/palais-des-princes.webp', original: '/plais des princes.jpg', width: 256, height: 253 },
  // The name is the Arabic one written on the logo (Rawdat Sama Al-Anjum).
  { name: 'روضة سما الأنجم', logo: '/clients/sama-al-anjum.webp', original: '/clients/SAMAA ANJOM.jpg', width: 256, height: 256 },
];
