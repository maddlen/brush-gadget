import { ShopifyShopRecord } from "../../.gadget/client";
import { BrushContext } from "../types";
import Cache from "../cache";

export const makeShop = async (context: BrushContext): Promise<ShopifyShopRecord> => {
  const cacheKey = `shopifyShop_${context.connections.shopify.currentShopId}`;
  const cached = Cache.get<ShopifyShopRecord>(cacheKey);

  if (cached) return cached;

  const requestShop = context.connections.shopify.currentShopDomain;
  const shopifyShop = await context.api.shopifyShop.findFirst({
    filter: {
      myshopifyDomain: {
        equals: requestShop,
      },
    },
  });

  if (!shopifyShop) {
    throw new Error(`Shop not found for domain: ${requestShop}`);
  }

  Cache.set<ShopifyShopRecord>(cacheKey, shopifyShop);
  return shopifyShop;
};
