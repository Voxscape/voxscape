import type React from 'react';
import { FaIcon } from '@jokester/ts-commonutil/lib/react/component/font-awesome';

export const TwitterOAuth1Button: React.FC = () => {
  return (
    <button type="button">
      Login With Twitter <FaIcon icon="twitter" />
    </button>
  );
};
