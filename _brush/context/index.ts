import { FastifyRequest } from "fastify";
import { AmbientContext } from "gadget-server";
import Shopify from "shopify-api-node";
import Cache from "../cache";
import { BrushContext } from "../types";
import { authenticateAppProxy } from "./app-proxy";
import { makeShop } from "./current-shop";
import { GET_LIVE_THEME } from "./graphql/queries";
import { getStorefrontClient } from "./storefront";

/**
 * Main enrichment function
 */
export const enrichBrushContext = async (context: FastifyRequest | AmbientContext): Promise<BrushContext> => {
  const brushContext: BrushContext = context as BrushContext;
  authenticateIfFrontend(brushContext);
  switchToAdminApi(brushContext);
  await setupShopifyConnections(brushContext);
  extractCustomer(brushContext);
  extractLocalization(brushContext);
  await extractTheme(brushContext);

  return brushContext;
};

/**
 * Validate the request source and authenticate if needed
 */
const authenticateIfFrontend = (context: BrushContext) => {
  // If there is a trigger, we are in a Gadget action context, so no need to authenticate frontend
  if (context.trigger) return;

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
  context.adminApi = await makeAdminApi(context);
  context.storefrontApi = await getStorefrontClient(context);
  context.currency =
    (context.request?.raw?.headers["x-app-currency"] as string)?.toUpperCase() ??
    context.shopifyShop.currency;
};

/**
 * Make adminAPI for current shop
 */
const makeAdminApi = async (context: BrushContext) => {
  const cacheKey = `adminApi_${context.connections.shopify.currentShopId}`;
  const cached = Cache.get<Shopify>(cacheKey);

  if (cached) return cached;

  const adminApi = await context.connections.shopify.forShopId(context.shopifyShop!.id);
  Cache.set<Shopify>(cacheKey, adminApi);

  return adminApi;
};

/**
 * Extract logged-in customer ID
 */
const extractCustomer = (context: BrushContext) => {
  const id = (context.query as any)?.logged_in_customer_id;
  context.customerGid = id ? `gid://shopify/Customer/${id}` : undefined;
};

/**
 * Extract localization info from headers
 */
const extractLocalization = (context: BrushContext) => {
  context.country =
    (context.request?.raw?.headers["x-app-country"] as string)?.toUpperCase() ??
    context.shopifyShop.countryCode;
  context.locale = (context.request?.raw?.headers["x-app-locale"] as string)?.toUpperCase() ?? "EN";
};

/**
 * Extract theme info from headers
 */
const extractTheme = async (context: BrushContext) => {
  let themeId = (context.request?.raw?.headers["x-app-theme"] as string) ?? undefined;
  if (!themeId) {
    const res = await context.adminApi.graphql(GET_LIVE_THEME);
    themeId = res.themes.nodes[0].id.split("/").pop() || undefined;
  }
  context.themeId = themeId;
};
