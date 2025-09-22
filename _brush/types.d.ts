import { ShopifyShopRecord } from ".gadget/client/types";
import { StorefrontApiClient } from "@shopify/storefront-api-client";
import { FastifyRequest, RouteGenericInterface } from "fastify";
import Shopify from "shopify-api-node";

declare module "fastify" {
  interface FastifyRequest {
    brushConfig?: Record<string, any>;
  }
}

type BrushContext<R extends RouteGenericInterface = {}> = FastifyRequest<R> & {
  shopifyShop?: ShopifyShopRecord;
  adminApi?: Shopify;
  storefrontApi?: StorefrontApiClient;
  customerGid?: string;
  country?: string;
  locale?: string;
  currency?: string;
  themeId?: string;
};
