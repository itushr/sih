import "dotenv/config"

import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";

import pool from "./config/database.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import eventsRoutes from "./routes/events.route.js"
import standardizationRoutes from "./routes/standardization.route.js";


//config
const PORT = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = isProduction
    ? process.env.ALLOWED_ORIGINS?.split(",") ?? []
    : ["http://localhost:3000", "http://localhost:5173"];


const app = express();


//middlewares
app.disable("x-powered-by");
app.use(helmet());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());


//routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/standardization", standardizationRoutes);


//health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.get("/", (_req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});


//404 handler
app.use((_req, res) => {
    res.status(404).json({
        error: "Not Found",
    });
});


//global error handler
app.use(
    (
        err: Error,
        _req: Request,
        res: Response,
        _next: NextFunction,
    ) => {
        console.error(err);

        res.status(500).json({
            error: "Internal Server Error",
        });
    },
);


//start server
const server = app.listen(PORT, async () => {
    console.log(`
    >> INITIALIZING INTEROP CORE...

     ██████╗ ██████╗ ██████╗ ███████╗
    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
    ██║     ██║   ██║██████╔╝█████╗
    ██║     ██║   ██║██╔══██╗██╔══╝
    ╚██████╗╚██████╔╝██║  ██║███████╗
     ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝

    >> INTEROP CORE IS LIVE!

    >> ENV  :: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}
    >> PORT :: ${PORT}
    >> URL  :: http://localhost:${PORT}

    >> TESTING DATABASE CONNECTION...`
    );

    const result = await pool.query(`
    SELECT
    inet_server_addr() AS host,
    inet_server_port() AS port,
    NOW() AS connected_at
`);

    const { host, port, connected_at } = result.rows[0];

    console.log(`
    >> DATABASE CONNECTION SUCCESSFULL!\n
    >> HOST :: ${host}
    >> PORT :: ${port}
    >> TIME :: ${connected_at}
    `)
});


//graceful shutdown
const shutdown = (signal: string) => {
    console.log(`    >> ${signal} RECIEVED`);

    server.close(() => {
        console.log(`    >> INTEROP CORE TERMINATED!`);
        process.exit(0);
    });

    setTimeout(() => {
        console.error(`    >> INTEROP CORE SHURDOWN --FORCE`);
        process.exit(1);
    }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));