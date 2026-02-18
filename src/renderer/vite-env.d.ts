/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_HASH__: string;

declare module "*.ico" {
  const value: string;
  export default value;
}
