// Permanent public download URL - a Cloudflare Redirect Rule on the aslef.app zone points
// this at the latest production APK (currently hosted on MinIO). The redirect target can
// change (new APK, eventually the Google Play Store) without ever touching this URL or any
// component that references it.
export const APP_DOWNLOAD_URL = 'https://aslef.app/download';

// The Aslef web application (Aslaf-Web): login for every role, and the way iPhone users access
// Aslef (there is no iOS app). Its public privacy policy and its account-deletion page (which asks
// the user to log in first) are the legal pages linked from the footer.
export const WEB_APP_URL = 'https://app.aslef.app';
export const WEB_APP_LABEL = 'app.aslef.app';
export const PRIVACY_URL = 'https://app.aslef.app/privacy';
export const DELETE_ACCOUNT_URL = 'https://app.aslef.app/delete-account';

// Demo video. The "Découvrez Aslef en vidéo" section stays hidden until DEMO_VIDEO_URL is set.
// Accepts an .mp4/.webm file (e.g. '/aslef-demo.mp4' placed in /public, or a Cloudflare Stream /
// MinIO URL) or a YouTube embed URL ('https://www.youtube-nocookie.com/embed/VIDEO_ID').
// DEMO_VIDEO_POSTER is the still image shown before playing ('/aslef-demo-poster.jpg').
export const DEMO_VIDEO_URL: string | null = null;
export const DEMO_VIDEO_POSTER: string | null = null;
