import { z } from "zod";
export const credentials = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});
export const taskCreate = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).nullable().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});
export const taskPatch = taskCreate
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );
export const taskQuery = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  sort: z
    .enum(["created_at", "updated_at", "title", "priority", "status"])
    .default("updated_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const taskId = z.object({ id: z.string().uuid() });
export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success)
      return res
        .status(400)
        .json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request",
            details: result.error.flatten().fieldErrors,
          },
        });
    req[source] = result.data;
    next();
  };
}
