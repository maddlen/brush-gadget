import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "storefront" model, go to https://bnatshop.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "A_4MZdAW2VzK",
  fields: {
    publicAccessToken: {
      type: "string",
      validations: { required: true },
      storageKey: "-E9KE3LYaVQQ",
      filterIndex: false,
      searchIndex: false,
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "SGvBcXqenxDY",
      searchIndex: false,
    },
  },
  searchIndex: false,
};
