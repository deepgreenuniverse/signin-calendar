import express from 'express';
import cors from 'cors';
import signinRouter from './routes/signin.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', signinRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Signin backend running on http://localhost:${PORT}`);
});
