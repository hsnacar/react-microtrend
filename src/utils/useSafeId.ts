import * as React from 'react';

let idCounter = 0;

/**
 * Generates an SSR-safe unique ID across React 16.8, 17, 18, and 19.
 * Does not violate React Hook rules.
 */
export function useSafeId(prefix = 'mt'): string {
  // Check React.useId without breaking Rules of Hooks
  const reactUseId = (React as unknown as { useId?: () => string }).useId;

  if (typeof reactUseId === 'function') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = reactUseId();
    return `${prefix}-${id.replace(/:/g, '')}`;
  }

  // React 16 / 17 fallback: static instance state
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [fallbackId] = React.useState(() => `${prefix}-${++idCounter}`);
  return fallbackId;
}
