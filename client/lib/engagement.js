// Theme-aware wording for reader engagement (works in server and client components).

const SAVE = {
  vidora: { save: 'Watch later', saved: 'In Watch later', page: 'Watch later', empty: 'Videos you save to watch later appear here.' },
  marquee: { save: 'My List', saved: 'In My List', page: 'My List', empty: 'Add shows and films to My List to find them here.' },
  waveform: { save: 'Listen later', saved: 'Saved', page: 'Listen later', empty: 'Episodes you save appear here.' },
  herald: { save: 'Save', saved: 'Saved', page: 'Saved stories', empty: 'Stories you save to read later appear here.' },
  lens: { save: 'Favourite', saved: 'Favourited', page: 'Favourites', empty: 'Photo stories you favourite appear here.' },
};
const DEFAULT_SAVE = { save: 'Save', saved: 'Saved', page: 'Reading list', empty: 'Posts you save to read later appear here.' };

const FOLLOW = {
  PLAYLIST: { action: 'Subscribe', done: 'Subscribed', noun: 'subscribers' },
  PODCAST: { action: 'Follow', done: 'Following', noun: 'followers' },
  SHOW: { action: 'Follow', done: 'Following', noun: 'followers' },
};

const family = (theme) => theme?.variantOf || theme?.id || '';

export const saveLabels = (theme) => SAVE[family(theme)] || DEFAULT_SAVE;
export const followLabels = (type) => FOLLOW[type] || FOLLOW.SHOW;

// Settings with every switch on (older installs have no "engagement" group yet).
export const engagementOf = (settings) => ({ comments: true, moderation: true, commentReplies: true, likes: true, share: true, saves: true, subscriptions: true, ...(settings?.engagement || {}) });
