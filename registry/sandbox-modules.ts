/**
 * Lazy loaders for the community sandbox (/sandbox), keyed "./ui/button.tsx".
 * Lives here because Turbopack's import.meta.glob only resolves "./" patterns.
 */
export const registryModules: Record<string, () => Promise<unknown>> = {
  ...import.meta.glob("./ui/*.tsx"),
  ...import.meta.glob("./animations/*.tsx"),
  ...import.meta.glob("./backgrounds/*.tsx"),
  ...import.meta.glob("./charts/*.tsx"),
  ...import.meta.glob("./calendar/*.tsx"),
  ...import.meta.glob("./blocks/*.tsx"),
};
