import { createContext, useContext } from 'react';
import { MicroTrendContextValue } from './types';

export const MicroTrendContext = createContext<MicroTrendContextValue | null>(null);

export function useMicroTrendContext(): MicroTrendContextValue {
  const context = useContext(MicroTrendContext);
  if (!context) {
    throw new Error('MicroTrend subcomponents must be used within a <MicroTrend> parent component.');
  }
  return context;
}
