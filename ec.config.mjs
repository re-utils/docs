import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import twoSlash from "expressive-code-twoslash";

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default {
  plugins: [pluginLineNumbers(), twoSlash()],
};
