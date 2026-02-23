export interface Team {
  id: string;
  name: string;
  engName: string;
  city: string;
  stadium: string;
  color: string;
  logo: string;
  description: string;
}

export interface GameSchedule {
  date: string;
  day: string;
  games: {
    home: string;
    away: string;
    stadium: string;
    time: string;
    note?: string;
  }[];
}

export interface TicketLink {
  name: string;
  url: string;
  description: string;
}
