
import React from 'react';

interface SoundCardTimerProps {
  currentTime: number;
}

export const SoundCardTimer: React.FC<SoundCardTimerProps> = ({ currentTime }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center">
      <div></div>
      <div className="bg-[#005da9] text-white px-4 py-2 rounded-full text-lg md:text-xl font-bold">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};
