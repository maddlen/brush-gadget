import { StorefrontApiClient } from "@shopify/storefront-api-client";
import { FastifyBaseLogger, FastifyRequest, RouteGenericInterface } from "fastify";
import { TriggerWithType } from "gadget-server";
import Shopify from "shopify-api-node";
import { ShopifyShopRecord } from "../.gadget/client";

declare module "fastify" {
  interface FastifyRequest {
    shopifyShop: ShopifyShopRecord;
    adminApi: Shopify;
    storefrontApi: StorefrontApiClient;
    country: string;
    locale: string;
    currency: string;
  }
}

type BrushContext<R extends RouteGenericInterface = {}> = FastifyRequest<R> & {
  shopifyShop: ShopifyShopRecord;
  adminApi: Shopify;
  storefrontApi: StorefrontApiClient;
  trigger?: TriggerWithType<"api"> | TriggerWithType<"background-action"> | TriggerWithType<"scheduler">;
  customerGid?: string;
  country: string;
  locale: string;
  currency: string;
  themeId?: string;
  logger: FastifyBaseLogger;
};
