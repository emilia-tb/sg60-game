import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PlayerResult, SoundData } from '../SG60Game';
interface ResultsCardProps {
  playerName: string;
  results: PlayerResult[];
  sounds: SoundData[];
  onRetakeQuiz: () => void;
}
export const ResultsCard: React.FC<ResultsCardProps> = ({
  playerName,
  results,
  sounds,
  onRetakeQuiz
}) => {
  const score = results.filter(result => result.heard).length;
  const totalSounds = sounds.length;
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };
  return <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-4 md:p-8">
      <CardContent className="space-y-6 md:space-y-8">
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
          <h3 className="sg-subheading text-xl text-center">Sound Breakdown</h3>
          <div className="grid gap-3">
            {results.map((result, index) => {
            const sound = sounds.find(s => s.id === result.soundId);
            return <div key={result.soundId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="sg-body font-medium">{sound?.name}</span>
                  <span className={`font-bold ${result.heard ? 'text-green-600' : 'text-red-600'}`}>
                    {result.heard ? '✓ Heard' : '✗ Not heard'}
                  </span>
                </div>;
          })}
          </div>
        </div>

        <div className="space-y-4 p-4 md:p-6 bg-blue-50 rounded-xl">
          <h3 className="sg-subheading text-xl text-center">Redeem your gift and hearing test</h3>
          <p className="sg-body text-center">
            Show this page to our friendly staff to redeem your gift.
          </p>
          <div className="text-center">
            <Button onClick={() => window.open('https://www.hearingpartners.com.sg/contact-us/', '_blank')} className="sg-button rounded-full px-4 md:px-8 py-3 md:py-4 text-sm md:text-lg hover:opacity-90 transition-opacity w-full md:w-auto">
              Book an Appointment
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={onRetakeQuiz} style={{
          backgroundColor: '#005da9'
        }} className="text-white rounded-full px-4 md:px-8 py-3 md:py-4 text-sm md:text-lg hover:opacity-90 transition-opacity w-full md:w-auto">
            Retake the quiz
          </Button>
        </div>
      </CardContent>
    </Card>;
};
