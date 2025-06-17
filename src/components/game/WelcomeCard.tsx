
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Smartphone } from 'lucide-react';

interface WelcomeCardProps {
  onStart: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onStart }) => {
  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-2 md:p-8">
      <CardContent className="text-center space-y-4 md:space-y-6">
        <h2 className="sg-subheading">
          Join us in celebrating SG60 — can you guess these iconic Singapore sounds?
        </h2>
        
        <div className="space-y-4">
          <p className="sg-body">
            How well can you hear the sounds of our nation?
          </p>
          <p className="sg-body">
            From hawker centre sizzles to MRT chimes, play our fun Sounds of Singapore game and find out.
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-2">
                <Zap className="text-[#005da9]" size={24} />
                <span className="sg-body">Fast and fun</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Smartphone className="text-[#005da9]" size={24} />
                <span className="sg-body">Works on your phone or computer</span>
              </div>
            </div>
            <div className="text-center">
              <span className="sg-body font-bold">
                Win a free limited edition SG60 gift and hearing check when you visit our clinic!
              </span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={onStart}
          className="sg-button rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg hover:opacity-90 transition-opacity"
        >
          Start Game
        </Button>
      </CardContent>
    </Card>
  );
};
