import type { Theme, Song } from './types';

export const THEMES: Theme[] = [
  { id: 'party',  name: 'Party Classics',   desc: 'Floor-fillers everyone knows',  icon: 'ball',    accent: 'gold' },
  { id: 'guilty', name: 'Guilty Pleasures', desc: 'You secretly love these',       icon: 'heart',   accent: 'pink' },
  { id: 'rock',   name: 'Rock Anthems',     desc: 'Hands in the air, lighters up', icon: 'bolt',    accent: 'orange' },
  { id: 'nl',     name: 'Nederlandstalig',  desc: 'Meezingers van eigen bodem',    icon: 'diamond', accent: 'teal' },
  { id: 'duet',   name: 'Duetten',          desc: 'Grab a partner and harmonise',  icon: 'duo',     accent: 'violet' },
  { id: 'movie',  name: 'Disney & Movie',   desc: 'Soundtracks & sing-alongs',     icon: 'play',    accent: 'cyan' },
];

// Real karaoke (with-lyrics) YouTube IDs, mostly Sing King's official
// "Karaoke Version" uploads (reliably embeddable) plus KaraFun / Dutch
// karaoke channels where Sing King has no version. If any video stops
// embedding, just swap its ID below and delete karaoke.db to re-seed.
type SongSeed = Omit<Song, 'type' | 'language' | 'originalVideoId'> &
  Partial<Pick<Song, 'type' | 'language' | 'originalVideoId'>>;
const S = (o: SongSeed): Song => ({ type: 'solo', language: 'EN', originalVideoId: '', ...o });
const D = (o: SongSeed): Song => ({ type: 'duet', language: 'EN', originalVideoId: '', ...o });

