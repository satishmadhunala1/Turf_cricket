import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { userApi } from '../../api/endpoints';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    userApi.getWallet().then(({ data }) => setBalance(data.data?.balance || 0));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Wallet</h1>
      <div className="glass-card rounded-2xl p-8 text-center max-w-md">
        <Wallet className="w-12 h-12 text-brand-400 mx-auto" />
        <p className="text-slate-400 mt-4">Available Balance</p>
        <p className="text-4xl font-bold text-brand-400 mt-2">₹{balance}</p>
        <p className="text-sm text-slate-500 mt-4">Wallet credits can be used for future bookings</p>
      </div>
    </div>
  );
}
