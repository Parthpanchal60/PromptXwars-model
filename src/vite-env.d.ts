/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_SHEETS_API_KEY?: string;
  readonly VITE_VISION_API_KEY?: string;
  readonly VITE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly FIREBASE_API_KEY?: string;
  readonly SHEETS_API_KEY?: string;
  readonly VISION_API_KEY?: string;
  readonly MAPS_API_KEY?: string;
  readonly GOOGLE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
