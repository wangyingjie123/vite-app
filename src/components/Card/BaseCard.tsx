import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<unknown>;

function BaseCard(props: Props) {
  const { children, className } = props;

  return (
    <div
      {...props}
      id="card"
      className={`
        h-full
        box-border
        overflow-auto
        relative
        box-border
        px-5
        py-3
        rounded-3
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default BaseCard;
