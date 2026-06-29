'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronDown, Calendar, LogIn, Menu, X, BarChart3, TrendingUp, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/NotificationCenter';
import { GlobalSearch } from '@/components/GlobalSearch';
import { sportsOptions } from '@/lib/mockData';

// Dynamic import for WalletConnectButton to avoid hydration mismatch
const WalletConnectButton = dynamic(
  () => import('@/components/ui/WalletConnectButton').then(mod => ({ default: mod.WalletConnectButton })),
  { ssr: false, loading: () => <div className="w-24 h-10 bg-primary/10 rounded-lg animate-pulse" /> }
);

interface HeaderProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

export function Header({ selectedSport, onSportChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSportMenu, setShowSportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-background to-background/80 backdrop-blur-md border-b border-primary/20 w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              KADI
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Sports Analytics
            </span>
          </div>

          {/* Global Search - Tablet & Desktop */}
          <div className="hidden md:block flex-1 max-w-xs lg:max-w-md mx-3 lg:mx-6">
            <GlobalSearch />
          </div>

          {/* Sport Tabs - Tablet & Desktop */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowSportMenu(!showSportMenu)}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-card/50 hover:bg-card text-foreground border border-primary/30 hover:border-primary/60 transition-all text-sm"
              >
                <span className="font-medium hidden xl:inline">
                  {sportsOptions.find((o) => o.value === selectedSport)?.label}
                </span>
                <ChevronDown size={16} className={`transition-transform ${showSportMenu ? 'rotate-180' : ''}`} />
              </button>
              {showSportMenu && (
                <div className="absolute top-full left-0 mt-2 bg-card border border-primary/30 rounded-lg shadow-xl overflow-hidden z-50">
                  {sportsOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSportChange(option.value);
                        setShowSportMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        selectedSport === option.value
                          ? 'bg-primary/20 text-primary font-semibold'
                          : 'hover:bg-card-foreground/10 text-foreground'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/30 text-sm">
              <Calendar size={16} className="text-secondary flex-shrink-0" />
              <span className="hidden lg:inline font-medium text-foreground">Today</span>
            </div>
            
            <NotificationCenter />

            {/* Desktop Tools - Hidden on mobile */}
            <Link
              href="/bankroll"
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors text-sm font-medium"
            >
              <Zap size={16} />
              <span>Bankroll</span>
            </Link>

            <Link
              href="/watchlist"
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 transition-colors text-sm font-medium"
            >
              <TrendingUp size={16} />
              <span>Watchlist</span>
            </Link>

            <Link
              href="/history"
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 transition-colors text-sm font-medium"
            >
              <BarChart3 size={16} />
              <span>History</span>
            </Link>

            {/* Wallet Connect - Replaces traditional Sign In */}
            <WalletConnectButton />

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-card rounded-lg transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-primary/20 space-y-2 pb-4">
            {/* Sport Options */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 mb-2">Sports</p>
              {sportsOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSportChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedSport === option.value
                      ? 'bg-primary/20 text-primary font-semibold'
                      : 'hover:bg-card text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Mobile Tools */}
            <div className="border-t border-primary/20 pt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 mb-2">Tools</p>
              <Link
                href="/bankroll"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-card text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Zap size={16} className="text-primary" />
                <span>Bankroll Manager</span>
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-card text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Users size={16} className="text-secondary" />
                <span>Community</span>
              </Link>
              <Link
                href="/watchlist"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-card text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <TrendingUp size={16} className="text-accent" />
                <span>Watchlist</span>
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-card text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 size={16} className="text-accent" />
                <span>History</span>
              </Link>
              <div className="pt-2">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
