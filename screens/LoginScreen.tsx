
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { AppView } from '../types';
import { auth } from '../firebase';
import { useTiizi } from '../context/AppContext';
import TiiziInput from '../components/TiiziInput';
import TiiziButton from '../components/TiiziButton';
import TiiziCard from '../components/TiiziCard';

interface Props {
  onNavigate: (view: AppView) => void;
}

const LoginScreen: React.FC<Props> = ({ onNavigate }) => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast, updateProfile } = useTiizi();
  const nextParam = searchParams.get('next');
  const allViews = Object.values(AppView) as string[];
  const nextView = nextParam && allViews.includes(nextParam) ? (nextParam as AppView) : null;

  const handleContinue = async () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!email) nextErrors.email = 'Email is required.';
    if (!password) nextErrors.password = 'Password is required.';
    if (mode === 'signup' && password.length > 0 && password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast('Please complete required fields.', 'error');
      return;
    }
    setErrors({});

    try {
      setIsSubmitting(true);
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = result.user.email?.split('@')[0] || 'Tiizi Member';
        await updateFirebaseProfile(result.user, { displayName }).catch(() => undefined);
        await sendEmailVerification(result.user).catch(() => undefined);
        updateProfile({
          name: displayName,
          avatar: '/icons/icon-192.svg',
        });
        addToast('Account created. Check your email to verify.', 'success');
        onNavigate(nextView || AppView.GROUPS_LIST);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        updateProfile({
          name: result.user.displayName || result.user.email?.split('@')[0] || 'Tiizi Member',
          avatar: result.user.photoURL || '/icons/icon-192.svg',
        });
        addToast('Welcome back!', 'success');
        onNavigate(nextView || AppView.GROUPS_LIST);
      }
    } catch (error) {
      addToast(
        mode === 'signup'
          ? 'Sign-up failed. Try a stronger password or a different email.'
          : 'Sign-in failed. Check your credentials and try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <header className="flex items-center p-4 pt-12 pb-2 justify-end"></header>

      <div className="flex flex-col items-center justify-center pt-4 pb-8">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20 scale-110">
          <span className="material-icons-round text-white text-5xl">fitness_center</span>
        </div>
        <h1 className="text-[32px] font-black text-slate-900 dark:text-white tracking-tight">Tiizi</h1>
        <p className="text-slate-400 font-medium tracking-wide text-xs mt-2">
          {mode === 'signup' ? 'Create your account' : 'Join your fitness community'}
        </p>
      </div>

      <div className="flex flex-col px-6 flex-1 max-w-sm mx-auto w-full">
        <TiiziCard className="p-5">
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`h-10 rounded-xl text-sm font-semibold transition-colors ${
              mode === 'login' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`h-10 rounded-xl text-sm font-semibold transition-colors ${
              mode === 'signup' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>
        <form className="space-y-6" autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" className="hidden" aria-hidden="true" />
          <input type="password" name="fake-password" autoComplete="current-password" className="hidden" aria-hidden="true" />
          <TiiziInput
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            autoComplete="off"
            name="tiizi-auth-email"
            data-lpignore="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <TiiziInput
            label="Password"
            placeholder="Your password"
            type="password"
            autoComplete="new-password"
            name="tiizi-auth-password"
            data-lpignore="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <TiiziButton
            onClick={handleContinue}
            disabled={isSubmitting}
            variant="primary"
            className="h-14"
          >
            {isSubmitting ? (mode === 'signup' ? 'Creating...' : 'Signing In...') : (mode === 'signup' ? 'Create Account' : 'Continue')}
          </TiiziButton>
        </form>

        </TiiziCard>
      </div>

      <div className="mt-auto pb-12 flex justify-center pt-8">
        <p className="text-slate-400 text-sm font-medium">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => setMode((prev) => (prev === 'login' ? 'signup' : 'login'))}
            className="text-primary font-semibold ml-2 hover:underline"
          >
            {mode === 'signup' ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
