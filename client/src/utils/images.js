/** Reliable placeholder images — no Cloudinary or API keys needed */
export const DEFAULT_TURF_IMAGE =
  'https://images.pexels.com/photos/1170295/pexels-photo-1170295.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';

export const TURF_IMAGES = [
  'https://images.pexels.com/photos/1170295/pexels-photo-1170295.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/4195238/pexels-photo-4195238.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
];

export const HERO_IMAGE =
  'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';

export const getTurfImage = (url, index = 0) => {
  if (url && url.startsWith('http')) return url;
  return TURF_IMAGES[index % TURF_IMAGES.length] || DEFAULT_TURF_IMAGE;
};
