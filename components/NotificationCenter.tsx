'use client';

import { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, Zap, TrendingUp } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'alert' | 'prediction' | 'odds_change';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications?: Notification[];
}

export function NotificationCenter({ notifications: initialNotifications = [] }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Mock: Simulate receiving notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'prediction',
        title: 'High Confidence Prediction',
        message: 'Manchester United vs Liverpool - 78% confidence, odds: 1.85',
        timestamp: new Date(Date.now() - 5 * 60000), // 5 mins ago
        read: false,
      },
      {
        id: '2',
        type: 'odds_change',
        title: 'Odds Update',
        message: 'Real Madrid vs Barcelona odds changed from 2.95 to 3.10',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 mins ago
        read: false,
      },
      {
        id: '3',
        type: 'alert',
        title: 'Match Starting Soon',
        message: 'Arsenal vs Chelsea starts in 30 minutes',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 mins ago
        read: true,
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Zap className="w-4 h-4 text-primary" />;
      case 'odds_change':
        return <TrendingUp className="w-4 h-4 text-accent" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-secondary" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-primary/20 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-card border border-primary/30 rounded-xl shadow-2xl backdrop-blur-sm z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/20">
            <h3 className="font-bold text-foreground">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{notification.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">{formatTime(notification.timestamp)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-1 hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors border-t border-primary/20"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
