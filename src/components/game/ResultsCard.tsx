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
  feedbackData: {
    rating: number;
    interestedInHearingTest: string;
    selectedOutlet: string;
  } | null;
  onRetakeQuiz: () => void;
}
export const ResultsCard: React.FC<ResultsCardProps> = ({
  playerName,
  results,
  sounds,
  totalTime,
  playerParticulars,
  feedbackData,
  onRetakeQuiz
}) => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
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

    // Store player data with rating from feedback
    if (playerParticulars && feedbackData) {
      const updatedParticulars = {
        ...playerParticulars,
        rating: feedbackData.rating
      };
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
  }, [playerName, score, totalTime, playerParticulars, feedbackData]);
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getChineseTranslation = (answer: string) => {
    const translations: {
      [key: string]: string;
    } = {
      "MRT Chime": "地铁铃声",
      "Bus Doors Closing": "巴士关门提示",
      "Koel Bird (\"Uwu\" Bird)": "噪鹃鸟 (\"呜呜\"鸟)",
      "Hawker Centre": "小贩中心",
      "Ice Cream Cart Bell": "冰淇淋推车铃",
      "Kallang Wave": "加冷人浪",
      "Lion Dance": "舞狮",
      "Wet Market": "巴杀",
      "National Anthem": "国歌",
      "Mahjong": "麻将"
    };
    return translations[answer] || '';
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
              const chineseTranslation = getChineseTranslation(result.selectedAnswer);
              return <div key={result.soundId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="sg-body font-medium">Sound {soundNumber}</span>
                    <div className="text-right">
                      <span className={`font-bold ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {result.correct ? '✓ Correct' : '✗ Wrong'}
                      </span>
                      <div className="text-xs opacity-70">
                        Your answer: {result.selectedAnswer}
                        {chineseTranslation && <div className="text-xs opacity-60">
                            {chineseTranslation}
                          </div>}
                      </div>
                    </div>
                  </div>;
            })}
            </div>
          </div>

          <div className="space-y-4 p-4 md:p-6 bg-blue-50 rounded-xl">
            <h3 className="sg-subheading text-xl text-center leading-8">Redeem your FREE gift and hearing test in our clinic!</h3>
            <p className="sg-body text-center">Show this page to our friendly staff to redeem your gift*. Do note that each player can only redeem their gift and hearing test once.</p>
            <p className="sg-body text-center italic text-xs font-light">*Online players are encouraged to give us a call at 6238 8832 before heading down to redeem your items at any of our clinics to ensure availability of gifts.</p>
          </div>

        </CardContent>
      </Card>

      <Leaderboard leaderboard={leaderboard.slice(0, 5)} playerName={playerName} totalSounds={totalSounds} />
    </div>;
};