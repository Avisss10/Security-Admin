// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cabangRoutes = require('./routes/cabangRoutes');
const laporanRoutes = require('./routes/laporanRoutes');



// Middleware
app.use(cors());
app.use(express.json());

// Route
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cabang', cabangRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/uploads', express.static('uploads'));





// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});



