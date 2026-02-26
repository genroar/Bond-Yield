import { Injectable } from '@nestjs/common';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import type { CashFlowScheduleEntry } from './interfaces/cash-flow-schedule.interface';
import type { BondResponse } from './interfaces/bond-response.interface';
import { calculateYTM } from './utils/ytm.util';

export type PremiumOrDiscount = 'PREMIUM' | 'DISCOUNT' | 'PAR';

export type CouponFrequencySchedule = 'ANNUAL' | 'SEMI_ANNUAL';

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

@Injectable()
export class BondService {
  calculateBondMetrics(dto: CalculateBondDto): BondResponse {
    const { faceValue, annualCouponRate, marketPrice, yearsToMaturity, couponFrequency } = dto;

    const annualCoupon = this.calculateAnnualCoupon(faceValue, annualCouponRate);
    const currentYieldDecimal = this.calculateCurrentYield(annualCoupon, marketPrice);
    const totalInterest = this.calculateTotalInterest(annualCoupon, yearsToMaturity);
    const premiumOrDiscount = this.calculatePremiumOrDiscount(faceValue, marketPrice);
    const ytm = calculateYTM(
      faceValue,
      annualCouponRate,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
    );
    const cashFlowSchedule = this.generateCashFlowSchedule(
      faceValue,
      annualCouponRate,
      yearsToMaturity,
      couponFrequency,
    );

    return {
      currentYield: roundToTwo(currentYieldDecimal * 100),
      ytm: roundToTwo(ytm),
      totalInterest: roundToTwo(totalInterest),
      premiumOrDiscount,
      cashFlowSchedule,
    };
  }

  calculate(dto: CalculateBondDto): BondResponse {
    return this.calculateBondMetrics(dto);
  }

  calculateAnnualCoupon(faceValue: number, annualCouponRate: number): number {
    return faceValue * (annualCouponRate / 100);
  }

  calculateCurrentYield(annualCoupon: number, marketPrice: number): number {
    return annualCoupon / marketPrice;
  }

  calculateTotalInterest(
    annualCoupon: number,
    yearsToMaturity: number,
  ): number {
    return annualCoupon * yearsToMaturity;
  }

  calculatePremiumOrDiscount(
    faceValue: number,
    marketPrice: number,
  ): PremiumOrDiscount {
    if (marketPrice > faceValue) return 'PREMIUM';
    if (marketPrice < faceValue) return 'DISCOUNT';
    return 'PAR';
  }

  generateCashFlowSchedule(
    faceValue: number,
    annualCouponRate: number,
    yearsToMaturity: number,
    couponFrequency: CouponFrequencySchedule,
  ): CashFlowScheduleEntry[] {
    const frequency = couponFrequency === 'ANNUAL' ? 1 : 2;
    const totalPeriods = yearsToMaturity * frequency;
    const couponPerPeriod =
      (faceValue * (annualCouponRate / 100)) / frequency;

    const startDate = new Date();
    const monthsPerPeriod = 12 / frequency;
    const schedule: CashFlowScheduleEntry[] = [];
    let cumulativeInterest = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      const paymentDate = new Date(startDate.getTime());
      paymentDate.setMonth(paymentDate.getMonth() + monthsPerPeriod * period);

      cumulativeInterest += couponPerPeriod;
      const isFinalPeriod = period === totalPeriods;
      const remainingPrincipal = isFinalPeriod ? 0 : faceValue;

      schedule.push({
        period,
        paymentDate: paymentDate.toISOString(),
        couponPayment: couponPerPeriod,
        cumulativeInterest,
        remainingPrincipal,
      });
    }

    return schedule;
  }
}
