import React, { useEffect, useRef } from 'react';

interface TradingViewToolProps {
  symbol?: string;
  interval?: string;
}

export const TradingViewTool: React.FC<TradingViewToolProps> = ({ 
  symbol = 'SOLUSDT',
  interval = '1D'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up any existing widgets
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create the TradingView widget using their JavaScript API
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0C1016",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id
        });
      }
    };
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval]);

  return (
    <div className="h-[400px] w-full">
      <div 
        id="tradingview_chart" 
        ref={containerRef} 
        className="h-full w-full"
      />
    </div>
  );
};

// Add missing typings for TradingView
declare global {
  interface Window {
    TradingView: any;
  }
}