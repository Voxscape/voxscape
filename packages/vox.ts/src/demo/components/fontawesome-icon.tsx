import React from 'react';
import classNames from 'classnames';

interface FontawesomeIconProps {
  iconName: string;
  large?: boolean;
  style?: React.CSSProperties;
}

export const FontAwesomeIcon = React.forwardRef<HTMLElement, FontawesomeIconProps>(
  ({ large, iconName, style }, ref) => {
    const className = classNames(
      'fas inline-block m-2 relative',
      {
        'text-2xl w-6 h-6': large,
        'text-base w-4 h-4': !large,
      },
      iconName,
    );
    return <i className={className} style={{ ...style, zIndex: 50000 }} ref={ref} />;
  },
);
