// analytics.service.js
const analyticsRepo = require('./analytics.repository');

class AnalyticsService {
  async getDashboardAnalytics(userId, days = 7) {
    const overview = await analyticsRepo.getOverviewMetrics(userId);
    const clicksByDay = await analyticsRepo.getClicksByDay(userId, days);
    const referrers = await analyticsRepo.getTopReferrers(userId);
    const devices = await analyticsRepo.getDeviceBreakdown(userId);
    const countries = await analyticsRepo.getCountryBreakdown(userId);

    // Calculate percentages
    const totalReferrerCount = referrers.reduce((acc, r) => acc + parseInt(r.count, 10), 0) || 1;
    const formattedReferrers = referrers.map((r) => ({
      ...r,
      count: parseInt(r.count, 10),
      percentage: Math.round((parseInt(r.count, 10) / totalReferrerCount) * 100),
    }));

    const totalDeviceCount = devices.reduce((acc, d) => acc + parseInt(d.count, 10), 0) || 1;
    const formattedDevices = devices.map((d) => ({
      ...d,
      count: parseInt(d.count, 10),
      percentage: Math.round((parseInt(d.count, 10) / totalDeviceCount) * 100),
    }));

    return {
      ...overview,
      clicksByDay,
      referrers: formattedReferrers,
      devices: formattedDevices,
      countries,
    };
  }
}

module.exports = new AnalyticsService();