export const SONGS: Song[] = [
  // Party Classics
  S({ id: 'p1', title: 'Dancing Queen', artist: 'ABBA', themeId: 'party', difficulty: 'easy', youtubeVideoId: 'qjMSGIfB1j8', originalVideoId: 'xFrGuyw1V8s' }),
  S({ id: 'p2', title: 'Y.M.C.A.', artist: 'Village People', themeId: 'party', difficulty: 'easy', youtubeVideoId: 'wwQCD7Youiw', originalVideoId: 'CS9OO0S5w2k' }),
  S({ id: 'p3', title: 'September', artist: 'Earth, Wind & Fire', themeId: 'party', difficulty: 'medium', youtubeVideoId: 'GdUQv12UHNc', originalVideoId: 'Gs069dndIYk' }),
  S({ id: 'p4', title: 'I Will Survive', artist: 'Gloria Gaynor', themeId: 'party', difficulty: 'medium', youtubeVideoId: 'ehqhfZvaPNM', originalVideoId: '6dYWe1c3OyU' }),
  S({ id: 'p5', title: "Stayin' Alive", artist: 'Bee Gees', themeId: 'party', difficulty: 'hard', youtubeVideoId: 'w-bGMo4q-aA', originalVideoId: 'fNFzfwLM72c' }),
  S({ id: 'p6', title: 'Hot Stuff', artist: 'Donna Summer', themeId: 'party', difficulty: 'medium', youtubeVideoId: 'UpeQC55gX4I', originalVideoId: 'KhcaPNuaJNU' }),
  // Guilty Pleasures
  S({ id: 'g1', title: '...Baby One More Time', artist: 'Britney Spears', themeId: 'guilty', difficulty: 'easy', youtubeVideoId: 'C-u5WLJ9Yk4', originalVideoId: 'nbmVTIYkbOo' }),
  S({ id: 'g2', title: 'Wannabe', artist: 'Spice Girls', themeId: 'guilty', difficulty: 'medium', youtubeVideoId: 'qReE_thuE98', originalVideoId: 'gJLIiF15wjQ' }),
  S({ id: 'g3', title: 'Barbie Girl', artist: 'Aqua', themeId: 'guilty', difficulty: 'easy', youtubeVideoId: 'BZr5rVzLOJU', originalVideoId: 'AWFQx0gGXjs' }),
  S({ id: 'g4', title: 'MMMBop', artist: 'Hanson', themeId: 'guilty', difficulty: 'hard', youtubeVideoId: 'ghwXydQ6F1U', originalVideoId: 'NHozn0YXAeE' }),
  S({ id: 'g5', title: 'Mr. Brightside', artist: 'The Killers', themeId: 'guilty', difficulty: 'medium', youtubeVideoId: 'NvZyU7ij_bs', originalVideoId: 'gGdGFtwCNBE' }),
  // Rock Anthems
  S({ id: 'r1', title: 'Bohemian Rhapsody', artist: 'Queen', themeId: 'rock', difficulty: 'hard', youtubeVideoId: 'xyF04rAhHaQ', originalVideoId: 'fJ9rUzIMcZQ' }),
  S({ id: 'r2', title: "Livin' on a Prayer", artist: 'Bon Jovi', themeId: 'rock', difficulty: 'medium', youtubeVideoId: 'oVAyWQHzHJI', originalVideoId: 'lDK9QqIzhwk' }),
  S({ id: 'r3', title: "Don't Stop Believin'", artist: 'Journey', themeId: 'rock', difficulty: 'medium', youtubeVideoId: 'gzsSSqAN-jI', originalVideoId: '1k8craCGpgs' }),
  S({ id: 'r4', title: 'Highway to Hell', artist: 'AC/DC', themeId: 'rock', difficulty: 'hard', youtubeVideoId: 'q2UpIZ8h0Zo', originalVideoId: 'l482T0yNkeo' }),
  S({ id: 'r5', title: 'Take On Me', artist: 'a-ha', themeId: 'rock', difficulty: 'hard', youtubeVideoId: 'GK0hisiU6-c', originalVideoId: 'djV11Xbc914' }),
  // Nederlandstalig
  S({ id: 'n1', title: 'Het is een nacht', artist: 'Guus Meeuwis', themeId: 'nl', difficulty: 'easy', language: 'NL', youtubeVideoId: 'fHfjuP53JHw', originalVideoId: 'eIX2SZW4Ih8' }),
  S({ id: 'n2', title: 'Dromen zijn bedrog', artist: 'Marco Borsato', themeId: 'nl', difficulty: 'medium', language: 'NL', youtubeVideoId: 'Kb0UOi9Mg8Y', originalVideoId: 'CuA2U9iU6lQ' }),
  S({ id: 'n3', title: 'Bloed, zweet en tranen', artist: 'André Hazes', themeId: 'nl', difficulty: 'medium', language: 'NL', youtubeVideoId: 'DmBVwdwl6X8', originalVideoId: 'uel8ToMHGBM' }),
  S({ id: 'n4', title: 'Links Rechts', artist: 'Snollebollekes', themeId: 'nl', difficulty: 'easy', language: 'NL', youtubeVideoId: 'aJja5S6pcs0', originalVideoId: 'pFEDBewcfks' }),
  S({ id: 'n5', title: 'Brabant', artist: 'Guus Meeuwis', themeId: 'nl', difficulty: 'hard', language: 'NL', youtubeVideoId: 'Q6nopuQajXc', originalVideoId: 'YaIzl1Tz-so' }),
  // Duetten
  D({ id: 'd1', title: 'Summer Nights', artist: 'John Travolta & Olivia Newton-John', themeId: 'duet', difficulty: 'medium', youtubeVideoId: 'YicE5_qw2Ho', originalVideoId: 'drdM5dOkOtM' }),
  D({ id: 'd2', title: 'Islands in the Stream', artist: 'Kenny Rogers & Dolly Parton', themeId: 'duet', difficulty: 'medium', youtubeVideoId: 'TIRMBr4vMY4', originalVideoId: 'UaNGtgYwSsU' }),
  D({ id: 'd3', title: "Don't Go Breaking My Heart", artist: 'Elton John & Kiki Dee', themeId: 'duet', difficulty: 'easy', youtubeVideoId: 'yO3U9OCqIRM', originalVideoId: 'z0qW9P-uYfM' }),
  D({ id: 'd4', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', themeId: 'duet', difficulty: 'hard', youtubeVideoId: 'smu-0V7E7wI', originalVideoId: 'bo_efYhYU2A' }),
  D({ id: 'd5', title: 'Endless Love', artist: 'Diana Ross & Lionel Richie', themeId: 'duet', difficulty: 'hard', youtubeVideoId: '0ZVdkAw82Qw', originalVideoId: 'UsqDoz2Co4o' }),
  // Disney & Movie
  S({ id: 'm1', title: 'Let It Go', artist: 'Frozen', themeId: 'movie', difficulty: 'hard', youtubeVideoId: '8rpCPw6YiIk', originalVideoId: 'YVVTZgwYwVo' }),
  D({ id: 'm2', title: 'A Whole New World', artist: 'Aladdin', themeId: 'movie', difficulty: 'medium', youtubeVideoId: 'CgHNvCUSSvg', originalVideoId: 'eitDnP0_83k' }),
  S({ id: 'm3', title: 'Circle of Life', artist: 'The Lion King', themeId: 'movie', difficulty: 'hard', youtubeVideoId: 'QL41lgDOQ9Q', originalVideoId: 'GibiNy4d4gc' }),
  S({ id: 'm4', title: 'My Heart Will Go On', artist: 'Titanic', themeId: 'movie', difficulty: 'medium', youtubeVideoId: 'tQOw_R2gx2E', originalVideoId: '9bFHsd3o1w0' }),
  S({ id: 'm5', title: 'Eye of the Tiger', artist: 'Rocky', themeId: 'movie', difficulty: 'medium', youtubeVideoId: '-8PTjTDwf9M', originalVideoId: 'btPJPFnesV4' }),
];

export const DEFAULT_EVENT = { id: 'zomerfeest', name: 'Zomerfeest 2026' };
