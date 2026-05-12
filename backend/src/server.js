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
// FIX #2: Add Pagination (FIXED)
// BUG #3: Over-fetching (returns all columns including large description)
app.get("/api/missions", async (req, res) => {
  try {
    // FIX #2: Extract pagination parameters with defaults
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20)); // Max 100 per page
    const skip = (page - 1) * limit;

    // FIX #2: Get total count for metadata
    const total = await prisma.mission.count();
    const totalPages = Math.ceil(total / limit);
    
    // FIX #1: Using select for optimized query batching
    // FIX #2: Using skip/take for pagination
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
      },
      skip,
      take: limit,
      orderBy: { id: 'asc' }
    });

    // FIX #2: Return paginated response with metadata
    res.json({
      data: missions,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
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
