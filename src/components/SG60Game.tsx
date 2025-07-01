
import React, { useState, useEffect } from 'react';
import { WelcomeCard } from './game/WelcomeCard';
import { NameCard } from './game/NameCard';
import { CountdownCard } from './game/CountdownCard';
import { SoundCard } from './game/SoundCard';
import { ParticularsCard } from './game/ParticularsCard';
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
  "MRT Chime",
  "Bus Doors Closing", 
  "Koel Bird (\"Uwu\" Bird)",
  "Hawker Centre",
  "Ice Cream Scoop",
  "Kallang Wave",
  "Lion Dance",
  "Wet Market",
  "National Anthem",
  "Mahjong"
];

const sounds: SoundData[] = [
  {
    id: 1,
    name: "Mahjong",
    description: "The sound of mahjong tiles",
    audioUrl: "/sg60-sound-game-mahjong.wav",
    correctAnswer: "Mahjong"
  },
  {
    id: 2,
    name: "Hawker Sounds",
    description: "The bustling sounds of a Singapore hawker centre",
    audioUrl: "/sg60-sound-game-hawker.mp3",
    correctAnswer: "Hawker Centre"
  },
  {
    id: 3,
    name: "Birdsong",
    description: "The sound of the iconic Koel bird",
    audioUrl: "/sg60-sound-game-koel-bird.mp3",
    correctAnswer: "Koel Bird (\"Uwu\" Bird)"
  },
  {
    id: 4,
    name: "Lion Dance",
    description: "Traditional lion dance performance",
    audioUrl: "/sg60-sound-game-lion-dance.mp3",
    correctAnswer: "Lion Dance"
  },
  {
    id: 5,
    name: "Ice Cream Cart",
    description: "The sound of an ice cream scoop",
    audioUrl: "/sg-sound-game-ice-cream-bell.mp3",
    correctAnswer: "Ice Cream Scoop"
  },
  {
    id: 6,
    name: "Wet Market",
    description: "The lively sounds of a traditional wet market",
    audioUrl: "/sg60-sound-game-market.mp3",
    correctAnswer: "Wet Market"
  },
  {
    id: 7,
    name: "MRT Chime",
    description: "Singapore MRT door closing chime",
    audioUrl: "/sg60-sound-game-mrt.mp3",
    correctAnswer: "MRT Chime"
  },
  {
    id: 8,
    name: "Bus Doors Closing",
    description: "Singapore bus door closing beep",
    audioUrl: "/sg60-sound-game-bus-doors-closing.mp3",
    correctAnswer: "Bus Doors Closing"
  },
  {
    id: 9,
    name: "Kallang Wave",
    description: "The roar of the Kallang Wave at the stadium",
    audioUrl: "/sg60-sound-game-kallang-wave.mp3",
    correctAnswer: "Kallang Wave"
  },
  {
    id: 10,
    name: "National Anthem",
    description: "Singapore's national anthem",
    audioUrl: "/sg60-sound-game-national-anthem.mp3",
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

  const handleRetakeQuiz = () => {
    setCurrentCard(0);
    setPlayerName('');
    setResults([]);
    setGameStartTime(0);
    setQuestionStartTime(0);
    setTotalGameTime(0);
    setPlayerParticulars(null);
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
          <ResultsCard
            playerName={playerName}
            results={results}
            sounds={sounds}
            totalTime={totalGameTime}
            playerParticulars={playerParticulars}
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
