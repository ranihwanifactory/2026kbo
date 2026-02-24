import React from 'react';
import { motion } from 'motion/react';
import { GameSchedule } from '../types';

interface CalendarViewProps {
  schedule: GameSchedule[];
  getTeamLogo: (shortName: string) => string;
  filterTeam: string;
}

export default function CalendarView({ schedule, getTeamLogo, filterTeam }: CalendarViewProps) {
  const daysInMonth = 31;
  const startDay = 0; // March 1, 2026 is Sunday (0)
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  const getDayGames = (day: number) => {
    const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
    return schedule.find(s => s.date === dateStr);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
      <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-slate-800">2026년 3월</h3>
        <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-kbo-blue" /> 경기일
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-200" /> 휴식일
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-b border-slate-100">
        {weekdays.map((day, i) => (
          <div key={day} className={`py-4 text-center text-xs font-black uppercase tracking-widest ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-400'}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square border-r border-b border-slate-50 bg-slate-50/30" />
        ))}
        {calendarDays.map(day => {
          const dayGames = getDayGames(day);
          const isGameDay = dayGames && dayGames.games.length > 0;
          const isRestDay = day >= 12 && day <= 24 && (!dayGames || dayGames.games.length === 0);

          return (
            <div 
              key={day} 
              className={`aspect-square border-r border-b border-slate-100 p-1 md:p-2 flex flex-col relative group transition-colors ${isGameDay ? 'bg-white' : 'bg-slate-50/30'}`}
            >
              <span className={`text-xs md:text-sm font-bold mb-1 ${(startDay + day - 1) % 7 === 0 ? 'text-red-500' : (startDay + day - 1) % 7 === 6 ? 'text-blue-500' : 'text-slate-400'}`}>
                {day}
              </span>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {dayGames?.games.map((game, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx} 
                    className={`p-1 rounded-md text-[8px] md:text-[10px] font-bold flex items-center justify-center gap-1 border ${
                      game.home === filterTeam || game.away === filterTeam
                        ? 'bg-kbo-blue text-white border-kbo-blue shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      <span>{game.away}</span>
                      <span className="opacity-50">vs</span>
                      <span>{game.home}</span>
                    </div>
                  </motion.div>
                ))}
                {isRestDay && (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">REST</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
