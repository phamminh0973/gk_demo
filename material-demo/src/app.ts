import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { AppError } from "./common/http-error";
import { materialRouter } from "./material/material.controller";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    module: "material",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/materials", materialRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
);
