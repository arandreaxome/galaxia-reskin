// Sous-ensemble de la réponse de GET /api/state utilisé par l'extension.
// Le jeu évolue vite : ce qui n'est pas indispensable reste optionnel.

export type Resource = 'metal' | 'crystal' | 'deuterium';
export type Resources = Partial<Record<Resource, number>>;
export type Coords = { g: number; s: number; p: number; moon?: boolean };

/** Élément de file de construction ou de recherche : `level` est le niveau visé. */
export type QueueItem = { key: string; level: number; start: number; end: number; demolish?: boolean };

/** Lot du chantier spatial : `unitTime` en ms, `progressStart` = début de l'unité en cours. */
export type ShipLot = { key: string; count: number; unitTime: number; progressStart?: number };

export type Planet = {
  id: string;
  name: string;
  g: number;
  s: number;
  p: number;
  moon?: boolean;
  resources: Resources;
  production: Resources;
  caps: Resources;
  lastUpdate: number;
  energy?: { produced: number; used: number; factor: number };
  buildings: Record<string, number>;
  buildQueue: QueueItem[];
  shipQueue: ShipLot[];
  /** Vaisseaux à quai (hors flottes en vol). */
  ships?: Record<string, number>;
};

export type Fleet = {
  id: string;
  mission?: string;
  state: 'out' | 'wait' | 'hold' | 'back';
  origin: Coords;
  target: Coords;
  targetName?: string;
  originId?: string;
  ships?: Record<string, number>;
  cargo?: Resources;
  departAt: number;
  arriveAt: number;
  returnAt?: number;
  holdUntil?: number | null;
  planId?: string;
  // Flottes étrangères
  hostile?: boolean;
  raid?: string | null;
  ownerName?: string;
};

export type SocialCounter = 'unreadChats' | 'friendRequests' | 'guildInvites' | 'applications' | 'plans';

export type GameState = {
  serverTime: number;
  user: {
    id: string;
    username: string;
    points: number;
    rank: number;
    research: Record<string, number>;
    researchQueue: QueueItem[];
    prefs?: { probes?: number };
  };
  planets: Planet[];
  fleets: Fleet[];
  foreign?: Fleet[];
  /** Réglages de l'univers ; galaxyViewCost : deutérium pour observer un système sans planète à toi. */
  settings?: { galaxies?: number; systems?: number; galaxyViewCost?: number; fleetSpeed?: number };
  unread: number;
  limits?: { fleetSlots: number; usedSlots: number; expeditionSlots: number; usedExpeditions: number };
  social?: Partial<Record<SocialCounter, number>>;
};

export type Message = {
  id: string;
  type: string;
  title: string;
  at: number;
  read: boolean;
  data?: {
    text?: string;
    loot?: Resources;
    perspective?: string;
    // Rapports d'espionnage et de combat
    coords?: Coords;
    planetName?: string;
    ownerName?: string;
    defenderName?: string;
    pirateLevel?: number | null;
    resources?: Resources;
    ships?: Record<string, number>;
    defense?: Record<string, number>;
    protectedUntil?: number | null;
    /** Rapports de combat : champ de débris créé à la position. */
    debris?: { metal?: number; crystal?: number } | null;
  };
};

/** Réponse de GET /api/galaxy/{g}/{s}, captée quand le jeu l'affiche (jamais appelée par l'extension). */
export type GalaxySystem = {
  g: number;
  s: number;
  /** Champ de débris de l'espace inconnu (position 16). */
  expeditionDebris?: { metal?: number; crystal?: number } | null;
  slots: {
    p: number;
    debris?: { metal?: number; crystal?: number; natural?: boolean } | null;
    known?: {
      mine?: boolean;
      occupied?: boolean;
      pirate?: boolean;
      pirateLevel?: number | null;
      planetName?: string;
      ownerName?: string;
      tag?: string;
      ai?: boolean;
      ally?: boolean;
      outdated?: boolean;
      protectedUntil?: number | null;
    } | null;
  }[];
};

/** Position déjà sondée ou vue en galaxie, clé « g:s:p ». */
export type Target = {
  g: number;
  s: number;
  p: number;
  name: string;
  owner?: string;
  pirate: boolean;
  level: number | null;
  ai?: boolean;
  tag?: string;
  protectedUntil: number | null;
  /** Date de l'information qui a fixé la protection. */
  protectionAt: number;
  /** Protection déduite de ton rapport de combat (24 h), pas lue dans le jeu. */
  estimated?: boolean;
  /** Vu en galaxie : reconstruit depuis ton dernier rapport. */
  outdated?: boolean;
  seenAt?: number;
  attackedAt?: number;
  report?: {
    id: string;
    at: number;
    resources: Resources;
    /** null : inconnu, le rapport était partiel. */
    ships: Record<string, number> | null;
    defense: Record<string, number> | null;
  };
};

/** Réglages de l'extension (onglet Réglages), lus aussi par content.ts. Sans valeur, `assets` suit `skin`. */
export type Settings = { skin?: boolean; assets?: boolean; rename?: boolean };

/** Repasse des secteurs lancée depuis l'onglet Cibles : avancement, puis bilan. */
export type Scan = { total: number; done: number; running: boolean; at: number; error?: string };

/** État de la connexion au jeu, gardé dans chrome.storage.local avec le dernier relevé. */
export type Status = 'ok' | 'no-token' | 'expired' | 'offline';
export type Snapshot = { state: GameState; offset: number; fetchedAt: number };
