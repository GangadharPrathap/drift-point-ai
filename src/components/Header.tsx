import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { useMember } from '@/integrations';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { member, isAuthenticated, isLoading, actions } = useMember();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/register-kart', label: 'Register Kart' },
    { path: '/dashboard', label: 'AI Pit Crew' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-[120rem] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-neon-blue rounded-lg flex items-center justify-center group-hover:bg-neon-orange transition-colors">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <span className="text-2xl font-heading font-black">
              DRIFT<span className="text-neon-blue">POINT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-heading font-semibold transition-colors relative ${
                  location.pathname === link.path
                    ? 'text-neon-blue'
                    : 'text-gray-300 hover:text-neon-blue'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-blue"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-neon-blue font-heading font-semibold transition-colors"
                >
                  {member?.profile?.nickname || member?.contact?.firstName || 'Profile'}
                </Link>
                <button
                  onClick={actions.logout}
                  className="bg-transparent text-neon-orange border border-neon-orange px-6 py-2 rounded-lg font-heading font-semibold hover:bg-neon-orange/10 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={actions.login}
                className="bg-neon-blue text-primary-foreground px-6 py-2 rounded-lg font-heading font-semibold hover:bg-neon-blue/90 transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`font-heading font-semibold transition-colors ${
                  location.pathname === link.path
                    ? 'text-neon-blue'
                    : 'text-gray-300 hover:text-neon-blue'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-neon-blue font-heading font-semibold transition-colors"
                >
                  {member?.profile?.nickname || member?.contact?.firstName || 'Profile'}
                </Link>
                <button
                  onClick={() => {
                    actions.logout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-transparent text-neon-orange border border-neon-orange px-6 py-2 rounded-lg font-heading font-semibold hover:bg-neon-orange/10 transition-all text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  actions.login();
                  setIsMenuOpen(false);
                }}
                className="bg-neon-blue text-primary-foreground px-6 py-2 rounded-lg font-heading font-semibold hover:bg-neon-blue/90 transition-all text-left"
              >
                Sign In
              </button>
            )}
          </motion.nav>
        )}
      </div>
    </header>
  );
}
