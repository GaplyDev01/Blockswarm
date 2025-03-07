import React from 'react';
import { Twitter, MessageCircle, Send, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* Gooey Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 transform -translate-x-1/2 bottom-0 w-96 h-96 bg-viridian/30 dark:bg-viridian/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute left-3/4 transform -translate-x-1/2 bottom-0 w-96 h-96 bg-emerald/30 dark:bg-emerald/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-96 h-96 bg-lime/30 dark:bg-lime/20 rounded-full filter blur-[80px]"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-viridian dark:text-viridian">Blockswarm</h3>
            <p className="text-light-subtext dark:text-dark-subtext mb-4">
              AI-Powered Solana Trading Platform with autonomous hedge fund agent offering 24/7 market analysis, trading signals, and portfolio tracking.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-viridian/10 dark:bg-viridian/20 border border-viridian/30 dark:border-viridian/40 flex items-center justify-center text-viridian hover:bg-viridian/20 dark:hover:bg-viridian/30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-viridian/10 dark:bg-viridian/20 border border-viridian/30 dark:border-viridian/40 flex items-center justify-center text-viridian hover:bg-viridian/20 dark:hover:bg-viridian/30 transition-colors"
                aria-label="Discord"
              >
                <MessageCircle size={18} />
              </a>
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-viridian/10 dark:bg-viridian/20 border border-viridian/30 dark:border-viridian/40 flex items-center justify-center text-viridian hover:bg-viridian/20 dark:hover:bg-viridian/30 transition-colors"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-light-subtext dark:text-dark-subtext hover:text-viridian dark:hover:text-viridian transition-colors flex items-center">
                  <ArrowUpRight size={14} className="mr-2" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-light-subtext dark:text-dark-subtext hover:text-viridian dark:hover:text-viridian transition-colors flex items-center">
                  <ArrowUpRight size={14} className="mr-2" />
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-light-subtext dark:text-dark-subtext hover:text-viridian dark:hover:text-viridian transition-colors flex items-center">
                  <ArrowUpRight size={14} className="mr-2" />
                  Trading Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-light-subtext dark:text-dark-subtext hover:text-viridian dark:hover:text-viridian transition-colors flex items-center">
                  <ArrowUpRight size={14} className="mr-2" />
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-light-subtext dark:text-dark-subtext hover:text-viridian dark:hover:text-viridian transition-colors flex items-center">
                  <ArrowUpRight size={14} className="mr-2" />
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">Connect With Us</h4>
            <p className="text-light-subtext dark:text-dark-subtext mb-6">
              Join the TradesXBT community for the latest updates, trading insights, and exclusive opportunities.
            </p>
            <div className="flex items-center space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-light-bg/90 dark:bg-dark-bg/90 border border-light-border/20 dark:border-viridian/40 rounded-lg py-3 px-4 text-light-text dark:text-dark-text placeholder:text-light-subtext dark:placeholder:text-dark-subtext focus:outline-none focus:border-viridian/40 dark:focus:border-viridian/70"
              />
              <button className="p-3 bg-viridian dark:bg-viridian/90 text-white dark:text-white rounded-lg hover:bg-smaragdine dark:hover:bg-smaragdine transition-colors flex items-center justify-center">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Social Media Links with Gooey Effect */}
        <div className="relative py-8 mt-8 border-t border-light-border/10 dark:border-viridian/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-light-subtext dark:text-dark-subtext mb-4 md:mb-0">
              © {new Date().getFullYear()} TradesXBT. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-viridian/20 dark:bg-viridian/30 rounded-full blur-md group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100 scale-125"></div>
                <div className="relative w-12 h-12 rounded-full bg-viridian/10 dark:bg-viridian/20 border border-viridian/30 dark:border-viridian/40 flex items-center justify-center text-viridian hover:bg-viridian/20 dark:hover:bg-viridian/30 transition-all duration-300 group-hover:scale-110">
                  <Twitter size={20} className="group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-light-subtext dark:text-dark-subtext opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  X
                </span>
              </a>
              
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-emerald/20 dark:bg-emerald/30 rounded-full blur-md group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100 scale-125"></div>
                <div className="relative w-12 h-12 rounded-full bg-viridian/10 dark:bg-viridian/20 border border-viridian/30 dark:border-viridian/40 flex items-center justify-center text-viridian hover:bg-viridian/20 dark:hover:bg-viridian/30 transition-all duration-300 group-hover:scale-110">
                  <MessageCircle size={20} className="group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-light-subtext dark:text-dark-subtext opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Discord
                </span>
              </a>
              
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-lime/20 dark:bg-lime/30 rounded-full blur-md group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100 scale-125"></div>
                <div className="relative w-12 h-12 rounded-full bg-viridian/10 dark:bg-viridian/20 border border-viridian/30 dark:border-viridian/40 flex items-center justify-center text-viridian hover:bg-viridian/20 dark:hover:bg-viridian/30 transition-all duration-300 group-hover:scale-110">
                  <Send size={20} className="group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-light-subtext dark:text-dark-subtext opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Telegram
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};