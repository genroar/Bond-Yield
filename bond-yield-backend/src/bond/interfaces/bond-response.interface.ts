import type { CashFlowScheduleEntry } from './cash-flow-schedule.interface';

export interface BondResponse {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  premiumOrDiscount: 'PREMIUM' | 'DISCOUNT' | 'PAR';
  cashFlowSchedule: CashFlowScheduleEntry[];
}
