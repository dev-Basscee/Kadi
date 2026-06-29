'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function WalletConnectButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 hidden lg:inline-flex px-3 py-2 rounded-lg text-sm font-medium">
        Connect Wallet
      </button>
    );
  }

  return <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !h-9 !px-3 !rounded-md !text-sm !font-medium" />;
}
