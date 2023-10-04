import { pixelFonts } from '../styles/pixelBorders';
import clsx from 'clsx';

export function UserModelListHeader() {
  return <h5 className={clsx('text-center mt-4 text-xl', pixelFonts.base)}>Recent works</h5>;
}
