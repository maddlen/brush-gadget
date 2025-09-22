import { Context } from "../../../_brush";
import type { Server } from "gadget-server";

export default async function (server: Server) {
  let inFlightPromise: Promise<any> | null = null;

  server.addHook("preHandler", async (context) => {
    try {
      // Debounce to make sure that concurrent requests do not overlap causing DB data corruption
      // Ex: 2 Storefront API access tokens for the same shop
      if (!inFlightPromise) {
        inFlightPromise = Context.enrichBrushContext(context).finally(() => {
          inFlightPromise = null; 
        });
      }

      return await inFlightPromise;
    } catch (e: any) {
      context.logger.error({ error: e as Error }, e.message);
      if (!context.reply.sent) {
        await context.reply.code(500).send("Error - please see logs.");
      }
    }
  });
}
