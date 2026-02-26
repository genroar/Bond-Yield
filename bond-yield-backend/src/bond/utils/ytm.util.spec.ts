import {
  calculateYTM,
  type CouponFrequencyType,
} from './ytm.util';

const PRICE_TOLERANCE = 0.0001;

/**
 * Bond price at given periodic rate (for verification only).
 * PV = Σ(t=1 to n) [coupon/(1+r)^t] + faceValue/(1+r)^n
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
 * Verify that the returned YTM reproduces marketPrice within tolerance.
 */
function expectYTMReproducesPrice(
  faceValue: number,
  annualCouponRate: number,
  marketPrice: number,
  yearsToMaturity: number,
  couponFrequency: CouponFrequencyType,
): void {
  const ytmPercent = calculateYTM(
    faceValue,
    annualCouponRate,
    marketPrice,
    yearsToMaturity,
    couponFrequency,
  );
  const isSemiAnnual = couponFrequency === 'SEMI_ANNUAL';
  const periods = isSemiAnnual ? yearsToMaturity * 2 : yearsToMaturity;
  const couponPerPeriod = isSemiAnnual
    ? (faceValue * (annualCouponRate / 100)) / 2
    : faceValue * (annualCouponRate / 100);
  const ratePerPeriod =
    (ytmPercent / 100) / (isSemiAnnual ? 2 : 1);
  const impliedPrice = bondPriceAtRate(
    faceValue,
    couponPerPeriod,
    periods,
    ratePerPeriod,
  );
  expect(Math.abs(impliedPrice - marketPrice)).toBeLessThanOrEqual(
    PRICE_TOLERANCE,
  );
}

describe('calculateYTM', () => {
  describe('annual frequency', () => {
    it('should return YTM for bond trading at discount (marketPrice < faceValue)', () => {
      const faceValue = 1000;
      const annualCouponRate = 5;
      const marketPrice = 950;
      const yearsToMaturity = 5;
      const ytm = calculateYTM(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'ANNUAL',
      );
      expect(ytm).toBeGreaterThan(annualCouponRate);
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'ANNUAL',
      );
    });

    it('should return YTM for bond trading at premium (marketPrice > faceValue)', () => {
      const faceValue = 1000;
      const annualCouponRate = 5;
      const marketPrice = 1050;
      const yearsToMaturity = 5;
      const ytm = calculateYTM(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'ANNUAL',
      );
      expect(ytm).toBeLessThan(annualCouponRate);
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'ANNUAL',
      );
    });

    it('should return YTM close to coupon rate when marketPrice = faceValue (par)', () => {
      const faceValue = 1000;
      const annualCouponRate = 5;
      const marketPrice = 1000;
      const yearsToMaturity = 5;
      const ytm = calculateYTM(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'ANNUAL',
      );
      expect(Math.abs(ytm - annualCouponRate)).toBeLessThan(0.01);
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'ANNUAL',
      );
    });
  });

  describe('semi-annual frequency', () => {
    it('should return annual YTM for semi-annual bond at discount', () => {
      const faceValue = 1000;
      const annualCouponRate = 6;
      const marketPrice = 980;
      const yearsToMaturity = 5;
      const ytm = calculateYTM(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'SEMI_ANNUAL',
      );
      expect(ytm).toBeGreaterThan(annualCouponRate);
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'SEMI_ANNUAL',
      );
    });

    it('should return annual YTM for semi-annual bond at premium', () => {
      const faceValue = 1000;
      const annualCouponRate = 6;
      const marketPrice = 1020;
      const yearsToMaturity = 5;
      const ytm = calculateYTM(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'SEMI_ANNUAL',
      );
      expect(ytm).toBeLessThan(annualCouponRate);
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'SEMI_ANNUAL',
      );
    });

    it('should return YTM close to coupon rate for semi-annual bond at par', () => {
      const faceValue = 1000;
      const annualCouponRate = 5;
      const marketPrice = 1000;
      const yearsToMaturity = 10;
      const ytm = calculateYTM(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'SEMI_ANNUAL',
      );
      expect(Math.abs(ytm - annualCouponRate)).toBeLessThan(0.01);
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'SEMI_ANNUAL',
      );
    });
  });

  describe('numerical precision', () => {
    it('should satisfy price tolerance 0.0001 for annual bond', () => {
      const faceValue = 1000;
      const annualCouponRate = 5;
      const marketPrice = 950;
      const yearsToMaturity = 5;
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'ANNUAL',
      );
    });

    it('should satisfy price tolerance 0.0001 for semi-annual bond', () => {
      const faceValue = 5000;
      const annualCouponRate = 4;
      const marketPrice = 4800;
      const yearsToMaturity = 10;
      expectYTMReproducesPrice(
        faceValue,
        annualCouponRate,
        marketPrice,
        yearsToMaturity,
        'SEMI_ANNUAL',
      );
    });
  });

  describe('convergence failure', () => {
    it('should throw when no solution in [0,1] (marketPrice zero)', () => {
      const faceValue = 1000;
      const annualCouponRate = 5;
      const marketPrice = 0;
      const yearsToMaturity = 5;

      expect(() =>
        calculateYTM(
          faceValue,
          annualCouponRate,
          marketPrice,
          yearsToMaturity,
          'ANNUAL',
        ),
      ).toThrow('YTM failed to converge within 1000 iterations');
    });
  });
});
