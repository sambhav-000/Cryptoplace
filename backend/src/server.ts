import app from './app.js';
import { prisma } from './prisma.js';
import { startAlertEvaluatorJob } from './jobs/alertEvaluator.job.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 CryptoPlace Pro Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check endpoint: http://localhost:${PORT}/api/health`);
  
  // Start background workers
  startAlertEvaluatorJob();
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database disconnected. Process exited.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

