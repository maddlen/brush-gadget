import * as JSON5 from "json5";
import Cache from "../cache";
import { BrushContext } from "../types";
import { THEME_FILE } from "./graphql/mutations";

export const getTranslations = async (context: BrushContext): Promise<Record<string, string>> => {
  const locale = (context.locale || "en").toLowerCase();
  const localeCode = locale === "en" ? "en.default" : locale;
  const cacheKey = `translations_${context.connections.shopify.currentShopId}|${localeCode}|${context.themeId}`;
  const cached = Cache.get<string>(cacheKey);

  if (cached) {
    return JSON5.parse(cached);
  }

  // Prepare GraphQL variables
  const variables = {
    id: `gid://shopify/OnlineStoreTheme/${context.themeId}`,
    filenames: [`locales/${localeCode}.json`],
  };

  try {
    const response = await context.adminApi.graphql(THEME_FILE, variables);
    const fileNode = response?.theme?.files?.nodes?.[0];
    const content = fileNode?.body?.content;

    if (!content) throw new Error(`No translation file found for ${localeCode}`);

    // Cache and parse
    Cache.set<string>(cacheKey, content);
    const parsed = JSON5.parse(content);
    return parsed;
  } catch (err) {
    context.logger.error(
      { error: err },
      `Error loading "${localeCode}" translations for shop with domain "${context.shopifyShop.myshopifyDomain}" and theme ID "${context.themeId}"`
    );
    // Fallback to empty object to prevent app crash
    return {};
  }
};
