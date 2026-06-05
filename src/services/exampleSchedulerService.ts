import cron, { ScheduledTask } from 'node-cron';
import { logger } from '../utils/logger';

export class ExampleSchedulerService {
  private task: ScheduledTask | null = null;

  start() {
    if (process.env.SCHEDULER_ENABLED !== 'true') {
      logger.info('Scheduler disabled');
      return;
    }

    const cronExpression = process.env.SCHEDULER_CRON || '*/30 * * * *';
    const timezone = process.env.SCHEDULER_TIMEZONE || 'Africa/Nairobi';

    this.task = cron.schedule(cronExpression, async () => {
      logger.info('Example scheduler tick', {
        timestamp: new Date().toISOString()
      });
    }, {
      timezone
    });

    logger.info('Scheduler started', {
      cron: cronExpression,
      timezone
    });
  }

  stop() {
    this.task?.stop();
    this.task = null;
  }
}
