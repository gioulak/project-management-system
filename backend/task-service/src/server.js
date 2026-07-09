const app = require('./app');
const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log(`🚀 Task Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
