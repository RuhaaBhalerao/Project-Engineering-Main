const express = require('express');
require('dotenv').config();

const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/bookings', bookingsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`QuickSeat server running on http://localhost:${PORT}`);
});