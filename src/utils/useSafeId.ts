import * as React from 'react';

let idCounter = 0;

const hasNativeUseId = typeof (React as unknown as { useId?: () => string }).useId === 'function';

/**
 * Generates an SSR-safe unique ID across React 16.8, 17, 18, and 19.
 * Strategy is resolved at module initialization, ensuring strict compliance
 * with the React Rules of Hooks across all environments.
 */
export const useSafeId: (prefix?: string) => string = hasNativeUseId
  ? (prefix = 'mt') => {
      const id = (React as unknown as { useId: () => string }).useId();
      return `${prefix}-${id.replace(/:/g, '')}`;
    }
  : (prefix = 'mt') => {
      const [fallbackId] = React.useState(() => `${prefix}-${++idCounter}`);
      return fallbackId;
    };
