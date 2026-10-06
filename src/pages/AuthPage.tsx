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
      address: '742 Evergreen Terrace, Portland, OR',
      phoneNumber: '+1 555-0192',
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
        <div className="w-11 h-11 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] flex items-center justify-center mx-auto mb-3 shadow-md nib-hover">
          <svg className="w-6 h-6 text-[#F7F4EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 2 4 7-4 13-4-13 4-7z"/>
            <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
            <path d="M12 12.5V19"/>
          </svg>
        </div>
        <h1 className="font-editorial text-4xl text-[#0D1017] dark:text-[#EFECE6]">
          {mode === 'login' && 'Patron Sign In'}
          {mode === 'register' && 'Register Patron Account'}
          {mode === 'forgot' && 'Account Recovery'}
          {mode === 'reset' && 'Reset Master Key'}
        </h1>
        <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] font-body-literary">
          Inkora Editions · The Archival Reader Collective
        </p>
      </div>

      {/* Demo Credentials Quick Switcher Banner */}
      <div className="p-4 border border-[#16284F]/30 dark:border-[#5A85C4]/30 bg-[#EBF0F8]/80 dark:bg-[#162236]/80 space-y-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-[#16284F] dark:text-[#5A85C4] block font-mono">
          One-Click Demo Profiles for Evaluation
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={async () => {
              await switchDemoRole('USER');
              onNavigate('home');
            }}
            className="p-2 border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] text-left hover:border-[#16284F] dark:hover:border-[#5A85C4] transition-colors btn-press shadow-2xs cursor-pointer"
          >
            <div className="font-semibold text-[#0D1017] dark:text-[#EFECE6] font-mono">Customer</div>
            <div className="text-[10px] text-[#5A6273] dark:text-[#8F97A8]">user@inkora.com</div>
          </button>
          <button
            type="button"
            onClick={async () => {
              await switchDemoRole('ADMIN');
              onNavigate('admin');
            }}
            className="p-2 border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] text-left hover:border-[#16284F] dark:hover:border-[#5A85C4] transition-colors btn-press shadow-2xs cursor-pointer"
          >
            <div className="font-semibold text-[#16284F] dark:text-[#5A85C4] font-mono">Administrator</div>
            <div className="text-[10px] text-[#5A6273] dark:text-[#8F97A8]">admin@inkora.com</div>
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="border border-[#DFD7C7] dark:border-[#242A38] bg-[#FFFFFF] dark:bg-[#131720] p-8 space-y-6 shadow-xs">
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                Patron Email or Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@inkora.com or admin@inkora.com"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6] focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[10px] text-[#16284F] dark:text-[#5A85C4] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] font-semibold uppercase tracking-widest text-xs hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors cursor-pointer btn-press"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center pt-2 text-[#5A6273] dark:text-[#8F97A8]">
              New reader?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#16284F] dark:text-[#5A85C4] font-semibold underline"
              >
                Inscribe an account
              </button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                Patron Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. eleanor_vance"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@inkora.com"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] font-semibold uppercase tracking-widest text-xs hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors cursor-pointer btn-press"
            >
              {loading ? 'Creating...' : 'Register Account'}
            </button>

            <div className="text-center pt-2 text-[#5A6273] dark:text-[#8F97A8]">
              Already inscribed?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#16284F] dark:text-[#5A85C4] font-semibold underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-mono">
            <p className="text-xs text-[#5A6273] dark:text-[#8F97A8] font-body-literary">
              Enter your email address. We will transmit a 6-digit cryptographic verification code.
            </p>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@inkora.com"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] font-semibold uppercase tracking-widest text-xs hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors cursor-pointer btn-press"
            >
              Dispatch Recovery Code
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-[#5A6273] hover:text-[#0D1017] underline"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                6-Digit Verification Code (Demo: 849201)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="849201"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-xs font-mono text-[#0D1017] dark:text-[#EFECE6]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#0D1017] dark:text-[#EFECE6] block mb-1">
                New Master Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New secure password"
                required
                className="w-full px-3 py-2.5 border border-[#DFD7C7] dark:border-[#242A38] bg-transparent text-[#0D1017] dark:text-[#EFECE6]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#16284F] dark:bg-[#5A85C4] text-[#F7F4EB] font-semibold uppercase tracking-widest text-xs hover:bg-[#0E1A33] dark:hover:bg-[#729BD4] transition-colors cursor-pointer btn-press"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
