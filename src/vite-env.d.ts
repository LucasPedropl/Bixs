/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BIXS_API_BASE?: string;
	readonly VITE_BIXS_API_EMAIL?: string;
	readonly VITE_BIXS_API_PASSWORD?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
