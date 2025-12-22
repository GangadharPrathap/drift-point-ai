import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 py-12 px-4">
      <div className="max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-neon-blue rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <span className="text-2xl font-heading font-black">
                DRIFT<span className="text-neon-blue">POINT</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Next-generation go-kart performance analysis powered by AI. 
              Dominate the track with real-time insights and professional tuning recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-heading font-bold mb-4 text-neon-blue">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register-kart" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Register Kart
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-neon-blue transition-colors">
                  AI Pit Crew
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-4">
            <h3 className="text-lg font-heading font-bold mb-4 text-neon-orange">Connect</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-glass-white backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center hover:border-neon-blue transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-glass-white backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center hover:border-neon-blue transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-glass-white backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center hover:border-neon-blue transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Follow us for the latest updates on AI-powered racing technology.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} DriftPoint AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
