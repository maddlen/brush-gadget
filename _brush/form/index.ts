import { ZodType, ZodError } from "zod";
import { BrushContext } from "../types";

export const validate = <TSchema extends ZodType>(context: BrushContext, schema: TSchema) => {
  const result = schema.safeParse(context.body);

  if (result.success) {
    return { valid: true, errors: {} as Record<string, string[]> };
  }

  const errors = result.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const field = issue.path[0]?.toString() ?? "unknown";
    (acc[field] ??= []).push(issue.message);
    return acc;
  }, {});

  return { valid: false, errors };
};
