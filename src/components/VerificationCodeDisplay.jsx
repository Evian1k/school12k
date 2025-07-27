import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Eye, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const VerificationCodeDisplay = () => {
  const { pendingVerification } = useAuth();
  const [showCode, setShowCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (pendingVerification?.expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, pendingVerification.expiresAt - Date.now());
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [pendingVerification]);

  const copyToClipboard = () => {
    if (pendingVerification?.code) {
      navigator.clipboard.writeText(pendingVerification.code);
      toast({
        title: "Code Copied",
        description: "Verification code copied to clipboard",
      });
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!pendingVerification) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-50"
    >
      <Card className="bg-blue-900/90 backdrop-blur-sm border-blue-500/30 shadow-2xl w-80">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Demo Verification Code</h4>
                <span className="text-xs text-blue-300">
                  {timeLeft > 0 ? formatTime(timeLeft) : 'Expired'}
                </span>
              </div>
              
              <p className="text-xs text-gray-300">
                Email: {pendingVerification.email}
              </p>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-blue-800/50 rounded-lg p-3 font-mono text-center">
                  {showCode ? (
                    <span className="text-2xl tracking-widest text-white font-bold">
                      {pendingVerification.code}
                    </span>
                  ) : (
                    <span className="text-xl tracking-widest text-gray-400">
                      ••••••
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCode(!showCode)}
                  className="flex-1 border-blue-500/30 text-white hover:bg-blue-800/50"
                >
                  {showCode ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                  {showCode ? 'Hide' : 'Show'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-1 border-blue-500/30 text-white hover:bg-blue-800/50"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed">
                In production, this code would be sent to your email. For demo purposes, it's displayed here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VerificationCodeDisplay;