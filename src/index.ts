import { MicroTrend, MicroTrendComponent } from './MicroTrend';

export { MicroTrend, MicroTrendComponent };
export { MicroTrendContext, useMicroTrendContext } from './MicroTrendContext';

// Subcomponents
export { Line } from './components/Line';
export { Area } from './components/Area';
export { Bars } from './components/Bars';
export { Spot } from './components/Spot';
export { ReferenceLine } from './components/ReferenceLine';
export { Tooltip } from './components/Tooltip';

// Math & Path helpers
export {
  computePoints,
  createLinePath,
  createAreaPath,
  parseMargin,
  extractNumericValues,
} from './utils/math';

// Types
export type {
  Point,
  Margin,
  RawDataPoint,
  DataPointObject,
  MicroTrendContextValue,
  MicroTrendProps,
  LineProps,
  AreaProps,
  BarsProps,
  SpotProps,
  SpotType,
  ReferenceLineProps,
  TooltipProps,
} from './types';

export default MicroTrend;
