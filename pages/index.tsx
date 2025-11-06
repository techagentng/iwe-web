import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../utils/animations';
import AnimatedWrapper from '../components/AnimatedWrapper';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, Zap, BarChart3, Shield, Users, TrendingUp, Check } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Landing() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedWrapper variants={fadeInUp}>
            <motion.div
              className="inline-block px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                ✨ New features available
              </span>
            </motion.div>
          </AnimatedWrapper>

          <AnimatedWrapper variants={fadeInUp} delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Welcome to{' '}
              <span style={{ color: 'var(--accent-primary)' }}>IWEAPP</span>
            </h1>
          </AnimatedWrapper>

          <AnimatedWrapper variants={fadeInUp} delay={0.2}>
            <p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              The modern platform that helps you manage your business with ease.
              Built with the latest technologies for the best experience.
            </p>
          </AnimatedWrapper>

          <AnimatedWrapper variants={fadeInUp} delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <motion.button
                  className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/theme-showcase">
                <motion.button
                  className="btn-secondary text-lg px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Showcase
                </motion.button>
              </Link>
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedWrapper variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Why Choose Us?
            </h2>
            <p 
              className="text-center text-lg mb-12 max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Everything you need to succeed, all in one place
            </p>
          </AnimatedWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Built with performance in mind. Experience blazing fast load times and smooth interactions.',
                color: 'var(--accent-primary)',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Reliable',
                description: 'Your data is protected with enterprise-grade security. We take privacy seriously.',
                color: 'var(--accent-success)',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Grow Your Business',
                description: 'Powerful tools and insights to help you make better decisions and scale faster.',
                color: 'var(--accent-info)',
              },
            ].map((feature, index) => (
              <AnimatedWrapper key={feature.title} variants={fadeInUp} delay={0.1 * (index + 1)}>
                <motion.div
                  className="card h-full"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="p-3 rounded-xl inline-block mb-4"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <div style={{ color: feature.color }}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedWrapper variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything you need to succeed
              </h2>
              <p 
                className="text-lg mb-8"
                style={{ color: 'var(--text-secondary)' }}
              >
                Our platform provides all the tools and features you need to manage and grow your business effectively.
              </p>
              <ul className="space-y-4">
                {[
                  'Easy to use dashboard',
                  'Real-time analytics',
                  'Team collaboration tools',
                  'Mobile-friendly design',
                  '24/7 customer support',
                ].map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div
                      className="p-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent-success)' }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedWrapper>

            <AnimatedWrapper variants={fadeInUp} delay={0.2}>
              <div 
                className="rounded-2xl p-8 h-96 flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="text-center">
                  <div
                    className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    <Zap className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-xl font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Your success starts here
                  </p>
                </div>
              </div>
            </AnimatedWrapper>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedWrapper variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p 
              className="text-xl mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join thousands of businesses already using our platform
            </p>
            <Link href="/signup">
              <motion.button
                className="btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
            </Link>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 px-4 border-t"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p style={{ color: 'var(--text-secondary)' }}>
            © 2025 MyApp. All rights reserved.
          </p>
        </div>
      </footer>
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