import { BrushContext } from "../types";
import { THEME_FILE } from "./graphql/mutations";
import JSON5 from "json5";

// Use a Map for more efficient lookups and memory management
const translationCache = new Map<string, Record<string, string>>();

export const getTranslations = async (context: BrushContext): Promise<Record<string, string>> => {
  const locale = (context.locale || "en").toLowerCase();
  const localeCode = locale === "en" ? "en.default" : locale;
  const cacheKey = `${localeCode}|${context.themeId}`;

  // Return cached translations if available
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  // Prepare GraphQL variables
  const variables = {
    id: `gid://shopify/OnlineStoreTheme/${context.themeId}`,
    filenames: [`locales/${localeCode}.json`],
  };

  try {
    const response = await context.adminApi?.graphql(THEME_FILE, variables);
    const fileNode = response?.theme?.files?.nodes?.[0];
    const content = fileNode?.body?.content;

    if (!content) throw new Error(`No translation file found for ${localeCode}`);

    // Parse and cache
    const parsed = JSON5.parse(content);
    translationCache.set(cacheKey, parsed);
    return parsed;
  } catch (err) {
    console.error(`Error loading translations for ${localeCode}:`, err);
    // Fallback to empty object to prevent app crash
    return {};
  }
};
