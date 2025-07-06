import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SoundCardTimer } from './SoundCardTimer';
import { SoundCardPlayer } from './SoundCardPlayer';
import { SoundCardOptions } from './SoundCardOptions';
import type { SoundData } from '../SG60Game';

interface SoundCardProps {
  sound: SoundData;
  soundNumber: number;
  totalSounds: number;
  soundOptions: string[];
  elapsedTime: number;
  onResponse: (selectedAnswer: string) => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({
  sound,
  soundNumber,
  totalSounds,
  soundOptions,
  elapsedTime,
  onResponse
}) => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentTime, setCurrentTime] = useState(elapsedTime);

  // Reset states when a new sound arrives
  useEffect(() => {
    setHasPlayed(false);
    setShowOptions(false);
  }, [sound]);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sync time on prop change
  useEffect(() => {
    setCurrentTime(elapsedTime);
  }, [elapsedTime]);

  const handlePlayComplete = () => {
    setHasPlayed(true);
    setShowOptions(true);
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-2 md:p-8">
      <CardContent className="space-y-4 md:space-y-6">
        <SoundCardTimer currentTime={currentTime} />

        <div className="text-center space-y-2">
          <h2 className="sg-subheading">
            Sound {soundNumber} of {totalSounds}
          </h2>
        </div>

        <SoundCardPlayer
          sound={sound}
          onPlayComplete={handlePlayComplete}
        />

        {showOptions && (
          <SoundCardOptions
            soundOptions={soundOptions}
            onResponse={onResponse}
          />
        )}
      </CardContent>
    </Card>
  );
};
