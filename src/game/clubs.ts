/**
 * The 10 fictional arena clubs. Crests map onto the 5 contract sprites;
 * repeated sprites are told apart by the tint ring, the name and the stats.
 */

export type ResultLetter = 'W' | 'D' | 'L';

export type Club = {
  id: number;
  name: string;
  short: string;
  crest: number; // 1..5 -> sprite_1..sprite_5
  tint: string;
  att: number;
  def: number;
  form: number;
  momentum: number; // -5..+5
  last5: ResultLetter[];
};

export const CLUBS: Club[] = [
  {
    id: 1, name: 'NORDVIK UNITED', short: 'NORDVIK', crest: 1, tint: '#17E08C',
    att: 78, def: 71, form: 74, momentum: 2, last5: ['W', 'W', 'D', 'W', 'L'],
  },
  {
    id: 2, name: 'CASTELLAR FC', short: 'CASTELLAR', crest: 2, tint: '#FFB020',
    att: 82, def: 58, form: 69, momentum: 1, last5: ['W', 'L', 'W', 'D', 'W'],
  },
  {
    id: 3, name: 'IRONPORT ROVERS', short: 'IRONPORT', crest: 3, tint: '#6C5CE7',
    att: 64, def: 84, form: 72, momentum: 0, last5: ['D', 'W', 'D', 'W', 'D'],
  },
  {
    id: 4, name: 'AURELIA CITY', short: 'AURELIA', crest: 4, tint: '#4FC3F7',
    att: 75, def: 66, form: 63, momentum: -1, last5: ['L', 'W', 'D', 'L', 'W'],
  },
  {
    id: 5, name: 'VELTRA ATHLETIC', short: 'VELTRA', crest: 5, tint: '#FF5A6E',
    att: 70, def: 62, form: 58, momentum: -2, last5: ['L', 'D', 'L', 'W', 'L'],
  },
  {
    id: 6, name: 'SOLMARE SC', short: 'SOLMARE', crest: 1, tint: '#A29BFE',
    att: 59, def: 73, form: 61, momentum: 1, last5: ['D', 'D', 'W', 'L', 'W'],
  },
  {
    id: 7, name: 'DRAVEN ALBION', short: 'DRAVEN', crest: 2, tint: '#39D98A',
    att: 86, def: 52, form: 77, momentum: 3, last5: ['W', 'W', 'W', 'L', 'W'],
  },
  {
    id: 8, name: 'KESTREL PARK', short: 'KESTREL', crest: 3, tint: '#F2994A',
    att: 61, def: 68, form: 55, momentum: -1, last5: ['L', 'L', 'D', 'W', 'D'],
  },
  {
    id: 9, name: 'MONTERRA LIONS', short: 'MONTERRA', crest: 4, tint: '#56CCF2',
    att: 73, def: 77, form: 80, momentum: 4, last5: ['W', 'W', 'D', 'W', 'W'],
  },
  {
    id: 10, name: 'OSTER VALLEY', short: 'OSTER', crest: 5, tint: '#E05C8C',
    att: 55, def: 60, form: 49, momentum: -3, last5: ['L', 'L', 'W', 'L', 'D'],
  },
];

export function clubById(id: number): Club {
  const found = CLUBS.find(c => c.id === id);
  return found ? found : CLUBS[0];
}

export const CLUB_COUNT = CLUBS.length;
