import { Team, GameSchedule, TicketLink } from './types';

export const TEAMS: Team[] = [
  {
    id: 'lg',
    name: 'LG 트윈스',
    engName: 'LG Twins',
    city: '서울',
    stadium: '잠실야구장',
    color: '#C30452',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_LG.png',
    description: '서울을 연고로 하는 명문 구단으로, 강력한 팬덤과 전통을 자랑합니다.',
    foundedYear: 1990,
    championships: '4회 (1990, 1994, 2023, 2025)'
  },
  {
    id: 'kt',
    name: 'KT 위즈',
    engName: 'KT Wiz',
    city: '수원',
    stadium: '수원 케이티 위즈 파크',
    color: '#000000',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_KT.png',
    description: '마법 같은 야구로 수원의 자부심이 된 신흥 강호입니다.',
    foundedYear: 2013,
    championships: '1회 (2021)'
  },
  {
    id: 'ssg',
    name: 'SSG 랜더스',
    engName: 'SSG Landers',
    city: '인천',
    stadium: '인천 SSG 랜더스필드',
    color: '#CE0E2D',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_SK.png',
    description: '인천 야구의 자존심을 잇는 상륙자들, 화끈한 공격 야구를 지향합니다.',
    foundedYear: 2021,
    championships: '5회 (2007, 2008, 2010, 2018, 2022) ※ SK 와이번스 우승 기록 포함'
  },
  {
    id: 'nc',
    name: 'NC 다이노스',
    engName: 'NC Dinos',
    city: '창원',
    stadium: '창원 NC 파크',
    color: '#071D3D',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_NC.png',
    description: '공룡 군단의 거침없는 질주, 최첨단 구장을 홈으로 사용합니다.',
    foundedYear: 2011,
    championships: '1회 (2020)'
  },
  {
    id: 'doosan',
    name: '두산 베어스',
    engName: 'Doosan Bears',
    city: '서울',
    stadium: '잠실야구장',
    color: '#131230',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_OB.png',
    description: '끈기 있는 허슬두 정신으로 무장한 가을 야구의 단골 손님입니다.',
    foundedYear: 1982,
    championships: '6회 (1982, 1995, 2001, 2015, 2016, 2019) ※ OB 베어스 우승 기록 포함'
  },
  {
    id: 'kia',
    name: 'KIA 타이거즈',
    engName: 'KIA Tigers',
    city: '광주',
    stadium: '광주-기아 챔피언스 필드',
    color: '#EA0029',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_HT.png',
    description: 'KBO 리그 최다 우승에 빛나는 전통의 명가, 호랑이 군단입니다.',
    foundedYear: 2001,
    championships: '12회 (1983, 1986~1989, 1991, 1993, 1996, 1997, 2009, 2017, 2024) ※ 해태 타이거즈 우승 기록 포함'
  },
  {
    id: 'lotte',
    name: '롯데 자이언츠',
    engName: 'Lotte Giants',
    city: '부산',
    stadium: '사직야구장',
    color: '#002955',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_LT.png',
    description: '구도 부산의 열정을 상징하는 거인들, 가장 뜨거운 응원 문화를 가졌습니다.',
    foundedYear: 1982,
    championships: '2회 (1984, 1992)'
  },
  {
    id: 'samsung',
    name: '삼성 라이온즈',
    engName: 'Samsung Lions',
    city: '대구',
    stadium: '대구 삼성 라이온즈 파크',
    color: '#074CA1',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_SS.png',
    description: '푸른 사자들의 명가 재건, 대구의 자부심을 지키는 구단입니다.',
    foundedYear: 1982,
    championships: '8회 (1985, 2002, 2005, 2006, 2011~2014)'
  },
  {
    id: 'hanwha',
    name: '한화 이글스',
    engName: 'Hanwha Eagles',
    city: '대전',
    stadium: '한화생명 이글스 파크',
    color: '#FF6600',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_HH.png',
    description: '불꽃 투혼으로 승리를 향해 비상하는 독수리 군단입니다.',
    foundedYear: 1986,
    championships: '1회 (1999)'
  },
  {
    id: 'kiwoom',
    name: '키움 히어로즈',
    engName: 'Kiwoom Heroes',
    city: '서울',
    stadium: '고척 스카이돔',
    color: '#820024',
    logo: 'https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/emblem/regular/fixed/emblem_WO.png',
    description: '젊은 패기와 육성 시스템으로 승부하는 고척돔의 영웅들입니다.',
    foundedYear: 2008,
    championships: '-'
  }
];

