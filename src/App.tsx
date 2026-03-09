/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Calendar, Users, Ticket, Gamepad2, ChevronRight, ExternalLink, MapPin, Clock, Info, Share2, Globe, List, CalendarDays, Eye } from 'lucide-react';
import { TEAMS, SCHEDULE, TICKET_LINKS, NOTICE } from './constants';
import NumberBaseball from './components/NumberBaseball';
import VideoGallery from './components/VideoGallery';
import CalendarView from './components/CalendarView';
import { db, doc, getDoc, setDoc, increment } from './services/firebase';

type Section = 'notice' | 'schedule' | 'teams' | 'tickets' | 'gallery' | 'game';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('notice');
  const [filterTeam, setFilterTeam] = useState<string>('전체');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [visitorStats, setVisitorStats] = useState<{ today: number; total: number }>({ today: 0, total: 0 });

  useEffect(() => {
    const trackVisit = async () => {
      console.log('Tracking visit via Firebase...');
      try {
        const today = new Date().toISOString().split('T')[0];
        const statsRef = doc(db, "stats", "visitors");
        const dailyRef = doc(db, "daily_stats", today);

        // Increment total count
        await setDoc(statsRef, { total: increment(1) }, { merge: true });
        
        // Increment daily count
        await setDoc(dailyRef, { count: increment(1) }, { merge: true });

        // Get updated stats
        const statsSnap = await getDoc(statsRef);
        const dailySnap = await getDoc(dailyRef);

        if (statsSnap.exists() && dailySnap.exists()) {
          const statsData = {
            today: dailySnap.data().count || 0,
            total: statsSnap.data().total || 0
          };
          console.log('Visit data received from Firebase:', statsData);
          setVisitorStats(statsData);
        }
      } catch (error) {
        console.error('Failed to track visit via Firebase:', error);
        // Fallback to Express API if Firebase fails (for local testing)
        try {
          const response = await fetch('/api/visit', { method: 'POST' });
          if (response.ok) {
            const data = await response.json();
            setVisitorStats(data);
          }
        } catch (apiError) {
          console.error('API Fallback also failed:', apiError);
        }
      }
    };
    trackVisit();
  }, []);

  const getTeamLogo = (shortName: string) => {
    const team = TEAMS.find(t => t.name.startsWith(shortName));
    return team ? team.logo : '';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '2026 KBO 시범경기 안내',
          text: '2026 KBO 시범경기 일정과 구단 정보를 확인해보세요!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const navItems = [
    { id: 'notice', label: '공지 및 안내', icon: Bell },
    { id: 'schedule', label: '시범경기 일정', icon: Calendar },
    { id: 'teams', label: '구단 소개', icon: Users },
    { id: 'tickets', label: '티켓 & 링크', icon: Ticket },
    { id: 'gallery', label: 'KBO 갤러리', icon: Users },
    { id: 'game', label: '숫자 야구 게임', icon: Gamepad2 },
  ];

  const filterTeams = ['전체', ...TEAMS.map(t => t.name.split(' ')[0])];

  const filteredSchedule = SCHEDULE.map(day => ({
    ...day,
    games: day.games.filter(game => 
      filterTeam === '전체' || game.home === filterTeam || game.away === filterTeam
    )
  })).filter(day => filterTeam === '전체' || day.games.length > 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex w-72 kbo-gradient text-white p-6 flex-col shrink-0 sticky top-0 h-screen">
        <div className="mb-12">
          <h1 className="text-3xl font-display font-black tracking-tighter leading-none mb-2">
            2026 KBO
          </h1>
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest">
            시범경기 안내
          </p>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                activeSection === item.id 
                  ? 'bg-white text-kbo-blue shadow-lg' 
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <item.icon size={20} className={activeSection === item.id ? 'text-kbo-blue' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-bold tracking-tight">{item.label}</span>
              {activeSection === item.id && (
                <motion.div layoutId="active-pill" className="ml-auto">
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-3 w-full p-4 glass-card rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 transition-colors"
          >
            <Share2 size={20} className="text-white/60" />
            <span className="text-sm font-bold">앱 공유하기</span>
          </button>
          
          <a 
            href="https://ranihwanibaby.tistory.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-4 glass-card rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 transition-colors"
          >
            <Globe size={20} className="text-white/60" />
            <span className="text-sm font-bold">공식 블로그</span>
          </a>

          <div className="flex items-center gap-3 p-4 glass-card rounded-2xl bg-white/5 border-white/5">
            <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-kbo-blue font-bold">
              26
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 uppercase">Season</p>
              <p className="text-sm font-bold">2026 KBO League</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 glass-card rounded-xl bg-white/5 border-white/5 text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Today</p>
              <p className="text-lg font-display font-black text-emerald-400">{visitorStats.today.toLocaleString()}</p>
            </div>
            <div className="p-3 glass-card rounded-xl bg-white/5 border-white/5 text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Total</p>
              <p className="text-lg font-display font-black text-white">{visitorStats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="md:hidden kbo-gradient text-white p-4 sticky top-0 z-50 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-display font-black tracking-tighter leading-none">2026 KBO</h1>
            <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">시범경기 안내</p>
          </div>
          <div className="h-6 w-[1px] bg-white/20 mx-1" />
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/40 uppercase">Today</span>
            <span className="text-xs font-black text-emerald-400">{visitorStats.today.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="https://ranihwanibaby.tistory.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 rounded-full"
          >
            <Globe size={18} />
          </a>
          <button onClick={handleShare} className="p-2 bg-white/10 rounded-full">
            <Share2 size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as Section)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 ${
              activeSection === item.id 
                ? 'text-kbo-blue' 
                : 'text-slate-400'
            }`}
          >
            <item.icon size={20} className={activeSection === item.id ? 'scale-110' : ''} />
            <span className="text-[10px] font-bold tracking-tight">{item.label.split(' ')[0]}</span>
            {activeSection === item.id && (
              <motion.div 
                layoutId="mobile-active-dot" 
                className="w-1 h-1 bg-kbo-blue rounded-full absolute -bottom-1"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {activeSection === 'notice' && (
              <section className="space-y-8">
                <header>
                  <h2 className="text-4xl font-display font-black tracking-tight mb-2">공지 및 안내</h2>
                  <p className="text-slate-500 font-medium">2026 KBO 리그 시범경기 관련 공식 소식</p>
                </header>

                <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Bell size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{NOTICE.title}</h3>
                      <span className="text-sm font-bold text-slate-400">{NOTICE.date}</span>
                    </div>

                    <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                      {NOTICE.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="font-bold text-kbo-blue mb-4 flex items-center gap-2">
                        <Info size={18} /> 주요 요약 사항
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex gap-3">
                          <span className="font-bold text-slate-400 shrink-0 w-20">경기 시간</span>
                          <span className="text-slate-600">전 경기 오후 1시 개시</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="font-bold text-slate-400 shrink-0 w-20">경기 방식</span>
                          <span className="text-slate-600">연장전 및 더블헤더 미실시</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="font-bold text-slate-400 shrink-0 w-20">비디오 판독</span>
                          <span className="text-slate-600">팀당 2회 (성공 시 최대 3회)</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="font-bold text-slate-400 shrink-0 w-20">체크 스윙</span>
                          <span className="text-slate-600">별도 비디오 판독 팀당 2회</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'schedule' && (
              <section className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div>
                      <h2 className="text-4xl font-display font-black tracking-tight mb-2">시범경기 일정</h2>
                      <p className="text-slate-500 font-medium">2026년 3월 12일 ~ 3월 24일 주요 경기 일정</p>
                    </div>
                    
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-kbo-blue text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <List size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('calendar')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-kbo-blue text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <CalendarDays size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap gap-2 no-scrollbar">
                    {filterTeams.map((team) => (
                      <button
                        key={team}
                        onClick={() => setFilterTeam(team)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          filterTeam === team 
                            ? 'bg-kbo-blue text-white shadow-md' 
                            : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                </header>

                {viewMode === 'list' ? (
                  <div className="grid gap-6">
                    {filteredSchedule.map((day, idx) => (
                      <div key={idx} className="glass-card rounded-3xl overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-bottom border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-display font-black text-kbo-blue">
                              {day.date.split('-')[2]}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">March 2026</p>
                              <p className="text-sm font-bold text-slate-700">{day.day}요일</p>
                            </div>
                          </div>
                          {day.games.length === 0 && filterTeam === '전체' && (
                            <span className="px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-xs font-bold">휴식일</span>
                          )}
                        </div>
                        <div className="p-2">
                          {day.games.map((game, gIdx) => (
                            <div key={gIdx} className="flex flex-col sm:flex-row items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-2xl group">
                              <div className="flex items-center gap-8 flex-1 justify-center sm:justify-start">
                                <div className="flex flex-col items-center sm:items-end min-w-[100px]">
                                  <p className="text-xs font-bold text-slate-400 mb-2">AWAY</p>
                                  <div className="flex items-center gap-2">
                                    <img src={getTeamLogo(game.away)} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                                    <p className={`text-xl font-display font-bold ${game.away === filterTeam ? 'text-kbo-blue' : ''}`}>{game.away}</p>
                                  </div>
                                </div>
                                <div className="text-slate-200 font-display font-black text-2xl">VS</div>
                                <div className="flex flex-col items-center sm:items-start min-w-[100px]">
                                  <p className="text-xs font-bold text-slate-400 mb-2">HOME</p>
                                  <div className="flex items-center gap-2">
                                    <img src={getTeamLogo(game.home)} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                                    <p className={`text-xl font-display font-bold ${game.home === filterTeam ? 'text-kbo-blue' : ''}`}>{game.home}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                <div className="flex items-center gap-2 text-slate-500">
                                  <MapPin size={16} />
                                  <span className="text-sm font-medium">{game.stadium}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                  <Clock size={16} />
                                  <span className="text-sm font-medium">{game.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {filteredSchedule.length === 0 && (
                      <div className="text-center py-20 glass-card rounded-3xl">
                        <p className="text-slate-400 font-medium">해당 구단의 경기가 없습니다.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <CalendarView 
                    schedule={filteredSchedule} 
                    getTeamLogo={getTeamLogo} 
                    filterTeam={filterTeam} 
                  />
                )}
              </section>
            )}

            {activeSection === 'teams' && (
              <section className="space-y-8">
                <header>
                  <h2 className="text-4xl font-display font-black tracking-tight mb-2">구단 소개</h2>
                  <p className="text-slate-500 font-medium">KBO 리그를 빛내는 10개의 구단</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TEAMS.map((team) => (
                    <div key={team.id} className="glass-card rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 group-hover:scale-110 transition-transform duration-500">
                          <img src={team.logo} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{team.engName}</p>
                          <h3 className="text-2xl font-display font-bold">{team.name}</h3>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">{team.description}</p>
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">
                            <MapPin size={12} /> {team.city}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">
                            <Info size={12} /> {team.stadium}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">
                            <Calendar size={12} /> 창단: {team.foundedYear}년
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-kbo-blue/5 rounded-xl border border-kbo-blue/10">
                          <p className="text-[10px] font-bold text-kbo-blue uppercase tracking-widest mb-1">우승 횟수(연도)</p>
                          <p className="text-sm font-bold text-slate-700">{team.championships}</p>
                        </div>
                        <a 
                          href={team.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                          <ExternalLink size={16} /> 공식 홈페이지 방문
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'tickets' && (
              <section className="space-y-8">
                <header>
                  <h2 className="text-4xl font-display font-black tracking-tight mb-2">티켓 & 관련 사이트</h2>
                  <p className="text-slate-500 font-medium">경기 관람을 위한 예매 및 정보 확인</p>
                </header>

                <div className="grid gap-6">
                  {TICKET_LINKS.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glass-card rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-center gap-6 mb-4 sm:mb-0">
                        <div className="w-16 h-16 rounded-2xl bg-kbo-blue/5 flex items-center justify-center text-kbo-blue group-hover:bg-kbo-blue group-hover:text-white transition-colors">
                          <Ticket size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display font-bold mb-1">{link.name}</h3>
                          <p className="text-slate-500 font-medium">{link.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-kbo-blue font-bold group-hover:translate-x-2 transition-transform">
                        바로가기 <ExternalLink size={18} />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-kbo-blue rounded-3xl text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-display font-bold mb-4">직관 꿀팁!</h3>
                    <ul className="space-y-3 opacity-90">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <p>시범경기는 정규 시즌보다 티켓 가격이 저렴하거나 무료인 경우가 많습니다.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <p>주말 경기는 매진될 수 있으니 예매 오픈 시간을 미리 확인하세요.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <p>구장별로 반입 금지 물품(캔, 병 등)이 다르니 공식 홈페이지를 꼭 확인하세요.</p>
                      </li>
                    </ul>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>
              </section>
            )}

            {activeSection === 'gallery' && (
              <section className="space-y-8">
                <VideoGallery />
              </section>
            )}

            {activeSection === 'game' && (
              <section className="space-y-8">
                <header className="text-center mb-12">
                  <h2 className="text-4xl font-display font-black tracking-tight mb-2">숫자 야구 게임</h2>
                  <p className="text-slate-500 font-medium">야구 지능을 테스트해보세요! 4자리 숫자를 맞추면 승리합니다.</p>
                </header>
                <NumberBaseball />
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
