export type SongType = 'solo' | 'duet';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QueueMode = 'theme-choice' | 'solo-star' | 'dynamic-duet';
export type QueueStatus = 'queued' | 'playing' | 'done' | 'skipped';
export type SongVersion = 'karaoke' | 'original';

export interface Theme {
  id: string;
  name: string;
  desc: string;
  icon: string;
  accent: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  themeId: string;
  type: SongType;
  youtubeVideoId: string;
  originalVideoId: string;
  difficulty: Difficulty;
  language: string;
}

export interface Participant {
  id: string;
  name: string;
  eventId: string;
  createdAt: number;
}

export interface QueueItem {
  id: string;
  eventId: string;
  songId: string;
  participantIds: string[];
  mode: QueueMode;
  status: QueueStatus;
  version: SongVersion;
  createdAt: number;
}

export interface DuetPoolEntry {
  id: string;
  eventId: string;
  participantId: string;
  joinedAt: number;
}

export interface EventState {
  event: { id: string; name: string };
  themes: Theme[];
  songs: Song[];
  participants: Participant[];
  queue: QueueItem[];
  duetPool: DuetPoolEntry[];
  recentlyPlayed: string[];
  playback: { nightStarted: boolean; isPlaying: boolean };
  moderation: boolean;
}
