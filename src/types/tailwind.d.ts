declare module "tailwindcss/plugin" {
  import { PluginCreator } from "tailwindcss/types/config";
  const plugin: PluginCreator;
  export default plugin;
}

declare module "tailwindcss" {
  const tailwindcss: any;
  export default tailwindcss;
}
