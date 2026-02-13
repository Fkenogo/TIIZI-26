import React, { useEffect, useMemo, useState } from 'react';
import { AppView } from '../types';
import { auth } from '../firebase';
import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  TwitterAuthProvider,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  sendSignInLinkToEmail
} from 'firebase/auth';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ConnectedAccountsScreen: React.FC<Props> = ({ onNavigate }) => {
  const { addToast } = useTiizi();
  const user = auth.currentUser;
  const providerIds = useMemo(() => new Set(user?.providerData.map((p) => p.providerId)), [user?.providerData]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const storedEmail = window.localStorage.getItem('tiizi_link_email') || email;
      if (!storedEmail) return;
      const credential = EmailAuthProvider.credentialWithLink(storedEmail, window.location.href);
      linkWithCredential(user, credential)
        .then(() => {
          addToast('Email linked.', 'success');
          window.localStorage.removeItem('tiizi_link_email');
        })
        .catch(() => addToast('Unable to link email.', 'error'));
    }
  }, [user, email, addToast]);

  const connectWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider | TwitterAuthProvider | OAuthProvider) => {
    if (!user) {
      addToast('Please sign in first.', 'error');
      return;
    }
    try {
      await linkWithPopup(user, provider);
      addToast('Account connected!', 'success');
    } catch (error: any) {
      addToast(error?.message || 'Unable to connect account.', 'error');
    }
  };

  const handleEmailLink = async () => {
    if (!user) {
      addToast('Please sign in first.', 'error');
      return;
    }
    if (!email) {
      addToast('Enter a valid email.', 'info');
      return;
    }
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('tiizi_link_email', email);
      addToast('Email link sent. Check your inbox.', 'success');
    } catch {
      addToast('Unable to send email link.', 'error');
    }
  };

  const handleSendSms = async () => {
    if (!user) {
      addToast('Please sign in first.', 'error');
      return;
    }
    if (!phone) {
      addToast('Enter a phone number.', 'info');
      return;
    }
    try {
      const verifier = new RecaptchaVerifier(auth, 'phone-recaptcha', { size: 'invisible' });
      const confirmation = await linkWithPhoneNumber(user, phone, verifier);
      setVerificationId(confirmation.verificationId);
      addToast('Verification code sent.', 'success');
    } catch (error: any) {
      addToast(error?.message || 'Unable to send SMS.', 'error');
    }
  };

  const handleVerifySms = async () => {
    if (!user || !verificationId) return;
    try {
      const credential = PhoneAuthProvider.credential(verificationId, smsCode);
      await linkWithCredential(user, credential);
      addToast('Phone linked.', 'success');
      setVerificationId(null);
      setSmsCode('');
    } catch {
      addToast('Invalid code.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white font-display flex flex-col">
      <header className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pt-12 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => onNavigate(AppView.SETTINGS)} className="text-[#1b140d] dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Connected Accounts</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 space-y-6">
        <div className="bg-white dark:bg-[#2d2116] rounded-xl p-4 shadow-sm border border-black/5">
          <p className="text-sm font-medium text-[#9a704c]">Link your accounts to make sign-in easier.</p>
        </div>

        <div className="space-y-3">
          {[
            { id: 'google.com', label: 'Google', action: () => connectWithProvider(new GoogleAuthProvider()) },
            { id: 'apple.com', label: 'Apple', action: () => connectWithProvider(new OAuthProvider('apple.com')) },
            { id: 'facebook.com', label: 'Facebook', action: () => connectWithProvider(new FacebookAuthProvider()) },
            { id: 'twitter.com', label: 'Twitter/X', action: () => connectWithProvider(new TwitterAuthProvider()) }
          ].map((provider) => (
            <div key={provider.id} className="flex items-center justify-between bg-white dark:bg-[#2d2116] p-4 rounded-xl shadow-sm border border-black/5">
              <span className="font-medium">{provider.label}</span>
              {providerIds.has(provider.id) ? (
                <span className="text-xs font-bold text-emerald-600">Connected</span>
              ) : (
                <button onClick={provider.action} className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg">Connect</button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#2d2116] rounded-xl p-4 shadow-sm border border-black/5 space-y-3">
          <p className="font-medium">Email link</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            placeholder="name@example.com"
          />
          <button onClick={handleEmailLink} className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg">Send link</button>
        </div>

        <div className="bg-white dark:bg-[#2d2116] rounded-xl p-4 shadow-sm border border-black/5 space-y-3">
          <p className="font-medium">Phone</p>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            placeholder="+1 555 123 4567"
          />
          <div id="phone-recaptcha" />
          {!verificationId ? (
            <button onClick={handleSendSms} className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg">Send code</button>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
                placeholder="123456"
              />
              <button onClick={handleVerifySms} className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg">Verify</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConnectedAccountsScreen;
