import { notificationService, NotificationResponse } from './notificationService';
import analyticsService from './analyticsService';

// Enhanced notification with behavioral insights
interface SmartNotification extends NotificationResponse {
  priority_score?: number;
  optimal_timing?: string;
  engagement_context?: {
    user_activity_level: 'low' | 'medium' | 'high';
    preferred_times: string[];
    interaction_history: {
      job_views_today: number;
      applications_today: number;
      last_active: string;
    };
  };
}

interface NotificationTiming {
  send_at: string;
  priority_score: number;
  reasoning: string[];
  personalization_factors: {
    user_timezone: string;
    activity_pattern: 'morning' | 'afternoon' | 'evening' | 'night';
    engagement_level: 'high' | 'medium' | 'low';
  };
}

interface BehavioralContext {
  recent_job_views: number;
  avg_session_duration: number;
  preferred_job_categories: string[];
  application_rate: number;
  peak_activity_hours: number[];
  journey_stage: 'explorer' | 'focused' | 'decisive';
  notification_response_rate: number;
}

class SmartNotificationService {
  private readonly MAX_DAILY_NOTIFICATIONS = 5;
  private readonly QUIET_HOURS_START = 22; // 10 PM
  private readonly QUIET_HOURS_END = 7; // 7 AM

  // Get user's behavioral context for notification optimization
  async getBehavioralContext(userId: string): Promise<BehavioralContext> {
    try {
      // This would integrate with the behavioral tracking service
      const response = await fetch(`/api/v1/behavior/context`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          recent_job_views: data.recent_views?.length || 0,
          avg_session_duration: data.engagement_metrics?.average_time_per_job_seconds || 0,
          preferred_job_categories: this.extractPreferredCategories(data.search_patterns),
          application_rate: data.engagement_metrics?.application_rate || 0,
          peak_activity_hours: this.extractPeakHours(data.weekly_engagement),
          journey_stage: data.journey_stage || 'explorer',
          notification_response_rate: this.calculateNotificationResponseRate(data)
        };
      }

      // Fallback context
      return {
        recent_job_views: 0,
        avg_session_duration: 0,
        preferred_job_categories: [],
        application_rate: 0,
        peak_activity_hours: [9, 14, 19], // Default peak hours
        journey_stage: 'explorer',
        notification_response_rate: 0.3
      };
    } catch (error) {
      console.error('Failed to get behavioral context:', error);
      return {
        recent_job_views: 0,
        avg_session_duration: 0,
        preferred_job_categories: [],
        application_rate: 0,
        peak_activity_hours: [9, 14, 19],
        journey_stage: 'explorer',
        notification_response_rate: 0.3
      };
    }
  }

  // Calculate optimal notification timing based on user behavior
  async calculateOptimalTiming(
    notificationType: string, 
    urgency: 'low' | 'medium' | 'high',
    userId: string
  ): Promise<NotificationTiming> {
    const context = await this.getBehavioralContext(userId);
    const now = new Date();
    const currentHour = now.getHours();

    // Base priority score
    let priorityScore = urgency === 'high' ? 0.9 : urgency === 'medium' ? 0.6 : 0.3;
    const reasoning: string[] = [];

    // Adjust based on user engagement level
    if (context.journey_stage === 'decisive') {
      priorityScore += 0.2;
      reasoning.push('User is in decisive journey stage');
    } else if (context.journey_stage === 'focused') {
      priorityScore += 0.1;
      reasoning.push('User is in focused journey stage');
    }

    // Adjust based on recent activity
    if (context.recent_job_views > 5) {
      priorityScore += 0.15;
      reasoning.push('High recent engagement with job listings');
    }

    // Adjust based on notification response rate
    priorityScore *= context.notification_response_rate;
    reasoning.push(`Historical response rate: ${(context.notification_response_rate * 100).toFixed(0)}%`);

    // Determine optimal send time
    let optimalHour = currentHour;
    
    // Check if current time is in quiet hours
    if (currentHour >= this.QUIET_HOURS_START || currentHour < this.QUIET_HOURS_END) {
      // Schedule for next business hour
      optimalHour = this.QUIET_HOURS_END;
      reasoning.push('Scheduled outside quiet hours');
    } else {
      // Use peak activity hours if available
      const nextPeakHour = context.peak_activity_hours.find(hour => hour > currentHour);
      if (nextPeakHour && urgency !== 'high') {
        optimalHour = nextPeakHour;
        reasoning.push(`Aligned with user's peak activity at ${nextPeakHour}:00`);
      }
    }

    const sendAt = new Date(now);
    sendAt.setHours(optimalHour, 0, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (sendAt <= now && urgency !== 'high') {
      sendAt.setDate(sendAt.getDate() + 1);
      reasoning.push('Scheduled for next day');
    }

    return {
      send_at: sendAt.toISOString(),
      priority_score: Math.min(priorityScore, 1.0),
      reasoning,
      personalization_factors: {
        user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        activity_pattern: this.determineActivityPattern(context.peak_activity_hours),
        engagement_level: this.determineEngagementLevel(context)
      }
    };
  }

  // Create personalized job recommendation notification
  async createJobRecommendationNotification(
    userId: string, 
    jobId: string, 
    jobTitle: string, 
    matchScore: number,
    matchReasons: string[]
  ): Promise<void> {
    const context = await this.getBehavioralContext(userId);
    
    // Only send if user is likely to engage
    if (matchScore < 0.6 || context.notification_response_rate < 0.2) {
      return; // Skip low-quality matches for low-engagement users
    }

    const timing = await this.calculateOptimalTiming('job_match', 'medium', userId);
    
    // Personalize message based on user's journey stage
    let title = 'New Job Match Found';
    let message = `${jobTitle} matches ${Math.round(matchScore * 100)}% of your preferences`;

    if (context.journey_stage === 'decisive') {
      title = '🎯 Perfect Match Alert';
      message = `${jobTitle} is an excellent match with ${Math.round(matchScore * 100)}% compatibility`;
    } else if (context.journey_stage === 'focused') {
      title = '💡 Recommended for You';
      message = `Based on your recent activity, ${jobTitle} could be a great fit (${Math.round(matchScore * 100)}% match)`;
    }

    // Add personalized context from match reasons
    if (matchReasons.length > 0) {
      message += `. Key matches: ${matchReasons.slice(0, 2).join(', ')}`;
    }

    // Track notification creation
    analyticsService.trackAction('smart_notification_created', 'SmartNotificationService', {
      type: 'job_recommendation',
      match_score: matchScore,
      priority_score: timing.priority_score,
      journey_stage: context.journey_stage,
      optimal_timing: timing.send_at
    });

    // Schedule or send immediately based on timing
    if (timing.priority_score > 0.8 || timing.send_at <= new Date().toISOString()) {
      await this.sendNotification(userId, title, message, 'job_match', jobId);
    } else {
      await this.scheduleNotification(userId, title, message, 'job_match', jobId, timing.send_at);
    }
  }

  // Create application status update notification with contextual timing
  async createApplicationStatusNotification(
    userId: string, 
    applicationId: string, 
    status: 'accepted' | 'rejected' | 'interview' | 'completed',
    jobTitle: string
  ): Promise<void> {
    const urgency = status === 'interview' ? 'high' : status === 'accepted' ? 'high' : 'medium';
    const timing = await this.calculateOptimalTiming('application_update', urgency, userId);

    let title = 'Application Update';
    let message = `Your application for ${jobTitle} has been updated`;
    let emoji = '📋';

    switch (status) {
      case 'accepted':
        title = '🎉 Congratulations!';
        message = `You've been selected for ${jobTitle}! Time to get started.`;
        emoji = '🎉';
        break;
      case 'rejected':
        title = 'Application Status Update';
        message = `Your application for ${jobTitle} wasn't selected this time. Keep applying!`;
        emoji = '💪';
        break;
      case 'interview':
        title = '📞 Interview Scheduled';
        message = `Great news! You have an interview scheduled for ${jobTitle}`;
        emoji = '🎯';
        break;
      case 'completed':
        title = '✅ Project Completed';
        message = `Congratulations on completing ${jobTitle}! Payment is being processed.`;
        emoji = '🏆';
        break;
    }

    await this.sendNotification(userId, title, message, 'application_update', applicationId);

    analyticsService.trackAction('application_status_notification', 'SmartNotificationService', {
      status,
      urgency,
      job_title: jobTitle
    });
  }

  // Create personalized daily digest
  async createDailyDigest(userId: string): Promise<void> {
    const context = await this.getBehavioralContext(userId);
    
    // Skip if user has low engagement
    if (context.notification_response_rate < 0.1) {
      return;
    }

    const timing = await this.calculateOptimalTiming('daily_digest', 'low', userId);
    
    let title = 'Daily Opportunity Digest';
    let message = 'Here are today\'s personalized opportunities';

    // Customize based on journey stage
    if (context.journey_stage === 'decisive') {
      title = '🎯 Your Daily Action Items';
      message = 'High-impact opportunities curated for you';
    } else if (context.journey_stage === 'focused') {
      title = '💡 Today\'s Recommendations';
      message = 'New opportunities matching your focus areas';
    }

    await this.scheduleNotification(userId, title, message, 'daily_digest', 'digest', timing.send_at);
  }

  // Send immediate notification
  private async sendNotification(
    userId: string, 
    title: string, 
    message: string, 
    type: string, 
    referenceId: string
  ): Promise<void> {
    try {
      // Use existing notification service to create the notification
      // This would be handled by the backend notification service
      console.log('Sending smart notification:', { userId, title, message, type });
      
      // Track notification sent
      analyticsService.trackAction('notification_sent', 'SmartNotificationService', {
        type,
        title,
        reference_id: referenceId
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Schedule notification for later
  private async scheduleNotification(
    userId: string, 
    title: string, 
    message: string, 
    type: string, 
    referenceId: string,
    sendAt: string
  ): Promise<void> {
    try {
      // This would integrate with a job queue system (like Redis Queue or similar)
      console.log('Scheduling notification for:', sendAt, { userId, title, message, type });
      
      // For now, store in localStorage as a mock implementation
      const scheduledNotifications = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
      scheduledNotifications.push({
        userId,
        title,
        message,
        type,
        referenceId,
        sendAt,
        created: new Date().toISOString()
      });
      localStorage.setItem('scheduled_notifications', JSON.stringify(scheduledNotifications));
      
      analyticsService.trackAction('notification_scheduled', 'SmartNotificationService', {
        type,
        scheduled_for: sendAt
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  // Helper methods
  private extractPreferredCategories(searchPatterns: any[]): string[] {
    if (!searchPatterns) return [];
    
    const categories: { [key: string]: number } = {};
    searchPatterns.forEach(pattern => {
      if (pattern.filters?.category) {
        categories[pattern.filters.category] = (categories[pattern.filters.category] || 0) + 1;
      }
    });
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  private extractPeakHours(weeklyEngagement: number[]): number[] {
    if (!weeklyEngagement || weeklyEngagement.length === 0) {
      return [9, 14, 19]; // Default hours
    }
    
    // Find hours with engagement above average
    const average = weeklyEngagement.reduce((sum, val) => sum + val, 0) / weeklyEngagement.length;
    const peakHours: number[] = [];
    
    weeklyEngagement.forEach((engagement, hour) => {
      if (engagement > average * 1.2) {
        peakHours.push(hour);
      }
    });
    
    return peakHours.length > 0 ? peakHours : [9, 14, 19];
  }

  private calculateNotificationResponseRate(behaviorData: any): number {
    // This would be calculated from historical notification interaction data
    // For now, return a reasonable default based on engagement
    const engagementScore = behaviorData.engagement_metrics?.engagement_score || 0.3;
    return Math.min(engagementScore * 0.8, 0.9); // Cap at 90%
  }

  private determineActivityPattern(peakHours: number[]): 'morning' | 'afternoon' | 'evening' | 'night' {
    const morningHours = peakHours.filter(h => h >= 6 && h < 12).length;
    const afternoonHours = peakHours.filter(h => h >= 12 && h < 18).length;
    const eveningHours = peakHours.filter(h => h >= 18 && h < 22).length;
    const nightHours = peakHours.filter(h => h >= 22 || h < 6).length;

    const max = Math.max(morningHours, afternoonHours, eveningHours, nightHours);
    
    if (max === morningHours) return 'morning';
    if (max === afternoonHours) return 'afternoon';
    if (max === eveningHours) return 'evening';
    return 'night';
  }

  private determineEngagementLevel(context: BehavioralContext): 'high' | 'medium' | 'low' {
    const score = context.recent_job_views * 0.3 + 
                 context.application_rate * 0.4 + 
                 context.notification_response_rate * 0.3;
    
    if (score > 0.7) return 'high';
    if (score > 0.4) return 'medium';
    return 'low';
  }

  // Get smart notifications with enhanced metadata
  async getSmartNotifications(page: number = 1, limit: number = 20): Promise<SmartNotification[]> {
    try {
      const response = await notificationService.getNotifications(page, limit);
      if (response.success && response.data) {
        // Enhance notifications with smart metadata
        const enhanced = await Promise.all(
          response.data.notifications.map(async (notification) => {
            const context = await this.getBehavioralContext(notification.user_id);
            const timing = await this.calculateOptimalTiming(notification.type, 'medium', notification.user_id);
            
            return {
              ...notification,
              priority_score: timing.priority_score,
              optimal_timing: timing.send_at,
              engagement_context: {
                user_activity_level: this.determineEngagementLevel(context),
                preferred_times: context.peak_activity_hours.map(h => `${h}:00`),
                interaction_history: {
                  job_views_today: context.recent_job_views,
                  applications_today: Math.floor(context.application_rate * context.recent_job_views),
                  last_active: new Date().toISOString()
                }
              }
            } as SmartNotification;
          })
        );
        
        return enhanced;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get smart notifications:', error);
      return [];
    }
  }

  // Process scheduled notifications (would be called by a cron job)
  async processScheduledNotifications(): Promise<void> {
    try {
      const scheduledNotifications = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
      const now = new Date();
      
      const toSend = scheduledNotifications.filter((notif: any) => new Date(notif.sendAt) <= now);
      const remaining = scheduledNotifications.filter((notif: any) => new Date(notif.sendAt) > now);
      
      // Send due notifications
      for (const notification of toSend) {
        await this.sendNotification(
          notification.userId,
          notification.title,
          notification.message,
          notification.type,
          notification.referenceId
        );
      }
      
      // Update stored notifications
      localStorage.setItem('scheduled_notifications', JSON.stringify(remaining));
      
      if (toSend.length > 0) {
        analyticsService.trackAction('scheduled_notifications_processed', 'SmartNotificationService', {
          count: toSend.length
        });
      }
    } catch (error) {
      console.error('Failed to process scheduled notifications:', error);
    }
  }
}

export const smartNotificationService = new SmartNotificationService();
export default smartNotificationService;