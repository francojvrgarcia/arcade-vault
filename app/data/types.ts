export type GameColor = "cyan" | "magenta" | "green" | "yellow";

export type Game = {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: string;
  cover: string;
  color: GameColor;
  best: number;
  plays: string;
};

export type ScoreRow = {
  rank: number;
  name: string;
  score: number;
  date: string;
};

export type User = { name: string };
