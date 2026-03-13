import { NextFunction, Request, Response, Router } from "express";
import { MaterialRepository } from "./material.repository";
import { MaterialService } from "./material.service";

const materialRepository = new MaterialRepository();
const materialService = new MaterialService(materialRepository);

export const materialRouter = Router();

const asString = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] : value ?? "";

materialRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const type = typeof req.query.type === "string" ? req.query.type : undefined;

    const data = materialService.list({ q, type });
    res.json({ data, count: data.length });
  } catch (error) {
    next(error);
  }
});

materialRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = materialService.getById(asString(req.params.id));
    res.json(data);
  } catch (error) {
    next(error);
  }
});

materialRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = materialService.create(req.body as Record<string, unknown>);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

materialRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = materialService.update(
      asString(req.params.id),
      req.body as Record<string, unknown>
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

materialRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    materialService.remove(asString(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
