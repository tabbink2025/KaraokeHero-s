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
type SongSeed = Omit<Song, 'type' | 'language'> & Partial<Pick<Song, 'type' | 'language'>>;
const S = (o: SongSeed): Song => ({ type: 'solo', language: 'EN', ...o });
const D = (o: SongSeed): Song => ({ type: 'duet', language: 'EN', ...o });

export const SONGS: Song[] = [
  // Party Classics
  S({ id: 'p1', title: 'Dancing Queen', artist: 'ABBA', themeId: 'party', difficulty: 'easy', youtubeVideoId: 'WHayJZ3eMcE' }),
  S({ id: 'p2', title: 'Y.M.C.A.', artist: 'Village People', themeId: 'party', difficulty: 'easy', youtubeVideoId: 'nRjFavXA8pE' }),
  S({ id: 'p3', title: 'September', artist: 'Earth, Wind & Fire', themeId: 'party', difficulty: 'medium', youtubeVideoId: 'cKRmRYad318' }),
  S({ id: 'p4', title: 'I Will Survive', artist: 'Gloria Gaynor', themeId: 'party', difficulty: 'medium', youtubeVideoId: 'FsUa8P-L2Ag' }),
  S({ id: 'p5', title: "Stayin' Alive", artist: 'Bee Gees', themeId: 'party', difficulty: 'hard', youtubeVideoId: 'UKy4pCSwFR0' }),
  S({ id: 'p6', title: 'Hot Stuff', artist: 'Donna Summer', themeId: 'party', difficulty: 'medium', youtubeVideoId: 'U1uTOOuXqIs' }),
  // Guilty Pleasures
  S({ id: 'g1', title: '...Baby One More Time', artist: 'Britney Spears', themeId: 'guilty', difficulty: 'easy', youtubeVideoId: 'PYpU2TxIzAM' }),
  S({ id: 'g2', title: 'Wannabe', artist: 'Spice Girls', themeId: 'guilty', difficulty: 'medium', youtubeVideoId: 'BTDPZQGqjY8' }),
  S({ id: 'g3', title: 'Barbie Girl', artist: 'Aqua', themeId: 'guilty', difficulty: 'easy', youtubeVideoId: 'AQOt75axc0Y' }),
  S({ id: 'g4', title: 'MMMBop', artist: 'Hanson', themeId: 'guilty', difficulty: 'hard', youtubeVideoId: 'qsWkrxGmWps' }),
  S({ id: 'g5', title: 'Mr. Brightside', artist: 'The Killers', themeId: 'guilty', difficulty: 'medium', youtubeVideoId: 'c1X3Lg7RVkk' }),
  // Rock Anthems
  S({ id: 'r1', title: 'Bohemian Rhapsody', artist: 'Queen', themeId: 'rock', difficulty: 'hard', youtubeVideoId: '9Lxm0iSnKNc' }),
  S({ id: 'r2', title: "Livin' on a Prayer", artist: 'Bon Jovi', themeId: 'rock', difficulty: 'medium', youtubeVideoId: 'Ep6G3P2v5ZA' }),
  S({ id: 'r3', title: "Don't Stop Believin'", artist: 'Journey', themeId: 'rock', difficulty: 'medium', youtubeVideoId: 'c8wn2fMYvns' }),
  S({ id: 'r4', title: 'Highway to Hell', artist: 'AC/DC', themeId: 'rock', difficulty: 'hard', youtubeVideoId: 'oEuBzpKF3X8' }),
  S({ id: 'r5', title: 'Take On Me', artist: 'a-ha', themeId: 'rock', difficulty: 'hard', youtubeVideoId: 'bC4ER15Hj10' }),
  // Nederlandstalig
  S({ id: 'n1', title: 'Het is een nacht', artist: 'Guus Meeuwis', themeId: 'nl', difficulty: 'easy', language: 'NL', youtubeVideoId: 'fHfjuP53JHw' }),
  S({ id: 'n2', title: 'Dromen zijn bedrog', artist: 'Marco Borsato', themeId: 'nl', difficulty: 'medium', language: 'NL', youtubeVideoId: 'Kb0UOi9Mg8Y' }),
  S({ id: 'n3', title: 'Bloed, zweet en tranen', artist: 'André Hazes', themeId: 'nl', difficulty: 'medium', language: 'NL', youtubeVideoId: 'DmBVwdwl6X8' }),
  S({ id: 'n4', title: 'Links Rechts', artist: 'Snollebollekes', themeId: 'nl', difficulty: 'easy', language: 'NL', youtubeVideoId: 'aJja5S6pcs0' }),
  S({ id: 'n5', title: 'Brabant', artist: 'Guus Meeuwis', themeId: 'nl', difficulty: 'hard', language: 'NL', youtubeVideoId: 'Q6nopuQajXc' }),
  // Duetten
  D({ id: 'd1', title: 'Summer Nights', artist: 'John Travolta & Olivia Newton-John', themeId: 'duet', difficulty: 'medium', youtubeVideoId: 'EVNFbhrJC-o' }),
  D({ id: 'd2', title: 'Islands in the Stream', artist: 'Kenny Rogers & Dolly Parton', themeId: 'duet', difficulty: 'medium', youtubeVideoId: 'TIRMBr4vMY4' }),
  D({ id: 'd3', title: "Don't Go Breaking My Heart", artist: 'Elton John & Kiki Dee', themeId: 'duet', difficulty: 'easy', youtubeVideoId: 'yO3U9OCqIRM' }),
  D({ id: 'd4', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', themeId: 'duet', difficulty: 'hard', youtubeVideoId: '_nHT_k9Rswc' }),
  D({ id: 'd5', title: 'Endless Love', artist: 'Diana Ross & Lionel Richie', themeId: 'duet', difficulty: 'hard', youtubeVideoId: 'yYgFs1_BUV0' }),
  // Disney & Movie
  S({ id: 'm1', title: 'Let It Go', artist: 'Frozen', themeId: 'movie', difficulty: 'hard', youtubeVideoId: 'ifCAfAzOBJM' }),
  D({ id: 'm2', title: 'A Whole New World', artist: 'Aladdin', themeId: 'movie', difficulty: 'medium', youtubeVideoId: '4hwpLK7CWVM' }),
  S({ id: 'm3', title: 'Circle of Life', artist: 'The Lion King', themeId: 'movie', difficulty: 'hard', youtubeVideoId: 'lA-xWVqmtmk' }),
  S({ id: 'm4', title: 'My Heart Will Go On', artist: 'Titanic', themeId: 'movie', difficulty: 'medium', youtubeVideoId: 'cdgU8YmD3Kc' }),
  S({ id: 'm5', title: 'Eye of the Tiger', artist: 'Rocky', themeId: 'movie', difficulty: 'medium', youtubeVideoId: '83ZFZPhxskc' }),
];

export const DEFAULT_EVENT = { id: 'zomerfeest', name: 'Zomerfeest 2026' };
