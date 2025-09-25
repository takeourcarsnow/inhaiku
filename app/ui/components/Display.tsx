import React from 'react';

type Props = {
  headlineOut: string;
  haikuOut: string;
  skeleton: boolean;
  currentUrl?: string | null;
};

export default function Display({ headlineOut, haikuOut, skeleton, currentUrl }: Props) {
  return (
    <>
      <div className={`message headline ${skeleton ? 'skeleton' : ''}`} role="status" aria-live="polite" onClick={() => {
        if (currentUrl && currentUrl !== '#') window.open(currentUrl, '_blank');
      }}>{headlineOut}</div>
      <div className={`message haiku ${skeleton ? 'skeleton' : ''}`} role="status" aria-live="polite">{haikuOut}</div>
    </>
  );
}
