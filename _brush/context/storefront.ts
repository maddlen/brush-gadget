import { createStorefrontApiClient, type StorefrontApiClient } from "@shopify/storefront-api-client";
import { CREATE_STOREFRONT_ACCESS_TOKEN } from "./graphql/mutations";
import { settings as gadgetSettings } from "../../settings.gadget";
import type { BrushContext } from "../types";
import Cache from "../cache";

/**
 * Retrieves or creates a Shopify Storefront API client for the given shop context.
 */
export const getStorefrontClient = async (context: BrushContext): Promise<StorefrontApiClient> => {
  const shopId = context.shopifyShop.id;

  const cacheKey = `publicAccessToken_${context.connections.shopify.currentShopId}`;
  let publicAccessToken = Cache.get<string>(cacheKey);

  if (!publicAccessToken) {
    // Try fetching existing storefront record
    const storefront = await context.api.storefront.maybeFindFirst({
      filter: { shopId: { equals: shopId } },
    });

    // Reuse existing token if available, otherwise create a new one
    publicAccessToken = storefront?.publicAccessToken || (await createStorefrontAccessToken(context));
  }

  // Return initialized Shopify Storefront API client
  return createStorefrontApiClient({
    storeDomain: context.shopifyShop.myshopifyDomain ?? "",
    apiVersion: gadgetSettings.plugins?.connections?.shopify?.apiVersion ?? "latest",
    publicAccessToken,
  });
};

/**
 * Creates a new Storefront Access Token and stores it in the database.
 */
const createStorefrontAccessToken = async (context: BrushContext): Promise<string> => {
  const shop = context.shopifyShop;
  if (!shop?.id || !context.adminApi) {
    throw new Error("Missing required shop or admin API context to create access token.");
  }

  const response = await context.adminApi.graphql(CREATE_STOREFRONT_ACCESS_TOKEN, {
    input: { title: `${shop.name} Storefront Access Token` },
  });

  const accessToken = response?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken;
  if (!accessToken) {
    throw new Error("Failed to create a new Storefront Access Token.");
  }

  await context.api.storefront.create({
    shop: { _link: shop.id },
    publicAccessToken: accessToken,
  });

  return accessToken;
};
