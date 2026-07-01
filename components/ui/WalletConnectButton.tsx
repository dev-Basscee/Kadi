'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export function WalletConnectButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-2" suppressHydrationWarning>
      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <Wallet size={16} className="text-primary" />
          <span className="text-xs font-medium text-primary truncate">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
      <WalletMultiButton 
        className="!bg-primary !hover:bg-primary/90 !text-primary-foreground !h-9 !px-3 !rounded-md !text-sm !font-medium"
      />
    </div>
  );
}
