import type { ImgHTMLAttributes } from 'react';
import { useEasterEgg } from '../contexts/EasterEggContext';
import { getAssetPath } from '../utils/paths';

interface EasterEggImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const EasterEggImage = ({ src, alt, ...props }: EasterEggImageProps) => {
  const { isEasterEggActive, isAprilFools } = useEasterEgg();
  
  const shouldShowFeet = isEasterEggActive || isAprilFools;
  const imageSrc = shouldShowFeet ? getAssetPath('/images/media/feet.jpg') : src;

  return <img src={imageSrc} alt={alt} {...props} />;
};

export default EasterEggImage;
