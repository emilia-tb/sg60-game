
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeCardProps {
  onStart: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onStart }) => {
  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-8">
      <CardContent className="text-center space-y-6">
        <h1 className="sg-heading leading-tight">
          Rediscover the Sounds of Singapore — SG60 Sound Game!
        </h1>
        
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
          
          <div className="space-y-2 text-left max-w-md mx-auto">
            <div className="flex items-center sg-body">
              <span className="text-green-600 mr-2">•</span>
              Fast and fun
            </div>
            <div className="flex items-center sg-body">
              <span className="text-green-600 mr-2">•</span>
              Works on your phone or computer
            </div>
            <div className="flex items-center sg-body">
              <span className="text-green-600 mr-2">•</span>
              Win a free limited edition SG60 gift and hearing check when you visit our clinic!
            </div>
          </div>
        </div>
        
        <Button
          onClick={onStart}
          className="sg-button rounded-full px-8 py-6 text-lg hover:opacity-90 transition-opacity"
        >
          Start Game
        </Button>
      </CardContent>
    </Card>
  );
};
