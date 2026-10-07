import { t } from '../i18n';
import React, { useState } from 'react';
import { ShieldCheck, User, ArrowRight, KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { api } from '../services/api.js';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { login, register, switchDemoRole } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) onNavigate('home');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await register({
      username,
      email,
      password,
      address,
      phoneNumber,
    });
    setLoading(false);
    if (success) onNavigate('home');
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      showToast(res.message);
      setMode('reset');
    } catch (err: any) {
      showToast(err.message || 'Error sending reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.resetPassword({ email, otp, newPassword });
      showToast(res.message);
      setMode('login');
    } catch (err: any) {
      showToast(err.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8 animate-ink-fade">
      {/* Editorial Header */}
      <div className="text-center space-y-2">
        <div className="w-11 h-11 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] flex items-center justify-center mx-auto mb-3 shadow-md nib-hover">
          <svg className="w-6 h-6 text-[#FAF6EC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 2 4 7-4 13-4-13 4-7z"/>
            <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
            <path d="M12 12.5V19"/>
          </svg>
        </div>
        <h1 className="font-editorial text-4xl text-[#3B2B1E] dark:text-[#F3ECDD]">
          {mode === 'login' && 'Patron Sign In'}
          {mode === 'register' && 'Register Patron Account'}
          {mode === 'forgot' && 'Account Recovery'}
          {mode === 'reset' && 'Reset Master Key'}
        </h1>
        <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
          {t('x.5eb056')}
        </p>
      </div>

      {/* Demo Credentials Quick Switcher Banner */}
      <div className="p-4 border border-[#8A6238]/30 dark:border-[#D9AE6B]/30 bg-[#F6EBD3]/80 dark:bg-[#342718]/80 space-y-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-xs text-[#8A6238] dark:text-[#D9AE6B] block font-mono">
          {t('x.f69cab')}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={async () => {
              await switchDemoRole('USER');
              onNavigate('home');
            }}
            className="p-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] text-start hover:border-[#8A6238] dark:hover:border-[#D9AE6B] transition-colors btn-press shadow-2xs cursor-pointer"
          >
            <div className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] font-mono">{t('x.0e8574')}</div>
            <div className="text-xs text-[#7A6652] dark:text-[#A99A82]">user@inkora.com</div>
          </button>
          <button
            type="button"
            onClick={async () => {
              await switchDemoRole('ADMIN');
              onNavigate('admin');
            }}
            className="p-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] text-start hover:border-[#8A6238] dark:hover:border-[#D9AE6B] transition-colors btn-press shadow-2xs cursor-pointer"
          >
            <div className="font-semibold text-[#8A6238] dark:text-[#D9AE6B] font-mono">{t('x.1eda23')}</div>
            <div className="text-xs text-[#7A6652] dark:text-[#A99A82]">admin@inkora.com</div>
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-8 space-y-6 shadow-xs">
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('x.7b6b86')}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {t('x.8be3c9')}
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-[#8A6238] dark:text-[#D9AE6B] hover:underline"
                >
                  {t('x.f99af9')}
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] font-semibold uppercase tracking-widest text-xs hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors cursor-pointer btn-press"
            >
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>

            <div className="text-center pt-2 text-[#7A6652] dark:text-[#A99A82]">
              New reader?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#8A6238] dark:text-[#D9AE6B] font-semibold underline"
              >
                {t('x.9d093a')}
              </button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('x.af2d86')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('x.29c6cc')}
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('x.09ba55')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@inkora.com"
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('f.street')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('ph.street')}
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('f.phone')}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('ph.phone')}
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('x.8be3c9')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('x.ec8514')}
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] font-semibold uppercase tracking-widest text-xs hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors cursor-pointer btn-press"
            >
              {loading ? t('auth.creating') : t('auth.create')}
            </button>

            <div className="text-center pt-2 text-[#7A6652] dark:text-[#A99A82]">
              Already inscribed?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#8A6238] dark:text-[#D9AE6B] font-semibold underline"
              >
                {t('x.f8492c')}
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-mono">
            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
              {t('x.1f84ff')}
            </p>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('x.09ba55')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@inkora.com"
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] font-semibold uppercase tracking-widest text-xs hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors cursor-pointer btn-press"
            >
              {t('x.ad7e5c')}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-[#7A6652] hover:text-[#3B2B1E] underline"
            >
              {t('x.c65048')}
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                6-Digit Verification Code (Demo: 849201)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="849201"
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs font-mono text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                {t('x.df53e6')}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('x.091ed6')}
                required
                className="w-full px-3 py-2.5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8A6238] dark:bg-[#D9AE6B] text-[#FAF6EC] font-semibold uppercase tracking-widest text-xs hover:bg-[#6F4D2B] dark:hover:bg-[#CBA77B] transition-colors cursor-pointer btn-press"
            >
              {t('x.61dcf3')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};