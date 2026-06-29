'use client';

import { useState } from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';

interface CryptographicReceiptProps {
  matchId: string;
  matchTitle: string;
}

export function CryptographicReceipt({ matchId, matchTitle }: CryptographicReceiptProps) {
  const [copied, setCopied] = useState(false);

  // Mock cryptographic data - in production, these would be real Solana transaction data
  const merkleProof = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const timestamp = new Date().toISOString();
  const transactionSignature = `${Array.from({ length: 88 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(merkleProof);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header with verification badge */}
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 size={20} className="text-primary" />
        <h3 className="text-lg font-bold text-foreground">Cryptographic Receipt</h3>
        <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary">
          Verified on Solana
        </span>
      </div>

      {/* Receipt Details */}
      <div className="space-y-3 bg-card/30 border border-primary/20 rounded-lg p-4">
        {/* Match Title */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
            Match
          </label>
          <p className="text-sm text-foreground font-medium">{matchTitle}</p>
        </div>

        {/* Merkle Proof */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
            Merkle Proof (Cryptographic Hash)
          </label>
          <div className="relative">
            <code className="block w-full bg-background border border-primary/20 rounded-lg p-3 font-mono text-xs text-primary overflow-x-auto break-all">
              {merkleProof}
            </code>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              title="Copy hash"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
            Timestamp (UTC)
          </label>
          <code className="block w-full bg-background border border-primary/20 rounded-lg p-3 font-mono text-xs text-secondary">
            {timestamp}
          </code>
        </div>

        {/* Transaction Signature */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
            Transaction Signature
          </label>
          <code className="block w-full bg-background border border-primary/20 rounded-lg p-3 font-mono text-xs text-accent break-all">
            {transactionSignature}
          </code>
        </div>
      </div>

      {/* Verify Signature Button */}
      <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40 hover:from-primary/30 hover:to-secondary/30 text-primary font-semibold text-sm transition-all flex items-center justify-center gap-2">
        <CheckCircle2 size={16} />
        Verify Signature on Solana
      </button>

      {/* Info Box */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3 space-y-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-secondary">What is this?</span> This cryptographic receipt proves your prediction was submitted to the Solana blockchain with a verifiable timestamp and merkle proof.
        </p>
        <p className="text-xs text-muted-foreground">
          All sports predictions are recorded on-chain for permanent, trustless verification and dispute resolution.
        </p>
      </div>
    </div>
  );
}
