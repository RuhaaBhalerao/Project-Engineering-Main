import express from 'express';

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
// NOTE: Missing CORS headers intentionally (Error 1)

// Generate 1,000 quotes in memory on startup
const quotes = generateQuotes();

function generateQuotes() {
  const quotesArray = [];
  const movies = [
    'The Shawshank Redemption',
    'The Dark Knight',
    'Inception',
    'Pulp Fiction',
    'Forrest Gump',
    'The Matrix',
    'Titanic',
    'Avatar',
    'Avengers: Endgame',
    'The Lion King',
  ];
  
  const quoteTexts = [
    'Get busy living, or get busy dying.',
    'I am Batman.',
    'It\'s not a lie, it\'s a complex truth.',
    'Say what again?',
    'Life is like a box of chocolates.',
    'There is no spoon.',
    'I\'m the king of the world!',
    'I see you.',
    'Avengers, assemble!',
    'Hakuna Matata.',
  ];

  for (let i = 0; i < 1000; i++) {
    quotesArray.push({
      id: i + 1,
      text: quoteTexts[i % quoteTexts.length],
      movie: movies[i % movies.length],
      author: `Author ${i + 1}`,
    });
  }
  
  return quotesArray;
}

// Endpoint 1: Get all quotes (unpaginated) - Returns full payload
app.get('/api/quotes/unpaginated', (req, res) => {
  // NOTE: Synchronous blocking - heavy computation (Error 4)
  const start = Date.now();
  while (Date.now() - start < 50) {
    // Intentional busy-wait to simulate blocking work
    Math.sqrt(Math.random());
  }
  
  // NOTE: No chunked transfer encoding (Error 2)
  res.json(quotes);
});

// Endpoint 2: Get paginated quotes
app.get('/api/quotes', (req, res) => {
  // NOTE: No input validation (Error 5)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  // NOTE: Off-by-one error in pagination (Error 3)
  const startIndex = (page - 1) * limit + 1; // Bug: should be * limit, not +1
  const endIndex = page * limit + 1;
  
  const paginatedQuotes = quotes.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(quotes.length / limit);
  
  res.json({
    data: paginatedQuotes,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalPages: totalPages,
      total: quotes.length,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

// Endpoint 3: Add to favorites (POST)
app.post('/api/favorites', (req, res) => {
  // NOTE: No input validation (Error 5)
  const { quoteId } = req.body;
  
  // Simulated storage (in real app, would persist)
  // NOTE: Synchronous blocking could occur here too
  const delay = 20;
  const start = Date.now();
  while (Date.now() - start < delay) {
    Math.sqrt(Math.random());
  }
  
  res.json({
    success: true,
    quoteId: quoteId,
    message: 'Quote added to favorites',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Movie Quote API running on http://localhost:${PORT}`);
  console.log(`Total quotes in memory: ${quotes.length}`);
});
