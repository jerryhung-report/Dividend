
export enum ViewType {
  PRD = 'PRD',
  DASHBOARD = 'DASHBOARD'
}

export interface Fund {
  id: string;
  name: string;
  weight: number;
  nav: number;
  change: number;
}

export interface InvestmentState {
  id: string;
  name: string;
  initialPrincipal: number;
  currentPrincipal: number;
  redemptionRate: number;
  redemptionDay: number;
  isSafetyOn: boolean;
  isManualPause?: boolean; // New: Manual override for pausing redemptions
  totalWithdrawn: number;
  funds: Fund[];
}

export interface SimulationData {
  month: number;
  principal: number;
  withdrawn: number;
  monthlyWithdrawn: number;
  isPaused: boolean;
  performancePercent: number;
}