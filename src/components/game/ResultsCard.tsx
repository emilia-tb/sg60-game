
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { PlayerResult, SoundData, Player } from '../SG60Game';

interface ResultsCardProps {
  playerName: string;
  results: PlayerResult[];
  sounds: SoundData[];
  leaderboard: Player[];
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ 
  playerName, 
  results, 
  sounds, 
  leaderboard 
}) => {
  const score = results.filter(result => result.heard).length;
  const totalSounds = sounds.length;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-8">
      <CardContent className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="sg-subheading">
            Results for {playerName}
          </h2>
          
          <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
            {score}/{totalSounds}
          </div>
          
          <p className="sg-body">
            You heard {score} out of {totalSounds} sounds correctly!
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="sg-subheading text-xl">Sound Breakdown</h3>
          <div className="grid gap-3">
            {results.map((result, index) => {
              const sound = sounds.find(s => s.id === result.soundId);
              return (
                <div key={result.soundId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="sg-body font-medium">{sound?.name}</span>
                  <span className={`font-bold ${result.heard ? 'text-green-600' : 'text-red-600'}`}>
                    {result.heard ? '✓ Heard' : '✗ Not heard'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 p-6 bg-blue-50 rounded-xl">
          <h3 className="sg-subheading text-xl">Redeem your free gifts at our clinic</h3>
          <p className="sg-body">
            <a 
              href="https://www.hearingpartners.com.sg/contact-us/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--sg-button)] underline hover:no-underline font-medium"
            >
              Fill out this form
            </a> to reserve your free limited edition SG60 gift and hearing check and redeem it when you visit our clinic!
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="sg-subheading text-xl">Leaderboard - Top 5 Players</h3>
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
                  <span className={`font-bold text-lg ${getScoreColor(player.score)}`}>
                    {player.score}/{totalSounds}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="sg-body text-center opacity-70">
              Be the first to play and appear on the leaderboard!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
