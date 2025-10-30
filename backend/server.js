// Connect to MongoDB
import connectDB from './config/db.js';

dotenv.config();

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })

  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });