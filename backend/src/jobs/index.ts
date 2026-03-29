import { logger } from '../utils/logger';
import { runSchedulePublisher } from './schedulePublisher.job';
import { runTrendingUpdater } from './trendingUpdater.job';

export function startJobs() {
  logger.info('🔄 Starting background jobs...');

  // Schedule Publisher — প্রতি মিনিটে চলবে
  runSchedulePublisher();
  setInterval(runSchedulePublisher, 60 * 1000);

  // Trending Updater — প্রতি ১০ মিনিটে চলবে
  runTrendingUpdater();
  setInterval(runTrendingUpdater, 10 * 60 * 1000);

  logger.info('✅ Background jobs started');
}