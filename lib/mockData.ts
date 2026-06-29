export type Prediction = {
  result: 'win' | 'loss' | 'draw';
  confidence: number;
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'red';
};

export type Match = {
  id: string;
  sport: 'football' | 'basketball' | 'tennis' | 'cricket';
  date: Date;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  prediction: Prediction;
  /** @deprecated use oddsHome/oddsDraw/oddsAway — kept for backward compat */
  odds: number;
  oddsHome: number;
  oddsDraw: number;
  oddsAway: number;
  isPremium?: boolean;
  probabilityHome: number;
  probabilityDraw: number;
  probabilityAway: number;
  homeForm: number[]; // 0-100 for last 5 matches
  awayForm: number[];
  h2hStats: {
    homeWins: number;
    awayWins: number;
    draws: number;
  };
  status?: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  league?: string;
};

export type BetRecord = {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
  stakeAmount: number;
  result: 'win' | 'loss' | 'pending';
  returnAmount?: number;
  profit?: number;
  placedDate: Date;
  matchDate: Date;
};

export const mockBettingHistory: BetRecord[] = [
  {
    id: 'bet-1',
    matchId: '1',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    prediction: 'Manchester United Win',
    odds: 1.85,
    stakeAmount: 100,
    result: 'win',
    returnAmount: 185,
    profit: 85,
    placedDate: new Date(2026, 5, 20),
    matchDate: new Date(2026, 5, 21),
  },
  {
    id: 'bet-2',
    matchId: '3',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    prediction: 'Manchester City Win',
    odds: 1.45,
    stakeAmount: 200,
    result: 'win',
    returnAmount: 290,
    profit: 90,
    placedDate: new Date(2026, 5, 20),
    matchDate: new Date(2026, 5, 21),
  },
  {
    id: 'bet-3',
    matchId: '5',
    homeTeam: 'Aston Villa',
    awayTeam: 'West Ham',
    prediction: 'Aston Villa Win',
    odds: 2.75,
    stakeAmount: 150,
    result: 'loss',
    returnAmount: 0,
    profit: -150,
    placedDate: new Date(2026, 5, 19),
    matchDate: new Date(2026, 5, 20),
  },
  {
    id: 'bet-4',
    matchId: '7',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    prediction: 'Draw',
    odds: 2.95,
    stakeAmount: 100,
    result: 'win',
    returnAmount: 295,
    profit: 195,
    placedDate: new Date(2026, 5, 18),
    matchDate: new Date(2026, 5, 19),
  },
];