export const SCHEDULE: GameSchedule[] = [
  {
    date: '2026-03-12',
    day: '목',
    games: [
      { home: '두산', away: '키움', stadium: '이천두', time: '13:00' },
      { home: '한화', away: '삼성', stadium: '대전', time: '13:00' },
      { home: 'KIA', away: 'SSG', stadium: '광주', time: '13:00' },
      { home: '롯데', away: 'KT', stadium: '사직', time: '13:00' },
      { home: 'NC', away: 'LG', stadium: '마산', time: '13:00' }
    ]
  },
  {
    date: '2026-03-13',
    day: '금',
    games: [
      { home: '두산', away: '키움', stadium: '이천두', time: '13:00' },
      { home: '한화', away: '삼성', stadium: '대전', time: '13:00' },
      { home: 'KIA', away: 'SSG', stadium: '광주', time: '13:00' },
      { home: '롯데', away: 'KT', stadium: '사직', time: '13:00' },
      { home: 'NC', away: 'LG', stadium: '마산', time: '13:00' }
    ]
  },
  {
    date: '2026-03-14',
    day: '토',
    games: [
      { home: '두산', away: '삼성', stadium: '이천두', time: '13:00' },
      { home: '한화', away: 'SSG', stadium: '대전', time: '13:00' },
      { home: 'KIA', away: 'KT', stadium: '광주', time: '13:00' },
      { home: '롯데', away: 'LG', stadium: '사직', time: '13:00' },
      { home: 'NC', away: '키움', stadium: '마산', time: '13:00' }
    ]
  },
  {
    date: '2026-03-15',
    day: '일',
    games: [
      { home: '두산', away: '삼성', stadium: '이천두', time: '13:00' },
      { home: '한화', away: 'SSG', stadium: '대전', time: '13:00' },
      { home: 'KIA', away: 'KT', stadium: '광주', time: '13:00' },
      { home: '롯데', away: 'LG', stadium: '사직', time: '13:00' },
      { home: 'NC', away: '키움', stadium: '마산', time: '13:00' }
    ]
  },
  {
    date: '2026-03-16',
    day: '월',
    games: [
      { home: 'SSG', away: '삼성', stadium: '문학', time: '13:00' },
      { home: 'KT', away: 'LG', stadium: '수원', time: '13:00' },
      { home: '한화', away: '두산', stadium: '대전', time: '13:00' },
      { home: '롯데', away: '키움', stadium: '사직', time: '13:00' },
      { home: 'NC', away: 'KIA', stadium: '창원', time: '13:00' }
    ]
  },
  {
    date: '2026-03-17',
    day: '화',
    games: [
      { home: 'SSG', away: '삼성', stadium: '문학', time: '13:00' },
      { home: 'KT', away: 'LG', stadium: '수원', time: '13:00' },
      { home: '한화', away: '두산', stadium: '대전', time: '13:00' },
      { home: '롯데', away: '키움', stadium: '사직', time: '13:00' },
      { home: 'NC', away: 'KIA', stadium: '창원', time: '13:00' }
    ]
  },
  {
    date: '2026-03-18',
    day: '수',
    games: [] // Rest Day
  },
  {
    date: '2026-03-19',
    day: '목',
    games: [
      { home: 'SSG', away: 'LG', stadium: '문학', time: '13:00' },
      { home: 'KT', away: '키움', stadium: '수원', time: '13:00' },
      { home: '한화', away: 'KIA', stadium: '대전', time: '13:00' },
      { home: '롯데', away: '두산', stadium: '사직', time: '13:00' },
      { home: 'NC', away: '삼성', stadium: '창원', time: '13:00' }
    ]
  },
  {
    date: '2026-03-20',
    day: '금',
    games: [
      { home: 'SSG', away: 'LG', stadium: '문학', time: '13:00' },
      { home: 'KT', away: '키움', stadium: '수원', time: '13:00' },
      { home: '한화', away: 'KIA', stadium: '대전', time: '13:00' },
      { home: '롯데', away: '두산', stadium: '사직', time: '13:00' },
      { home: 'NC', away: '삼성', stadium: '창원', time: '13:00' }
    ]
  },
  {
    date: '2026-03-21',
    day: '토',
    games: [
      { home: '두산', away: 'KIA', stadium: '잠실', time: '13:00' },
      { home: 'SSG', away: '키움', stadium: '문학', time: '13:00' },
      { home: 'KT', away: 'NC', stadium: '수원', time: '13:00' },
      { home: '삼성', away: 'LG', stadium: '대구', time: '13:00' },
      { home: '롯데', away: '한화', stadium: '사직', time: '13:00' }
    ]
  },
  {
    date: '2026-03-22',
    day: '일',
    games: [
      { home: '두산', away: 'KIA', stadium: '잠실', time: '13:00' },
      { home: 'SSG', away: '키움', stadium: '문학', time: '13:00' },
      { home: 'KT', away: 'NC', stadium: '수원', time: '13:00' },
      { home: '삼성', away: 'LG', stadium: '대구', time: '13:00' },
      { home: '롯데', away: '한화', stadium: '사직', time: '13:00' }
    ]
  },
  {
    date: '2026-03-23',
    day: '월',
    games: [
      { home: 'LG', away: '키움', stadium: '잠실', time: '13:00' },
      { home: 'SSG', away: '롯데', stadium: '문학', time: '13:00' },
      { home: 'KT', away: '두산', stadium: '수원', time: '13:00' },
      { home: '한화', away: 'NC', stadium: '대전', time: '13:00' },
      { home: '삼성', away: 'KIA', stadium: '대구', time: '13:00' }
    ]
  },
  {
    date: '2026-03-24',
    day: '화',
    games: [
      { home: 'LG', away: '키움', stadium: '잠실', time: '13:00' },
      { home: 'SSG', away: '롯데', stadium: '문학', time: '13:00' },
      { home: 'KT', away: '두산', stadium: '수원', time: '13:00' },
      { home: '한화', away: 'NC', stadium: '대전', time: '13:00' },
      { home: '삼성', away: 'KIA', stadium: '대구', time: '13:00' }
    ]
  }
];

