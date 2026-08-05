import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      // Do not reassign query or params as they are read-only in Express
      return next();
    } catch (error) {
      if (error instanceof ZodError || (error as any)?.name === "ZodError") {
        const issues = (error as any).issues || (error as any).errors || [];
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Erreur de validation",
            details: issues.map((e: any) => ({
              path: e.path ? e.path.join(".") : "",
              message: e.message,
            })),
          },
        });
      }
      console.error("Validation Middleware Error:", error);
      return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Erreur interne" } });
    }
  };
};
