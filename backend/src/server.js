import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// BUG #1: NO PAGINATION - Returns all 300+ scores at once, ignoring page/limit
// BUG #2: OVER-FETCHING - Returns strategyNote field that frontend never uses in list view
// BUG #3: NO COMPRESSION - Raw JSON without gzip
app.get('/api/scores', async (req, res) => {
  try {
    // BUG #1: Not implementing pagination at all
    // const { page = 1, limit = 20 } = req.query;
    // const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const scores = await prisma.score.findMany({
      // BUG #2: Returning ALL fields including strategyNote
      // Should use select to exclude strategyNote
      orderBy: { score: 'desc' },
      // No pagination!
    });

    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scores/:id', async (req, res) => {
  try {
    const score = await prisma.score.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const { game, player, score, strategyNote } = req.body;
    const newScore = await prisma.score.create({
      data: { game, player, score: parseInt(score), strategyNote },
    });
    res.json(newScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/scores/:id', async (req, res) => {
  try {
    await prisma.score.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
