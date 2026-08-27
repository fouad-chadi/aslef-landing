// Permanent public download URL - a Cloudflare Redirect Rule on the aslef.app zone points
// this at the latest production APK (currently hosted on MinIO). The redirect target can
// change (new APK, eventually the Google Play Store) without ever touching this URL or any
// component that references it.
export const APP_DOWNLOAD_URL = 'https://aslef.app/download';
