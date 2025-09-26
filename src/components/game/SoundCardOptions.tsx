
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
      "Pedestrian Traffic Light": "行人交通灯",
      "Typing on the keyboard": "在键盘上打字",
      "Fireworks": "烟花",
      "Door bell": "门铃",
      "Kompang instrument": "传统马来鼓",
      "Rain": "雨声",
      "Hawker centre": "小贩中心",
      "Mobile phone vibrating": "手机震动",
      "National Anthem": "国歌",
      "Airplane": "飞机"
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
