import { ShopifyShopRecord } from ".gadget/client/types";
import { BrushContext } from "../types";

export const makeShop = async (context: BrushContext): Promise<ShopifyShopRecord> => {
  const requestShop = context.connections.shopify.currentShopDomain;
  const shopifyShop = await context.api.shopifyShop.findFirst({
    filter: {
      myshopifyDomain: {
        equals: requestShop,
      },
    },
  });

  return shopifyShop;
};