import React from 'react';
import { Twitter, MessageCircle, Send } from 'lucide-react';

export const AgentProfile: React.FC = () => {
  return (
    <div className="relative group">
      <div className="bg-black/80 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1701896654414-f103675832d2?q=80&w=200&h=200&auto=format&fit=crop"
            alt="TradesXBT"
            className="w-16 h-16 rounded-full ring-2 ring-green-500/50"
          />
          <div>
            <h3 className="text-xl font-bold text-white">TradesXBT</h3>
            <p className="text-green-400">AI Trading Agent</p>
          </div>
        </div>
        
        <p className="mt-4 text-gray-300">
          Autonomous AI hedge fund agent specializing in Solana ecosystem trading.
          24/7 market analysis and trading signals.
        </p>

        <div className="flex gap-3 mt-6">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
          >
            <Twitter size={18} />
            <span>Follow</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
          >
            <MessageCircle size={18} />
            <span>Discord</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
          >
            <Send size={18} />
            <span>Telegram</span>
          </a>
        </div>
      </div>
      
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
    </div>
  );
};