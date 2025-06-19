
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Player } from '../SG60Game';

interface LeaderboardProps {
  leaderboard: Player[];
  playerName: string;
  totalSounds: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  leaderboard, 
  playerName,
  totalSounds
}) => {
  const getScoreColor = (score: number) => {
    if (score >=  8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-4">
      <CardContent className="space-y-4">
        <h3 className="sg-subheading text-xl text-center pt-4">Top 5 Players</h3>
        {leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div 
                key={`${player.name}-${player.timestamp}`}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.name === playerName ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg w-8">#{index + 1}</span>
                  <span className="sg-body font-medium">{player.name}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${getScoreColor(player.score)}`}>
                    {player.score}/{totalSounds}
                  </span>
                  <div className="text-xs opacity-70">
                    {formatTime(player.totalTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="sg-body text-center opacity-70">
            Be the first to play and appear on the leaderboard!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
