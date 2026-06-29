'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Match } from '@/lib/mockData';
import { X, Trash2, TrendingUp, Wallet, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Web3EscrowSlipProps {
  selectedMatches: Match[];
  onRemove: (matchId: string) => void;
  onShare: () => void;
}

type TransactionState = 'idle' | 'signing' | 'locked' | 'complete';

export function Web3EscrowSlip({ selectedMatches, onRemove, onShare }: Web3EscrowSlipProps) {
  const { connected, publicKey } = useWallet();
  const [selectedAsset, setSelectedAsset] = useState<'USDC' | 'SOL'>('USDC');
  const [transactionState, setTransactionState] = useState<TransactionState>('idle');
  const [stakeAmount, setStakeAmount] = useState('100');

  const totalOdds = selectedMatches.reduce((a, m) => a * m.odds, 1);
  const potentialReturn = parseFloat(stakeAmount) * totalOdds;

  const handleLockPrediction = async () => {
    if (!connected) return;

    // Simulate transaction flow
    setTransactionState('signing');
    await new Promise(r => setTimeout(r, 2000)); // Simulate signing
    
    setTransactionState('locked');
    await new Promise(r => setTimeout(r, 1500)); // Simulate confirmation
    
    setTransactionState('complete');
    await new Promise(r => setTimeout(r, 2000)); // Show success
    
    setTransactionState('idle'); // Reset after showing success
  };

  const assets = [
    { value: 'USDC', label: 'Devnet USDC', icon: '₳' },
    { value: 'SOL', label: 'SOL', icon: '◎' },
  ];

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Web3 Escrow Slip</h3>
        <p className="text-xs text-muted-foreground">Trustless on-chain predictions</p>
      </div>

      {/* Selected Matches */}
      {selectedMatches.length > 0 ? (
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {selectedMatches.map((match) => (
            <div key={match.id} className="flex items-center justify-between p-3 bg-card/50 border border-primary/20 rounded-lg">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {match.homeTeam} vs {match.awayTeam}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className="font-mono">@{match.odds.toFixed(2)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    match.prediction.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    match.prediction.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    match.prediction.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    match.prediction.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {match.prediction.confidence}%
                  </span>
                </p>
              </div>
              <button
                onClick={() => onRemove(match.id)}
                className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X size={16} className="text-destructive" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No predictions selected</p>
          <p className="text-xs mt-1">Click on a match to add predictions</p>
        </div>
      )}

      {/* Divider */}
      {selectedMatches.length > 0 && <div className="border-t border-primary/10" />}

      {/* Asset Selection */}
      {selectedMatches.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            Wagering Asset
          </label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value as 'USDC' | 'SOL')}
            disabled={transactionState !== 'idle'}
            className="w-full px-3 py-2 rounded-lg bg-card border border-primary/30 text-foreground text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            {assets.map(asset => (
              <option key={asset.value} value={asset.value}>
                {asset.label} {asset.icon}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stake Amount */}
      {selectedMatches.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            Stake Amount
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={transactionState !== 'idle'}
              className="flex-1 px-3 py-2 rounded-lg bg-card border border-primary/30 text-foreground text-sm font-medium disabled:opacity-50"
              placeholder="100"
            />
            <span className="text-xs font-semibold text-secondary">{selectedAsset}</span>
          </div>
        </div>
      )}

      {/* Summary */}
      {selectedMatches.length > 0 && (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Matches:</span>
            <span className="font-semibold text-foreground">{selectedMatches.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Combined Odds:</span>
            <span className="font-semibold text-primary">{totalOdds.toFixed(2)}</span>
          </div>
          <div className="border-t border-primary/20 pt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Potential Return:</span>
            <span className="text-lg font-bold text-accent">{potentialReturn.toFixed(2)} {selectedAsset}</span>
          </div>
        </div>
      )}

      {/* Transaction State Display */}
      {transactionState !== 'idle' && (
        <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-3">
          {transactionState === 'signing' && (
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="text-primary animate-spin" />
              <div>
                <p className="text-sm font-semibold text-foreground">Awaiting Smart Contract Signature...</p>
                <p className="text-xs text-muted-foreground mt-1">Approve transaction in your wallet</p>
              </div>
            </div>
          )}
          
          {transactionState === 'locked' && (
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="text-primary animate-spin" />
              <div>
                <p className="text-sm font-semibold text-foreground">Funds Locked in Escrow...</p>
                <p className="text-xs text-muted-foreground mt-1">Confirming on Solana blockchain</p>
              </div>
            </div>
          )}

          {transactionState === 'complete' && (
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary">Prediction Locked Successfully!</p>
                <p className="text-xs text-muted-foreground mt-1">Funds are now in smart contract escrow</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {selectedMatches.length > 0 && (
        <div className="space-y-2 pt-2">
          {!connected ? (
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:from-primary/90 hover:to-secondary/90 font-semibold gap-2"
              disabled
            >
              <Wallet size={16} />
              Connect Wallet to Lock Prediction
            </Button>
          ) : (
            <Button
              onClick={handleLockPrediction}
              disabled={transactionState !== 'idle'}
              className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:from-primary/90 hover:to-secondary/90 font-semibold gap-2"
            >
              {transactionState === 'idle' ? (
                <>
                  <Lock size={16} />
                  Lock Prediction in Escrow
                </>
              ) : (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              )}
            </Button>
          )}

          <Button
            onClick={onShare}
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10 font-semibold"
            disabled={transactionState !== 'idle'}
          >
            <TrendingUp size={16} />
            Share Watchlist
          </Button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3 space-y-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-secondary">Web3 Escrow:</span> Funds are locked in a trustless smart contract until match resolution.
        </p>
        <p className="text-xs text-muted-foreground">
          Your prediction is permanently recorded on the Solana blockchain with cryptographic verification.
        </p>
      </div>

      {/* Clear Button */}
      {selectedMatches.length > 0 && (
        <button
          onClick={() => selectedMatches.forEach(m => onRemove(m.id))}
          className="w-full text-xs text-destructive hover:text-destructive/80 font-semibold py-2 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      )}
    </div>
  );
}
