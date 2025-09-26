import React, { useState, useEffect } from 'react';
import { WelcomeCard } from './game/WelcomeCard';
import { NameCard } from './game/NameCard';
import { CountdownCard } from './game/CountdownCard';
import { SoundCard } from './game/SoundCard';
import { ParticularsCard } from './game/ParticularsCard';
import { FeedbackCard } from './game/FeedbackCard';
import { ResultsCard } from './game/ResultsCard';

export interface SoundData {
  id: number;
  name: string;
  description: string;
  audioUrl: string;
  correctAnswer: string;
}

export interface PlayerResult {
  soundId: number;
  selectedAnswer: string;
  correct: boolean;
  timeSpent: number;
}

export interface Player {
  name: string;
  score: number;
  totalTime: number;
  timestamp: number;
}

export interface PlayerParticulars {
  name: string;
  phone: string;
  email: string;
  rating: number;
}

const soundOptions = [
  "Pedestrian Traffic Light",
  "Typing on the keyboard", 
  "Fireworks",
  "Door bell",
  "Kompang instrument",
  "Rain",
  "Hawker centre",
  "Mobile phone vibrating",
  "National Anthem",
  "Airplane"
];

const sounds: SoundData[] = [
  {
    id: 1,
    name: "Airplane",
    description: "MY Sound Game - Airplane",
    audioUrl: "sounds/my-sound-game-airplane.mp3",
    correctAnswer: "Airplane"
  },
  {
    id: 2,
    name: "Door bell",
    description: "MY Sound Game - Door Bell Sound Effect",
    audioUrl: "sounds/my-sound-game-door-bell-sound-effect.mp3",
    correctAnswer: "Door bell"
  },
  {
    id: 3,
    name: "Fireworks",
    description: "MY Sound Game - Fireworks",
    audioUrl: "sounds/my-sound-game-fireworks.mp3",
    correctAnswer: "Fireworks"
  },
  {
    id: 4,
    name: "Hawker centre",
    description: "MY Sound Game - Hawker",
    audioUrl: "sounds/my-sound-game-hawker.mp3",
    correctAnswer: "Hawker centre"
  },
  {
    id: 5,
    name: "Kompang instrument",
    description: "MY Sound Game - Kompang Instrument",
    audioUrl: "sounds/my-sound-game-kompang-instrument.mp3",
    correctAnswer: "Kompang instrument"
  },
  {
    id: 6,
    name: "Mobile phone vibrating",
    description: "MY Sound Game - Mobile Phone Vibrating",
    audioUrl: "sounds/my-sound-game-mobile-phone-vibrating.mp3",
    correctAnswer: "Mobile phone vibrating"
  },
  {
    id: 7,
    name: "Pedestrian Traffic Light",
    description: "MY Sound Game - Pedestrian Traffic Lights",
    audioUrl: "sounds/my-sound-game-pedestrian-traffic-lights.mp3",
    correctAnswer: "Pedestrian Traffic Light"
  },
  {
    id: 8,
    name: "Typing on the keyboard",
    description: "MY Sound Game - Typing on the Keyboard",
    audioUrl: "sounds/my-sound-game-typing-on-the-keyboard.mp3",
    correctAnswer: "Typing on the keyboard"
  },
  {
    id: 9,
    name: "Rain",
    description: "MY Sound Game - Rain",
    audioUrl: "sounds/my-sound-game-rain.mp3",
    correctAnswer: "Rain"
  },
  {
    id: 10,
    name: "National Anthem",
    description: "MY Sound Game - National Anthem",
    audioUrl: "sounds/my-sound-game-national-anthem.mp3",
    correctAnswer: "National Anthem"
  }
];

const SG60Game: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [totalGameTime, setTotalGameTime] = useState<number>(0);
  const [playerParticulars, setPlayerParticulars] = useState<PlayerParticulars | null>(null);
  const [feedbackData, setFeedbackData] = useState<{
    rating: number;
    interestedInHearingTest: string;
    selectedOutlet: string;
  } | null>(null);

  const handleStartGame = () => {
    setCurrentCard(1);
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setCurrentCard(2);
  };

  const handleCountdownComplete = () => {
    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setCurrentCard(3);
  };

  const handleSoundResponse = (soundId: number, selectedAnswer: string) => {
    const timeSpent = Date.now() - questionStartTime;
    const sound = sounds.find(s => s.id === soundId);
    const correct = sound?.correctAnswer === selectedAnswer;
    
    const newResult: PlayerResult = { 
      soundId, 
      selectedAnswer, 
      correct,
      timeSpent 
    };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    
    const nextCard = currentCard + 1;
    if (nextCard <= 12) {
      setQuestionStartTime(Date.now());
      setCurrentCard(nextCard);
    } else {
      setTotalGameTime(Date.now() - gameStartTime);
      setCurrentCard(13);
    }
  };

  const handleParticularsSubmit = (particulars: PlayerParticulars) => {
    setPlayerParticulars(particulars);
    setCurrentCard(14);
  };

  const handleFeedbackComplete = (rating: number, interestedInHearingTest: string, selectedOutlet: string) => {
    setFeedbackData({ rating, interestedInHearingTest, selectedOutlet });
    
    // Store feedback data
    const responseData = {
      playerName,
      interestedInHearingTest,
      selectedOutlet: interestedInHearingTest === 'yes' ? selectedOutlet : '',
      timestamp: new Date().toISOString()
    };
    
    const storedResponses = JSON.parse(localStorage.getItem('sg60-hearing-test-responses') || '[]');
    const updatedResponses = [...storedResponses, responseData];
    localStorage.setItem('sg60-hearing-test-responses', JSON.stringify(updatedResponses));
    
    setCurrentCard(15);
  };

  const handleRetakeQuiz = () => {
    setCurrentCard(0);
    setPlayerName('');
    setResults([]);
    setGameStartTime(0);
    setQuestionStartTime(0);
    setTotalGameTime(0);
    setPlayerParticulars(null);
    setFeedbackData(null);
  };

  const getElapsedTime = () => {
    if (gameStartTime === 0) return 0;
    return Math.floor((Date.now() - gameStartTime) / 1000);
  };

  const renderCard = () => {
    switch (currentCard) {
      case 0:
        return <WelcomeCard onStart={handleStartGame} />;
      case 1:
        return <NameCard onSubmit={handleNameSubmit} />;
      case 2:
        return <CountdownCard onComplete={handleCountdownComplete} />;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        const soundIndex = currentCard - 3;
        const sound = sounds[soundIndex];
        const soundNumber = soundIndex + 1;
        return (
          <SoundCard
            sound={sound}
            soundNumber={soundNumber}
            totalSounds={sounds.length}
            soundOptions={soundOptions}
            elapsedTime={getElapsedTime()}
            onResponse={(selectedAnswer) => handleSoundResponse(sound.id, selectedAnswer)}
          />
        );
      case 13:
        return (
          <ParticularsCard
            playerName={playerName}
            onSubmit={handleParticularsSubmit}
          />
        );
      case 14:
        return (
          <FeedbackCard
            playerName={playerName}
            playerParticulars={playerParticulars}
            onComplete={handleFeedbackComplete}
          />
        );
      case 15:
        return (
          <ResultsCard
            playerName={playerName}
            results={results}
            sounds={sounds}
            totalTime={totalGameTime}
            playerParticulars={playerParticulars}
            feedbackData={feedbackData}
            onRetakeQuiz={handleRetakeQuiz}
          />
        );
      default:
        return <WelcomeCard onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {renderCard()}
      </div>
    </div>
  );
};

export default SG60Game;
