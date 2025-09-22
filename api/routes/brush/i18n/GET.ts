import { i18n } from "../../../../_brush";
import { BrushContext } from "../../../../_brush/types";
import { RouteHandler } from "gadget-server";

const handler: RouteHandler = async (context: BrushContext) => {
  return context.reply.send(await i18n.getTranslations(context));
};

export default handler;
