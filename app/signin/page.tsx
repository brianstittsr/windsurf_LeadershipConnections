'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAdminUser } from '@/lib/adminUsers';
import PasswordResetModal from '@/components/Auth/PasswordResetModal';

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Redirect admin users to dashboard, regular users to home
      if (isAdminUser(userCredential.user.email)) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                Sign in to your account
              </h3>
              <form onSubmit={handleSignin}>
                <div className="mb-8">
                  <label
                    htmlFor="email"
                    className="mb-3 block text-sm text-gray-700"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-sm border border-gray-300 bg-white px-6 py-3 text-base text-gray-900 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="mb-3 block text-sm text-gray-700"
                  >
                    Your Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-sm border border-gray-300 bg-white px-6 py-3 text-base text-gray-900 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {error && <p className="mb-4 text-center text-red-500">{error}</p>}
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mb-6">
                  <button type="submit" className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 shadow-lg">
                    Sign in
                  </button>
                </div>
              </form>
              <p className="text-center text-base font-medium text-body-color">
                Don't you have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={showResetModal} 
        onClose={() => setShowResetModal(false)} 
      />
    </section>
  );
};

export default SigninPage;
