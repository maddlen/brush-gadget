import { shopifyApiProject, ApiType } from "@shopify/api-codegen-preset";

const API_VERSION = "2025-10";

export default {
  projects: {
    // To produce variable / return types for Admin API operations
    default: shopifyApiProject({
      apiType: ApiType.Admin,
      apiVersion: API_VERSION,
      documents: [],
      outputDir: "./_brush/shopify-types",
    }),
    storefront: shopifyApiProject({
      apiType: ApiType.Storefront,
      apiVersion: API_VERSION,
      documents: [],
      outputDir: "./_brush/shopify-types",
    }),
  },
};
