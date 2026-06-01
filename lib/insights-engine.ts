/**
 * Rule-Based Insights Engine
 * Generates contextual observations based on activity data
 */

interface DailyStats {
  keyboardPresses: number;
  tabsOpened: number;
  browsingTimeMinutes: number;
  sessionDurationMinutes: number;
}

export interface Insight {
  text: string;
  category: 'keyboard' | 'tabs' | 'browsing' | 'session' | 'pattern';
  emoji: string;
}

export function generateInsights(stats: DailyStats): Insight[] {
  const insights: Insight[] = [];

  // Keyboard insights
  if (stats.keyboardPresses > 15000) {
    insights.push({
      text: `You typed ${Math.round(stats.keyboardPresses / 1000)}K times today. Keyboard warrior! 🎮`,
      category: 'keyboard',
      emoji: '⌨️',
    });
  } else if (stats.keyboardPresses > 8000) {
    insights.push({
      text: `${Math.round(stats.keyboardPresses / 1000)}K keyboard presses - solid productivity day!`,
      category: 'keyboard',
      emoji: '⌨️',
    });
  } else if (stats.keyboardPresses > 3000) {
    insights.push({
      text: `${Math.round(stats.keyboardPresses / 1000)}K presses - a moderate typing day.`,
      category: 'keyboard',
      emoji: '⌨️',
    });
  } else if (stats.keyboardPresses > 0) {
    insights.push({
      text: 'Light typing day - mostly passive browsing?',
      category: 'keyboard',
      emoji: '⌨️',
    });
  }

  // Tab insights
  if (stats.tabsOpened > 100) {
    insights.push({
      text: `${stats.tabsOpened} tabs opened. That's tab hoarding at its finest! 📑`,
      category: 'tabs',
      emoji: '📑',
    });
  } else if (stats.tabsOpened > 50) {
    insights.push({
      text: `${stats.tabsOpened} tabs - juggling multiple interests today.`,
      category: 'tabs',
      emoji: '📑',
    });
  } else if (stats.tabsOpened > 20) {
    insights.push({
      text: `${stats.tabsOpened} tabs opened - focused browsing session.`,
      category: 'tabs',
      emoji: '📑',
    });
  }

  // Browsing time insights
  if (stats.browsingTimeMinutes > 480) {
    insights.push({
      text: `${Math.round(stats.browsingTimeMinutes / 60)}h of browsing. That's a full workday! 🌐`,
      category: 'browsing',
      emoji: '🌐',
    });
  } else if (stats.browsingTimeMinutes > 240) {
    insights.push({
      text: `${Math.round(stats.browsingTimeMinutes / 60)}h online - significant screen time.`,
      category: 'browsing',
      emoji: '🌐',
    });
  } else if (stats.browsingTimeMinutes > 60) {
    insights.push({
      text: `${Math.round(stats.browsingTimeMinutes / 60)}h of active browsing.`,
      category: 'browsing',
      emoji: '🌐',
    });
  }

  // Session insights
  if (stats.sessionDurationMinutes > 240) {
    insights.push({
      text: `${Math.round(stats.sessionDurationMinutes / 60)}h session - marathon mode activated! 💪`,
      category: 'session',
      emoji: '⏱️',
    });
  } else if (stats.sessionDurationMinutes > 120) {
    insights.push({
      text: `${Math.round(stats.sessionDurationMinutes / 60)}h continuous session - impressive focus!`,
      category: 'session',
      emoji: '⏱️',
    });
  } else if (stats.sessionDurationMinutes > 30) {
    insights.push({
      text: `${Math.round(stats.sessionDurationMinutes / 60)}h session - good focused work.`,
      category: 'session',
      emoji: '⏱️',
    });
  }

  // Pattern insights
  const avgKeyPerTab = stats.tabsOpened > 0 ? stats.keyboardPresses / stats.tabsOpened : 0;

  if (avgKeyPerTab > 200) {
    insights.push({
      text: 'Deep work mode - lots of typing per tab. You were in the zone! 🎯',
      category: 'pattern',
      emoji: '🎯',
    });
  } else if (avgKeyPerTab < 50 && stats.tabsOpened > 20) {
    insights.push({
      text: 'Research mode - lots of tabs, light typing. Information gathering? 🔍',
      category: 'pattern',
      emoji: '🔍',
    });
  }

  // Time-based patterns
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) {
    if (stats.keyboardPresses > 5000) {
      insights.push({
        text: 'Night owl mode detected! 🌙 Working late?',
        category: 'pattern',
        emoji: '🌙',
      });
    }
  } else if (hour >= 6 && hour < 9) {
    if (stats.keyboardPresses > 3000) {
      insights.push({
        text: 'Early bird! Getting a head start on the day. 🌅',
        category: 'pattern',
        emoji: '🌅',
      });
    }
  }

  return insights;
}

export function getInsightColor(category: Insight['category']): string {
  const colors = {
    keyboard: '#7C3AED',
    tabs: '#06B6D4',
    browsing: '#22C55E',
    session: '#F97316',
    pattern: '#EC4899',
  };
  return colors[category];
}
