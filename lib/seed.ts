import type { Theme, Song } from './types';

export const THEMES: Theme[] = [
  { id: 'party',  name: 'Party Classics',   desc: 'Floor-fillers everyone knows',  icon: 'ball',    accent: 'gold' },
  { id: 'guilty', name: 'Guilty Pleasures', desc: 'You secretly love these',       icon: 'heart',   accent: 'pink' },
  { id: 'rock',   name: 'Rock Anthems',     desc: 'Hands in the air, lighters up', icon: 'bolt',    accent: 'orange' },
  { id: 'nl',     name: 'Nederlandstalig',  desc: 'Meezingers van eigen bodem',    icon: 'diamond', accent: 'teal' },
  { id: 'duet',   name: 'Duetten',          desc: 'Grab a partner and harmonise',  icon: 'duo',     accent: 'violet' },
  { id: 'movie',  name: 'Disney & Movie',   desc: 'Soundtracks & sing-alongs',     icon: 'play',    accent: 'cyan' },
];

// Placeholder YouTube IDs (a few reliably-embeddable ones reused) — replace
// with real karaoke-video IDs per song before the party.
const VID = {
  dancingQueen: 'xFrGuyw1V8s',
  ymca: 'CS9OO0S5w2k',
  september: 'Gs069dndIYk',
  survive: '6dYWe1c3OyU',
  stayinAlive: 'I_izvAbhExY',
  hotStuff: 'y7BItOkkU9w',
  bohemian: 'fJ9rUzIMcZQ',
  prayer: 'lDK9QqIzhwk',
  believin: '1k8craCGpgs',
  takeOnMe: 'djV11Xbc914',
};

type SongSeed = Omit<Song, 'type' | 'language'> & Partial<Pick<Song, 'type' | 'language'>>;
const S = (o: SongSeed): Song => ({ type: 'solo', language: 'EN', ...o });
const D = (o: SongSeed): Song => ({ type: 'duet', language: 'EN', ...o });

export const SONGS: Song[] = [
  // Party Classics
  S({ id: 'p1', title: 'Dancing Queen', artist: 'ABBA', themeId: 'party', difficulty: 'easy', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'p2', title: 'Y.M.C.A.', artist: 'Village People', themeId: 'party', difficulty: 'easy', youtubeVideoId: VID.ymca }),
  S({ id: 'p3', title: 'September', artist: 'Earth, Wind & Fire', themeId: 'party', difficulty: 'medium', youtubeVideoId: VID.september }),
  S({ id: 'p4', title: 'I Will Survive', artist: 'Gloria Gaynor', themeId: 'party', difficulty: 'medium', youtubeVideoId: VID.survive }),
  S({ id: 'p5', title: "Stayin' Alive", artist: 'Bee Gees', themeId: 'party', difficulty: 'hard', youtubeVideoId: VID.stayinAlive }),
  S({ id: 'p6', title: 'Hot Stuff', artist: 'Donna Summer', themeId: 'party', difficulty: 'medium', youtubeVideoId: VID.hotStuff }),
  // Guilty Pleasures
  S({ id: 'g1', title: '...Baby One More Time', artist: 'Britney Spears', themeId: 'guilty', difficulty: 'easy', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'g2', title: 'Wannabe', artist: 'Spice Girls', themeId: 'guilty', difficulty: 'medium', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'g3', title: 'Barbie Girl', artist: 'Aqua', themeId: 'guilty', difficulty: 'easy', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'g4', title: 'MMMBop', artist: 'Hanson', themeId: 'guilty', difficulty: 'hard', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'g5', title: 'Mr. Brightside', artist: 'The Killers', themeId: 'guilty', difficulty: 'medium', youtubeVideoId: VID.dancingQueen }),
  // Rock Anthems
  S({ id: 'r1', title: 'Bohemian Rhapsody', artist: 'Queen', themeId: 'rock', difficulty: 'hard', youtubeVideoId: VID.bohemian }),
  S({ id: 'r2', title: "Livin' on a Prayer", artist: 'Bon Jovi', themeId: 'rock', difficulty: 'medium', youtubeVideoId: VID.prayer }),
  S({ id: 'r3', title: "Don't Stop Believin'", artist: 'Journey', themeId: 'rock', difficulty: 'medium', youtubeVideoId: VID.believin }),
  S({ id: 'r4', title: 'Highway to Hell', artist: 'AC/DC', themeId: 'rock', difficulty: 'hard', youtubeVideoId: VID.prayer }),
  S({ id: 'r5', title: 'Take On Me', artist: 'a-ha', themeId: 'rock', difficulty: 'hard', youtubeVideoId: VID.takeOnMe }),
  // Nederlandstalig
  S({ id: 'n1', title: 'Het is een nacht', artist: 'Guus Meeuwis', themeId: 'nl', difficulty: 'easy', language: 'NL', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'n2', title: 'Dromen zijn bedrog', artist: 'Marco Borsato', themeId: 'nl', difficulty: 'medium', language: 'NL', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'n3', title: 'Bloed, zweet en tranen', artist: 'André Hazes', themeId: 'nl', difficulty: 'medium', language: 'NL', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'n4', title: 'Links Rechts', artist: 'Snollebollekes', themeId: 'nl', difficulty: 'easy', language: 'NL', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'n5', title: 'Brabant', artist: 'Guus Meeuwis', themeId: 'nl', difficulty: 'hard', language: 'NL', youtubeVideoId: VID.dancingQueen }),
  // Duetten
  D({ id: 'd1', title: 'Summer Nights', artist: 'John Travolta & Olivia Newton-John', themeId: 'duet', difficulty: 'medium', youtubeVideoId: VID.dancingQueen }),
  D({ id: 'd2', title: 'Islands in the Stream', artist: 'Kenny Rogers & Dolly Parton', themeId: 'duet', difficulty: 'medium', youtubeVideoId: VID.dancingQueen }),
  D({ id: 'd3', title: "Don't Go Breaking My Heart", artist: 'Elton John & Kiki Dee', themeId: 'duet', difficulty: 'easy', youtubeVideoId: VID.dancingQueen }),
  D({ id: 'd4', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', themeId: 'duet', difficulty: 'hard', youtubeVideoId: VID.dancingQueen }),
  D({ id: 'd5', title: 'Endless Love', artist: 'Diana Ross & Lionel Richie', themeId: 'duet', difficulty: 'hard', youtubeVideoId: VID.dancingQueen }),
  // Disney & Movie
  S({ id: 'm1', title: 'Let It Go', artist: 'Frozen', themeId: 'movie', difficulty: 'hard', youtubeVideoId: VID.dancingQueen }),
  D({ id: 'm2', title: 'A Whole New World', artist: 'Aladdin', themeId: 'movie', difficulty: 'medium', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'm3', title: 'Circle of Life', artist: 'The Lion King', themeId: 'movie', difficulty: 'hard', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'm4', title: 'My Heart Will Go On', artist: 'Titanic', themeId: 'movie', difficulty: 'medium', youtubeVideoId: VID.dancingQueen }),
  S({ id: 'm5', title: 'Eye of the Tiger', artist: 'Rocky', themeId: 'movie', difficulty: 'medium', youtubeVideoId: VID.prayer }),
];

export const DEFAULT_EVENT = { id: 'zomerfeest', name: 'Zomerfeest 2026' };
