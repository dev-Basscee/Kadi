'use client';

import { useState } from 'react';
import { Match, BetRecord } from '@/lib/mockData';
import {
  generateShareLink,
  copyToClipboard,
  generatePredictionSummary,
  exportWatchlistAsJSON,
  downloadAsJSON,
  generateBettingHistoryHTML,
  downloadAsHTML,
  shareToSocialMedia,
} from '@/lib/exportUtils';
import { Share2, Download, Copy, Check, MessageCircle, Send } from 'lucide-react';

interface ExportShareProps {
  matches?: Match[];
  records?: BetRecord[];
  title?: string;
}

export function ExportShare({ matches = [], records = [], title = 'Export Data' }: ExportShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async () => {
    if (matches.length === 0) return;

    const shareUrl = generateShareLink(matches);
    const success = await copyToClipboard(shareUrl);

    if (success) {
      setCopied(true);
      setShareSuccess(true);
      setTimeout(() => {
        setCopied(false);
        setShareSuccess(false);
      }, 2000);
    }
  };

  const handleExportJSON = () => {
    if (matches.length === 0) return;
    const jsonData = exportWatchlistAsJSON(matches);
    downloadAsJSON(jsonData, `kadi-watchlist-${new Date().getTime()}.json`);
  };

  const handleExportBettingHistory = () => {
    if (records.length === 0) return;
    const html = generateBettingHistoryHTML(records);
    downloadAsHTML(html, `kadi-betting-history-${new Date().getTime()}.html`);
  };

  const handleCopyPrediction = async () => {
    if (matches.length === 0) return;
    const summary = generatePredictionSummary(matches);
    const success = await copyToClipboard(summary);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (matches.length === 0) return;
    const shareUrl = generateShareLink(matches);
    shareToSocialMedia(shareUrl, platform);
  };

  return (
    <div className="relative">
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors text-accent font-medium"
      >
        <Share2 className="w-4 h-4" />
        <span>Export & Share</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-accent/30 rounded-xl shadow-2xl backdrop-blur-sm z-50">
          {/* Header */}
          <div className="p-4 border-b border-accent/20">
            <h3 className="font-bold text-foreground text-sm">{title}</h3>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {/* Watchlist Export Options */}
            {matches.length > 0 && (
              <>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Watchlist</p>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                >
                  <Copy className={`w-4 h-4 ${copied ? 'text-primary' : 'text-accent'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {copied ? 'Link Copied!' : 'Copy Share Link'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {matches.length} prediction{matches.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {copied && <Check className="w-4 h-4 text-primary" />}
                </button>

                <button
                  onClick={handleCopyPrediction}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                >
                  <Copy className="w-4 h-4 text-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Copy as Text</p>
                    <p className="text-xs text-muted-foreground">Plain text summary</p>
                  </div>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Export as JSON</p>
                    <p className="text-xs text-muted-foreground">For backup/integration</p>
                  </div>
                </button>

                {/* Social Share */}
                <div className="pt-2 border-t border-accent/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Share on Social</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSocialShare('twitter')}
                      className="p-3 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors border border-[#1DA1F2]/30"
                      title="Share on Twitter"
                    >
                      <Send className="w-4 h-4 text-[#1DA1F2] mx-auto" />
                    </button>
                    <button
                      onClick={() => handleSocialShare('facebook')}
                      className="p-3 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors border border-[#1877F2]/30"
                      title="Share on Facebook"
                    >
                      <Share2 className="w-4 h-4 text-[#1877F2] mx-auto" />
                    </button>
                    <button
                      onClick={() => handleSocialShare('whatsapp')}
                      className="p-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/30"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366] mx-auto" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Betting History Export */}
            {records.length > 0 && (
              <>
                <div className="pt-3 border-t border-accent/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Betting History</p>
                  <button
                    onClick={handleExportBettingHistory}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-accent" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Export as HTML</p>
                      <p className="text-xs text-muted-foreground">
                        {records.length} record{records.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* Empty State */}
            {matches.length === 0 && records.length === 0 && (
              <div className="text-center py-6">
                <Share2 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No data to export</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 bg-accent/5 border-t border-accent/20 text-xs text-muted-foreground rounded-b-xl">
            Share links include all prediction details and auto-update odds
          </div>
        </div>
      )}
    </div>
  );
}
