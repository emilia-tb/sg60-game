
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import type { SoundData } from '../SG60Game';

interface SoundCardProps {
  sound: SoundData;
  soundNumber: number;
  totalSounds: number;
  onResponse: (heard: boolean) => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({ 
  sound, 
  soundNumber, 
  totalSounds, 
  onResponse 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handlePlaySound = () => {
    setIsPlaying(true);
    setHasPlayed(true);
    
    // Create a simple beep sound as placeholder since we can't directly play YouTube videos
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
    
    console.log(`Playing sound: ${sound.name} from ${sound.audioUrl}`);
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-8">
      <CardContent className="text-center space-y-6">
        <div className="space-y-2">
          <p className="sg-body opacity-70">
            Sound {soundNumber} of {totalSounds}
          </p>
          <h2 className="sg-subheading">
            {sound.name}
          </h2>
          <p className="sg-body">
            {sound.description}
          </p>
        </div>
        
        <div className="space-y-6 text-center">
          <Button
            onClick={handlePlaySound}
            disabled={isPlaying}
            className="sg-button rounded-full px-8 py-6 text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 mx-auto"
          >
            <Play size={20} />
            {isPlaying ? 'Playing...' : 'Play Sound'}
          </Button>
          
          {hasPlayed && (
            <div className="space-y-4">
              <p className="sg-body font-medium">
                Did you hear the sound clearly?
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => onResponse(true)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-4 text-lg transition-colors"
                >
                  Yes, I heard it
                </Button>
                <Button
                  onClick={() => onResponse(false)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-4 text-lg transition-colors"
                >
                  No, I didn't hear it
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
