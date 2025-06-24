import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaderboard } from './Leaderboard';
import type { PlayerResult, SoundData, Player, PlayerParticulars } from '../SG60Game';
interface ResultsCardProps {
  playerName: string;
  results: PlayerResult[];
  sounds: SoundData[];
  totalTime: number;
  playerParticulars: PlayerParticulars | null;
  onRetakeQuiz: () => void;
}
export const ResultsCard: React.FC<ResultsCardProps> = ({
  playerName,
  results,
  sounds,
  totalTime,
  playerParticulars,
  onRetakeQuiz
}) => {
  const [rating, setRating] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [hasRated, setHasRated] = useState(false);
  const score = results.filter(result => result.correct).length;
  const totalSounds = sounds.length;
  useEffect(() => {
    // Load leaderboard and add current player
    const storedLeaderboard = JSON.parse(localStorage.getItem('sg60-leaderboard') || '[]');
    const newPlayer: Player = {
      name: playerName,
      score,
      totalTime: Math.floor(totalTime / 1000),
      timestamp: Date.now()
    };
    const updatedLeaderboard = [...storedLeaderboard, newPlayer].sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.totalTime - b.totalTime;
    }).slice(0, 50);
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('sg60-leaderboard', JSON.stringify(updatedLeaderboard));
  }, [playerName, score, totalTime]);
  const handleRating = (stars: number) => {
    setRating(stars);
    setHasRated(true);
    if (playerParticulars) {
      const updatedParticulars = {
        ...playerParticulars,
        rating: stars
      };

      // Store the updated particulars in localStorage for CSV export
      const storedParticipants = JSON.parse(localStorage.getItem('sg60-participants') || '[]');
      const newParticipant = {
        ...updatedParticulars,
        score,
        totalTime: Math.floor(totalTime / 1000),
        timestamp: new Date().toISOString()
      };
      const updatedParticipants = [...storedParticipants, newParticipant];
      localStorage.setItem('sg60-participants', JSON.stringify(updatedParticipants));
      console.log('Updated player data:', newParticipant);
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };
  return <div className="space-y-6">
      <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-4 md:p-8">
        <CardContent className="space-y-6 md:space-y-8">
          <div className="text-center space-y-4">
            <h2 className="sg-subheading">
              Results for {playerName}
            </h2>
            
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {score}/{totalSounds}
            </div>
            
            <p className="sg-body">
              You got {score} out of {totalSounds} sounds correct!
            </p>
            
            <p className="sg-body text-sm opacity-70">
              Total time: {Math.floor(totalTime / 1000)} seconds
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="sg-subheading text-xl text-center">Sound Breakdown</h3>
            <div className="grid gap-3">
              {results.map((result, index) => {
              const soundNumber = index + 1;
              return <div key={result.soundId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="sg-body font-medium">Sound {soundNumber}</span>
                    <div className="text-right">
                      <span className={`font-bold ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {result.correct ? '✓ Correct' : '✗ Wrong'}
                      </span>
                      <div className="text-xs opacity-70">
                        Your answer: {result.selectedAnswer}
                      </div>
                    </div>
                  </div>;
            })}
            </div>
          </div>

          <div className="space-y-4 p-4 md:p-6 bg-blue-50 rounded-xl">
            <h3 className="sg-subheading text-xl text-center">Redeem your gift and hearing test</h3>
            <p className="sg-body text-center">Show this page to our friendly staff to redeem your gift. Do note that each player can only redeem their gift and hearing test once.</p>
          </div>

          <div className="space-y-4 p-4 md:p-6 bg-yellow-50 rounded-xl">
            <h3 className="sg-subheading text-xl text-center">How did you enjoy the SG60 Sound Game?</h3>
            <p className="sg-body text-center">Please rate your experience!</p>
            
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => handleRating(star)} className={`text-3xl transition-colors ${star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}>
                  {star <= rating ? '⭐' : '☆'}
                </button>)}
            </div>
            
            {hasRated && <p className="sg-body text-center text-sm opacity-70">
                Thank you for your feedback! ({rating} star{rating !== 1 ? 's' : ''})
              </p>}
          </div>
        </CardContent>
      </Card>

      <Leaderboard leaderboard={leaderboard.slice(0, 5)} playerName={playerName} totalSounds={totalSounds} />

      <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-4">
        <CardContent className="text-center pt-4">
          <Button onClick={onRetakeQuiz} style={{
          backgroundColor: '#005da9'
        }} className="text-white rounded-full px-4 md:px-8 py-3 md:py-4 text-sm md:text-lg hover:opacity-90 transition-opacity w-full md:w-auto">
            Retake the quiz
          </Button>
        </CardContent>
      </Card>
    </div>;
};