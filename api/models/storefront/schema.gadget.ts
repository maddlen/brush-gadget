import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "storefront" model, go to https://brush.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "lPxoQb8XDQfa",
  fields: {
    publicAccessToken: {
      type: "string",
      validations: { required: true },
      storageKey: "CRdXAin3178k",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "NBuE590Cyqdj",
    },
  },
};
