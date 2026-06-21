'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Calendar, LogIn, Menu, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/NotificationCenter';
import { sportsOptions } from '@/lib/mockData';

interface HeaderProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

export function Header({ selectedSport, onSportChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSportMenu, setShowSportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-background to-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              KADI
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Sports Analytics
            </span>
          </div>

          {/* Sport Tabs - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setShowSportMenu(!showSportMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 hover:bg-card text-foreground border border-primary/30 hover:border-primary/60 transition-all"
              >
                <span className="text-sm font-medium">
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
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/30">
              <Calendar size={16} className="text-secondary" />
              <span className="text-sm font-medium text-foreground">Today</span>
            </div>
            <NotificationCenter />
            <Link
              href="/history"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 transition-colors text-sm font-medium"
            >
              <BarChart3 size={16} />
              <span>History</span>
            </Link>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 hidden sm:inline-flex"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </Button>
            <button className="md:hidden p-2 rounded-lg hover:bg-card">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary/20 space-y-2">
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
        )}
      </div>
    </header>
  );
}
