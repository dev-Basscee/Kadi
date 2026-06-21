'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  position: 'top' | 'inline';
}

export function AdBanner({ position }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  if (position === 'top') {
    return (
      <div className="bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 border-b border-accent/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-accent">Premium Predictions Unlocked</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get access to exclusive match analysis and VIP predictions
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-2">
            <span className="text-xs font-bold text-accent tracking-wider">SPONSORED</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Maximize Your Winning Streak
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Unlock premium AI predictions with our advanced analytics engine. Get 85% prediction accuracy
            backed by machine learning.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm">
            Learn More →
          </button>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-2 hover:bg-primary/20 rounded-lg transition-colors mt-1"
        >
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
