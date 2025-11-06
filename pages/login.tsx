import { useRouter } from 'next/router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '../utils/animations';
import AnimatedWrapper from '../components/AnimatedWrapper';
import { Eye, EyeOff, Lock, Mail, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { mockLogin } from '../utils/auth';
import { useTranslation } from '../hooks/useTranslation';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Login() {
  const { t } = useTranslation();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mockLogin(user, pass)) {
      localStorage.setItem('auth', 'true');
      document.cookie = "auth=true; path=/";
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - 60% - Image and Grid Background */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            backgroundColor: 'var(--bg-tertiary)',
          }}
        />
        
        {/* Overlay Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            opacity: 0.1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <AnimatedWrapper variants={fadeInLeft} delay={0.2}>
            <motion.div
              className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Zap className="w-12 h-12 text-white" />
            </motion.div>
          </AnimatedWrapper>

          <AnimatedWrapper variants={fadeInLeft} delay={0.3}>
            <h1 className="text-5xl font-bold mb-6">
              Welcome to{' '}
              <span style={{ color: 'var(--accent-primary)' }}>IWEApp</span>
            </h1>
          </AnimatedWrapper>

          <AnimatedWrapper variants={fadeInLeft} delay={0.4}>
            <p 
              className="text-xl mb-8 max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              Experience the power of modern web development with our cutting-edge platform.
            </p>
          </AnimatedWrapper>

          <AnimatedWrapper variants={fadeInLeft} delay={0.5}>
            <div className="grid grid-cols-3 gap-8 max-w-md">
              {[
                { number: '10K+', label: 'Active Users' },
                { number: '99.9%', label: 'Uptime' },
                { number: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div 
                    className="text-3xl font-bold mb-2"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedWrapper>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: 'var(--accent-primary)' }}
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: 'var(--accent-secondary)' }}
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Right Side - 40% - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <AnimatedWrapper variants={fadeInRight} delay={0.2}>
            <div className="text-center mb-8">
              <motion.div
                className="inline-block p-3 rounded-xl mb-4"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                whileHover={{ scale: 1.05 }}
              >
                <Lock className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Sign in to your account to continue
              </p>
            </div>
          </AnimatedWrapper>

          <AnimatedWrapper variants={fadeInUp} delay={0.3}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    style={{ paddingLeft: '3rem' }}
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="input w-full pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="input w-full pl-10 pr-10"
                    style={{ paddingLeft: '3rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-sm hover:underline"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg text-sm text-white"
                  style={{ backgroundColor: 'var(--accent-danger)' }}
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </AnimatedWrapper>

          {/* Demo Credentials */}
          <AnimatedWrapper variants={fadeInUp} delay={0.4}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Demo Credentials:
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Username: <code className="font-mono">admin</code>
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Password: <code className="font-mono">password</code>
              </p>
            </motion.div>
          </AnimatedWrapper>

          {/* Sign Up Link */}
          <AnimatedWrapper variants={fadeInUp} delay={0.5}>
            <div className="mt-8 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <Link 
                  href="/signup"
                  className="font-medium hover:underline"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}