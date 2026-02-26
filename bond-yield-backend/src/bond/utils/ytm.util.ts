/**
 * YTM (Yield to Maturity) and related bond pricing utilities.
 */

const BISECTION_LOWER_BOUND = 0;
const BISECTION_UPPER_BOUND = 1;
const BISECTION_TOLERANCE_ABS = 0.0001;
const BISECTION_TOLERANCE_REL = 1e-8;
const BISECTION_MAX_ITERATIONS = 2000;

export type CouponFrequencyType = 'ANNUAL' | 'SEMI_ANNUAL';

/**
 * Present value of bond cash flows at a given periodic rate.
 * PV = Σ(t=1 to n) [coupon / (1+r)^t] + [faceValue / (1+r)^n]
 */
function bondPriceAtRate(
  faceValue: number,
  couponPerPeriod: number,
  periods: number,
  ratePerPeriod: number,
): number {
  if (ratePerPeriod === 0) {
    return periods * couponPerPeriod + faceValue;
  }
  let pv = 0;
  for (let t = 1; t <= periods; t++) {
    pv += couponPerPeriod / Math.pow(1 + ratePerPeriod, t);
  }
  pv += faceValue / Math.pow(1 + ratePerPeriod, periods);
  return pv;
}

/**
 * Yield to Maturity using Bisection method.
 * Solves for r where: MarketPrice = Σ [Coupon/(1+r)^t] + FaceValue/(1+r)^n
 * Returns YTM as annual percentage (e.g. 5.23 for 5.23%).
 */
export function calculateYTM(
  faceValue: number,
  annualCouponRate: number,
  marketPrice: number,
  yearsToMaturity: number,
  couponFrequency: CouponFrequencyType,
): number {
  const isSemiAnnual = couponFrequency === 'SEMI_ANNUAL';
  const periods = isSemiAnnual ? yearsToMaturity * 2 : yearsToMaturity;
  const couponPerPeriod = isSemiAnnual
    ? (faceValue * (annualCouponRate / 100)) / 2
    : faceValue * (annualCouponRate / 100);

  let low = BISECTION_LOWER_BOUND;
  let high = BISECTION_UPPER_BOUND;

  for (let i = 0; i < BISECTION_MAX_ITERATIONS; i++) {
    const mid = (low + high) / 2;
    const priceAtMid = bondPriceAtRate(
      faceValue,
      couponPerPeriod,
      periods,
      mid,
    );

    const absError = Math.abs(priceAtMid - marketPrice);
    const relError = marketPrice > 0 ? absError / marketPrice : 0;
    const converged =
      absError <= BISECTION_TOLERANCE_ABS ||
      relError <= BISECTION_TOLERANCE_REL;

    if (converged) {
      const annualRateDecimal = isSemiAnnual ? mid * 2 : mid;
      return annualRateDecimal * 100;
    }

    if (high - low <= Number.EPSILON * 2) {
      const annualRateDecimal = isSemiAnnual ? mid * 2 : mid;
      return annualRateDecimal * 100;
    }

    if (priceAtMid > marketPrice) {
      low = mid;
    } else {
      high = mid;
    }
  }

  throw new Error(
    `YTM failed to converge within ${BISECTION_MAX_ITERATIONS} iterations`,
  );
}

export function calculateDuration(): number {
  // TODO: implement duration calculation
  return 0;
}

export function calculateModifiedDuration(): number {
  // TODO: implement modified duration calculation
  return 0;
}
