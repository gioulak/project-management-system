const app = require('./app');
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Team Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
