export interface Team {
  id: string;
  name: string;
  engName: string;
  city: string;
  stadium: string;
  color: string;
  logo: string;
  description: string;
  foundedYear: number;
  championships: string;
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

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: any;
}

export interface VideoPost {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  teamId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: any;
  comments: Comment[];
}
