import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// example — later you'll move plants data here
app.get('/api/plants', (req, res) => {
  res.json({ message: 'Plants route works!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});