
import React from 'react';
import { Button } from '@/components/ui/button';
interface SoundCardOptionsProps {
  soundOptions: string[];
  onResponse: (selectedAnswer: string) => void;
}
export const SoundCardOptions: React.FC<SoundCardOptionsProps> = ({
  soundOptions,
  onResponse
}) => {
  const getChineseTranslation = (option: string) => {
    const translations: Record<string, string> = {
      "MRT Chime": "地铁铃声",
      "Bus Doors Closing": "巴士关门提示",
      "Koel Bird (\"Uwu\" Bird)": "噪鹃鸟 (\"呜呜\"鸟)",
      "Hawker Centre": "小贩中心",
      "Ice Cream Cart Bell": "冰淇淋车铃",
      "Kallang Wave": "加冷人浪",
      "Lion Dance": "舞狮",
      "Wet Market": "巴杀",
      "National Anthem": "国歌",
      "Mahjong": "麻将"
    };
    return translations[option];
  };
  return <div className="space-y-4">
      <p className="sg-body font-medium text-center">
        What sound did you hear?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {soundOptions.map(option => {
        const chineseTranslation = getChineseTranslation(option);
        return <Button key={option} onClick={() => onResponse(option)} className="bg-gray-100 hover:bg-[#005da9] hover:text-white text-gray-800 rounded-full px-6 py-4 text-sm transition-colors border border-gray-300 flex flex-col items-center min-h-[80px] w-full">
              <span className="leading-tight">{option}</span>
              {chineseTranslation && <span className="text-xs md:text-sm mt-0.5 opacity-70 leading-tight">
                  {chineseTranslation}
                </span>}
            </Button>;
      })}
      </div>
    </div>;
};