export const mockMatches: Match[] = [
  {
    id: '1',
    sport: 'football',
    date: new Date(2026, 5, 22),
    time: '20:00',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    prediction: { result: 'win', confidence: 78, color: 'green' },
    odds: 1.85, oddsHome: 1.85, oddsDraw: 3.40, oddsAway: 4.20,
    probabilityHome: 55, probabilityDraw: 25, probabilityAway: 20,
    homeForm: [75, 68, 82, 71, 79],
    awayForm: [88, 92, 85, 89, 81],
    h2hStats: { homeWins: 12, awayWins: 14, draws: 8 },
    status: 'live', homeScore: 2, awayScore: 1, minute: 67,
    league: 'Premier League',
  },
  {
    id: '2',
    sport: 'football',
    date: new Date(2026, 5, 22),
    time: '19:30',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    prediction: { result: 'draw', confidence: 65, color: 'yellow' },
    odds: 3.2, oddsHome: 2.10, oddsDraw: 3.20, oddsAway: 3.40,
    probabilityHome: 40, probabilityDraw: 35, probabilityAway: 25,
    homeForm: [76, 80, 74, 77, 82],
    awayForm: [72, 68, 75, 70, 73],
    h2hStats: { homeWins: 18, awayWins: 16, draws: 10 },
    status: 'upcoming',
    league: 'Premier League',
  },
  {
    id: '3',
    sport: 'football',
    date: new Date(2026, 5, 22),
    time: '15:00',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    prediction: { result: 'win', confidence: 89, color: 'green' },
    odds: 1.45, oddsHome: 1.45, oddsDraw: 4.75, oddsAway: 6.50,
    isPremium: false,
    probabilityHome: 72, probabilityDraw: 18, probabilityAway: 10,
    homeForm: [95, 92, 88, 94, 89],
    awayForm: [65, 70, 62, 68, 75],
    h2hStats: { homeWins: 22, awayWins: 8, draws: 6 },
    status: 'finished', homeScore: 3, awayScore: 0,
    league: 'Premier League',
  },
  {
    id: '4',
    sport: 'football',
    date: new Date(2026, 5, 22),
    time: '17:45',
    homeTeam: 'Newcastle United',
    awayTeam: 'Brighton',
    prediction: { result: 'win', confidence: 72, color: 'green' },
    odds: 2.1, oddsHome: 2.10, oddsDraw: 3.30, oddsAway: 3.60,
    probabilityHome: 58, probabilityDraw: 26, probabilityAway: 16,
    homeForm: [78, 81, 75, 79, 84],
    awayForm: [68, 72, 70, 74, 71],
    h2hStats: { homeWins: 10, awayWins: 9, draws: 5 },
  },
  {
    id: '5',
    sport: 'football',
    date: new Date(2026, 5, 22),
    time: '12:30',
    homeTeam: 'Aston Villa',
    awayTeam: 'West Ham',
    prediction: { result: 'loss', confidence: 68, color: 'red' },
    odds: 2.75, oddsHome: 2.75, oddsDraw: 3.10, oddsAway: 2.60,
    isPremium: true,
    probabilityHome: 38, probabilityDraw: 28, probabilityAway: 34,
    homeForm: [71, 68, 72, 69, 74],
    awayForm: [82, 85, 79, 86, 83],
    h2hStats: { homeWins: 8, awayWins: 11, draws: 7 },
  },
  {
    id: '6',
    sport: 'basketball',
    date: new Date(2026, 5, 22),
    time: '19:00',
    homeTeam: 'Lakers',
    awayTeam: 'Celtics',
    prediction: { result: 'loss', confidence: 71, color: 'red' },
    odds: 2.4, oddsHome: 2.40, oddsDraw: 0, oddsAway: 1.58,
    probabilityHome: 42, probabilityDraw: 0, probabilityAway: 58,
    homeForm: [64, 68, 62, 66, 59],
    awayForm: [88, 91, 86, 89, 92],
    h2hStats: { homeWins: 9, awayWins: 13, draws: 0 },
  },
  {
    id: '7',
    sport: 'football',
    date: new Date(2026, 5, 23),
    time: '20:00',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    prediction: { result: 'draw', confidence: 62, color: 'orange' },
    odds: 2.95, oddsHome: 2.40, oddsDraw: 2.95, oddsAway: 3.10,
    isPremium: false,
    probabilityHome: 42, probabilityDraw: 32, probabilityAway: 26,
    homeForm: [92, 88, 91, 89, 86],
    awayForm: [85, 82, 87, 83, 88],
    h2hStats: { homeWins: 28, awayWins: 26, draws: 15 },
  },
  {
    id: '8',
    sport: 'tennis',
    date: new Date(2026, 5, 23),
    time: '14:00',
    homeTeam: 'Novak Djokovic',
    awayTeam: 'Carlos Alcaraz',
    prediction: { result: 'loss', confidence: 75, color: 'red' },
    odds: 2.25, oddsHome: 2.25, oddsDraw: 0, oddsAway: 1.62,
    probabilityHome: 35, probabilityDraw: 0, probabilityAway: 65,
    homeForm: [72, 75, 68, 71, 69],
    awayForm: [91, 94, 88, 92, 95],
    h2hStats: { homeWins: 18, awayWins: 22, draws: 0 },
  },
  {
    id: '9',
    sport: 'cricket',
    date: new Date(2026, 5, 23),
    time: '09:00',
    homeTeam: 'India',
    awayTeam: 'Pakistan',
    prediction: { result: 'win', confidence: 81, color: 'green' },
    odds: 1.68, oddsHome: 1.68, oddsDraw: 0, oddsAway: 2.20,
    isPremium: true,
    probabilityHome: 62, probabilityDraw: 0, probabilityAway: 38,
    homeForm: [85, 88, 82, 87, 89],
    awayForm: [76, 73, 79, 72, 75],
    h2hStats: { homeWins: 52, awayWins: 28, draws: 2 },
  },
  {
    id: '10',
    sport: 'football',
    date: new Date(2026, 5, 23),
    time: '18:00',
    homeTeam: 'Paris SG',
    awayTeam: 'Lyon',
    prediction: { result: 'win', confidence: 84, color: 'green' },
    odds: 1.52, oddsHome: 1.52, oddsDraw: 4.20, oddsAway: 5.80,
    probabilityHome: 68, probabilityDraw: 22, probabilityAway: 10,
    homeForm: [89, 92, 87, 91, 88],
    awayForm: [58, 62, 55, 61, 59],
    h2hStats: { homeWins: 24, awayWins: 6, draws: 8 },
  },
  {
    id: '11',
    sport: 'basketball',
    date: new Date(2026, 5, 23),
    time: '20:30',
    homeTeam: 'Warriors',
    awayTeam: 'Mavericks',
    prediction: { result: 'draw', confidence: 58, color: 'orange' },
    odds: 3.15, oddsHome: 1.90, oddsDraw: 0, oddsAway: 1.85,
    isPremium: false,
    probabilityHome: 48, probabilityDraw: 0, probabilityAway: 52,
    homeForm: [76, 79, 74, 77, 81],
    awayForm: [80, 82, 78, 85, 83],
    h2hStats: { homeWins: 11, awayWins: 12, draws: 0 },
  },
  {
    id: '12',
    sport: 'football',
    date: new Date(2026, 5, 24),
    time: '16:00',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    prediction: { result: 'win', confidence: 76, color: 'green' },
    odds: 1.95, oddsHome: 1.95, oddsDraw: 3.60, oddsAway: 4.00,
    probabilityHome: 62, probabilityDraw: 24, probabilityAway: 14,
    homeForm: [88, 91, 85, 89, 92],
    awayForm: [72, 75, 70, 77, 73],
    h2hStats: { homeWins: 19, awayWins: 11, draws: 6 },
  },
];

export const sportsOptions = [
  { value: 'all', label: 'All Sports' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'cricket', label: 'Cricket' },
];
