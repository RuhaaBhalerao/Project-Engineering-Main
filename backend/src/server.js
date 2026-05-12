import express from "express";
import { PrismaClient } from "@prisma/client";
// NOTE: Compression middleware is NOT imported - Bug #4: No Compression
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// CORS middleware (missing compression - this is intentional bug)
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};
app.use(cors(corsOptions));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// FIX #1: N+1 Query Problem (FIXED)
// Using Prisma select with explicit batching instead of include
// BUG #2: No Pagination
// BUG #3: Over-fetching (returns all columns including large description)
app.get("/api/missions", async (req, res) => {
  try {
    // NOTE: No pagination parameters - Bug #2
    // NOTE: Fetches ALL columns including description - Bug #3
    // FIX #1: Using select for optimized query batching
    const missions = await prisma.mission.findMany({
      select: {
        id: true,
        name: true,
        launchDate: true,
        status: true,
        rocket: true,
        description: true, // Still fetching for now, will trim in step 3
        crew: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        logs: {
          select: {
            id: true,
            timestamp: true,
            event: true,
            details: true
          }
        }
      }
    });

    res.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    res.status(500).json({ error: "Failed to fetch missions" });
  }
});

// Delete mission endpoint
app.delete("/api/missions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mission.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting mission:", error);
    res.status(500).json({ error: "Failed to delete mission" });
  }
});

// Search endpoint (FIX #1 applied)
app.get("/api/missions/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    // FIX #1: Using select for optimized query batching
    const missions = await prisma.mission.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        name: true,
        launchDate: true,
        status: true,
        rocket: true,
        description: true,
        crew: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        logs: {
          select: {
            id: true,
            timestamp: true,
            event: true,
            details: true
          }
        }
      }
    });
    res.json(missions);
  } catch (error) {
    console.error("Error searching missions:", error);
    res.status(500).json({ error: "Failed to search missions" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Mission Control API running on port ${PORT}`);
  console.log(`📊 Visit http://localhost:${PORT}/api/health to check status`);
});
