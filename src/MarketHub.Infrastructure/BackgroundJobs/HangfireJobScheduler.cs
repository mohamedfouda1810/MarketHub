using Hangfire;

namespace MarketHub.Infrastructure.BackgroundJobs
{
    public static class HangfireJobScheduler
    {
        public static void ScheduleRecurringJobs()
        {
            // Daily at 1 AM
            RecurringJob.AddOrUpdate<Jobs.GenerateDailyVendorReportJob>(
                "daily-vendor-report",
                job => job.ExecuteAsync(),
                "0 1 * * *");

            // Hourly
            RecurringJob.AddOrUpdate<Jobs.CleanExpiredCartItemsJob>(
                "clean-expired-carts",
                job => job.ExecuteAsync(),
                "0 * * * *");

            // Every 6 hours
            RecurringJob.AddOrUpdate<Jobs.SendLowStockAlertsJob>(
                "low-stock-alerts",
                job => job.ExecuteAsync(),
                "0 */6 * * *");
        }
    }
}