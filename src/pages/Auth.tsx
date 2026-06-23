import * as React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Bot, Lock, User, Info } from 'lucide-react';

interface AuthProps {
  onLogin: (nip: string, pass: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

export const Auth = ({ onLogin, error, loading }: AuthProps) => {
  const [nip, setNip] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(nip, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />

      <Card className="w-full max-w-md bg-slate-900/40 glass border-slate-800/80 shadow-2xl relative z-10 z-index">
        <CardHeader className="text-center space-y-2 border-b border-slate-850/50 pb-5">
          <div className="mx-auto h-11 w-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Bot size={24} className="stroke-[2.5] animate-pulse-subtle" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 font-display">
              E-Aspri
            </CardTitle>
            <CardDescription className="text-xs text-slate-450 mt-1 font-medium">
              Electronic Assistant Pimpinan Bappeda
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / NIP */}
            <div className="space-y-1.5">
              <label htmlFor="nip" className="text-xs font-bold text-slate-350 flex items-center gap-1.5">
                <User size={13} className="text-slate-500" />
                Username / NIP ASN
              </label>
              <Input
                id="nip"
                type="text"
                required
                placeholder="Contoh: iyan"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="pass" className="text-xs font-bold text-slate-350 flex items-center gap-1.5">
                <Lock size={13} className="text-slate-500" />
                Kata Sandi
              </label>
              <Input
                id="pass"
                type="password"
                required
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs sm:text-sm font-semibold h-11"
              disabled={loading}
            >
              {loading ? 'Menghubungkan Sesi...' : 'Masuk Ke E-Aspri'}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
};
