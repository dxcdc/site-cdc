import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import routes from "./routes/index.js";
import db from "./models/index.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin não permitida pelo CORS"));
  },
}));
app.use(express.json());

// Servir arquivos estáticos de upload local (uploads e fallback em public/assets)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "public/assets")));

// Rota de Diagnóstico & Healthcheck
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "CDC Backend Express API",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: "/api/health",
      api: "/api"
    }
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await db.sequelize.query("SELECT 1");
    return res.json({ status: "ok", service: "cdc-backend", database: "connected" });
  } catch (error) {
    console.error("Falha no healthcheck:", error.message);
    return res.status(503).json({ status: "error", service: "cdc-backend", database: "unavailable" });
  }
});

app.use("/api", (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.method === "POST" && ["/contato", "/candidatura"].includes(req.path)) return next();

  const expectedKey = process.env.API_INTEGRATION_KEY;
  const suppliedKey = req.get("x-api-key");
  if (!expectedKey || !suppliedKey) return res.status(401).json({ error: "Não autorizado" });

  const expected = Buffer.from(expectedKey);
  const supplied = Buffer.from(suppliedKey);
  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  return next();
});

app.use("/api", routes);

app.use((error, req, res, next) => {
  if (error.message === "Origin não permitida pelo CORS") {
    return res.status(403).json({ error: error.message });
  }
  return next(error);
});

export async function connectDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Falha na conexão com o banco:", error.message);
    throw error;
  }
}

export default app;
