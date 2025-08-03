/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GOOGLE_TAG_MANAGER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
