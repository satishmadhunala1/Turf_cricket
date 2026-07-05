import { getTurfImage, DEFAULT_TURF_IMAGE } from '../../utils/images';

export default function TurfImage({ src, alt = '', index = 0, className = '' }) {
  return (
    <img
      src={getTurfImage(src, index)}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        if (e.target.src !== DEFAULT_TURF_IMAGE) e.target.src = DEFAULT_TURF_IMAGE;
      }}
    />
  );
}