export const TICKET_LINKS: TicketLink[] = [
  {
    name: '인터파크 티켓',
    url: 'https://ticket.interpark.com',
    description: '두산, LG, 키움, SSG 등 주요 구단 티켓 예매'
  },
  {
    name: '티켓링크',
    url: 'https://www.ticketlink.co.kr',
    description: 'KIA, 삼성, KT, 한화 등 주요 구단 티켓 예매'
  },
  {
    name: 'KBO 공식 홈페이지',
    url: 'https://www.koreabaseball.com',
    description: '공식 경기 일정 및 기록 확인'
  }
];

export const NOTICE = {
  title: "2026 KBO 시범경기 일정 발표",
  date: "2026. 2. 4. (수)",
  content: [
    "KBO는 2월 4일(수) 2026 KBO 시범경기 일정을 발표했다.",
    "2026 KBO 시범경기는 3월 12일(목)부터 24일(화)까지 팀당 12 경기씩 총 60 경기가 치러진다.",
    "개막전은 이천(키움-두산), 대전(삼성-한화), 광주(SSG-KIA), 사직(KT-롯데), 마산(LG-NC) 5개 구장에서 펼쳐진다.",
    "이번 시범경기 일정은 그라운드 공사 등으로 사용이 불가한 구장(잠실: 3월 12일(목)~20일(금) / 고척: 3월 12일(목)~24일(화) / 문학: 3월 12일(목)~15일(일) / 수원: 3월 12일(목)~15일(일) / 대구: 3월 12일(목)~20일(금) / 광주: 3월 16일(월)~20일(금) / 창원: 3월 12일(목)~15일(일))의 상황을 고려해 편성했다.",
    "시범경기는 소속선수 및 육성선수가 출장 가능하며, 출장 선수 인원 제한은 없다. 모든 시범경기는 오후 1시에 개시되고 연장전과 더블헤더는 실시하지 않는다. 취소 경기는 재편성되지 않으며, 비디오 판독은 각 팀당 2회 신청 가능하다(단, 2회 연속 판정 번복 시 1회 추가). 또한, 체크 스윙 비디오 판독도 팀당 2회 부여된다(단, 번복 시 기회 유지)."
  ]
};
