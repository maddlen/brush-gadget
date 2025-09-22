import { BrushContext } from "../types";
import { authenticateAppProxy } from "./app-proxy";
import { makeShop } from "./current-shop";
import { getStorefrontClient } from "./storefront";

/**
 * Main enrichment function
 */
export const enrichBrushContext = async (context: BrushContext): Promise<BrushContext> => {
  authenticateIfFrontend(context);
  switchToAdminApi(context);
  await setupShopifyConnections(context);
  extractCustomer(context);
  extractLocalization(context);
  extractTheme(context);
  addBrushConfig(context);

  return context;
};

/**
 * Validate the request source and authenticate if needed
 */
const authenticateIfFrontend = (context: BrushContext) => {
  if (!context.gadgetContext.appSessionID) {
    authenticateAppProxy(context);
  }
};

/**
 * Switch API to admin mode
 */
const switchToAdminApi = (context: BrushContext) => {
  context.api = context.api.actAsAdmin;
};

/**
 * Set up Shopify shop and API clients
 */
const setupShopifyConnections = async (context: BrushContext) => {
  context.shopifyShop = await makeShop(context);
  context.connections.shopify.setCurrentShop(context.shopifyShop.id);
  context.adminApi = context.connections.shopify.current;
  context.storefrontApi = await getStorefrontClient(context);
  context.currency = (context.request.raw.headers["x-app-currency"] as string)?.toUpperCase();
};

/**
 * Extract logged-in customer ID
 */
const extractCustomer = (context: BrushContext) => {
  const { logged_in_customer_id: id } = context.query as { logged_in_customer_id?: string };
  context.customerGid = id ? `gid://shopify/Customer/${id}` : undefined;
};

/**
 * Extract localization info from headers
 */
const extractLocalization = (context: BrushContext) => {
  context.country = (context.request.raw.headers["x-app-country"] as string)?.toUpperCase();
  context.locale = (context.request.raw.headers["x-app-locale"] as string)?.toUpperCase();
};

/**
 * Extract theme info from headers
 */
const extractTheme = (context: BrushContext) => {
  context.themeId = context.request.raw.headers["x-app-theme"] as string;
};

/**
 * Add additional brush config info
 */
const addBrushConfig = (context: BrushContext) => {
  context.brushConfig = {
    value: "Brush config", // Example
  };
};
