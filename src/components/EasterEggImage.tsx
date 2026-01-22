import type { ImgHTMLAttributes } from 'react';
import { useEasterEgg } from '../contexts/EasterEggContext';
import { getAssetPath } from '../utils/paths';

interface EasterEggImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const EasterEggImage = ({ src, alt, ...props }: EasterEggImageProps) => {
  const { isEasterEggActive, isAprilFools } = useEasterEgg();
  
  const shouldShowPants = isEasterEggActive || isAprilFools;
  const imageSrc = shouldShowPants ? getAssetPath('/images/media/pants.jpg') : src;

  return <img src={imageSrc} alt={alt} {...props} />;
};

export default EasterEggImage;
