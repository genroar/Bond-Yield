import { Test, TestingModule } from '@nestjs/testing';
import { BondService } from './bond.service';

describe('BondService', () => {
  let service: BondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondService],
    }).compile();

    service = module.get<BondService>(BondService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateAnnualCoupon', () => {
    it('should return annual coupon for faceValue 1000 and rate 5%', () => {
      const faceValue = 1000;
      const annualCouponRate = 5;
      const result = service.calculateAnnualCoupon(faceValue, annualCouponRate);
      expect(result).toBe(50);
    });

    it('should return annual coupon for faceValue 5000 and rate 4%', () => {
      const faceValue = 5000;
      const annualCouponRate = 4;
      const result = service.calculateAnnualCoupon(faceValue, annualCouponRate);
      expect(result).toBe(200);
    });

    it('should return 0 when annualCouponRate is 0', () => {
      const faceValue = 1000;
      const annualCouponRate = 0;
      const result = service.calculateAnnualCoupon(faceValue, annualCouponRate);
      expect(result).toBe(0);
    });
  });

  describe('calculateCurrentYield', () => {
    it('should return decimal current yield for annualCoupon 50 and marketPrice 950', () => {
      const annualCoupon = 50;
      const marketPrice = 950;
      const result = service.calculateCurrentYield(annualCoupon, marketPrice);
      expect(result).toBeCloseTo(50 / 950);
    });

    it('should return decimal current yield when bond trades at premium', () => {
      const annualCoupon = 50;
      const marketPrice = 1050;
      const result = service.calculateCurrentYield(annualCoupon, marketPrice);
      expect(result).toBeCloseTo(50 / 1050);
    });

    it('should return 0.05 when coupon is 50 and price is 1000', () => {
      const annualCoupon = 50;
      const marketPrice = 1000;
      const result = service.calculateCurrentYield(annualCoupon, marketPrice);
      expect(result).toBe(0.05);
    });
  });

  describe('calculateTotalInterest', () => {
    it('should return total interest for 5 years and annual coupon 50', () => {
      const annualCoupon = 50;
      const yearsToMaturity = 5;
      const result = service.calculateTotalInterest(annualCoupon, yearsToMaturity);
      expect(result).toBe(250);
    });

    it('should return total interest for 10 years and annual coupon 80', () => {
      const annualCoupon = 80;
      const yearsToMaturity = 10;
      const result = service.calculateTotalInterest(annualCoupon, yearsToMaturity);
      expect(result).toBe(800);
    });

    it('should return 0 when annualCoupon is 0', () => {
      const annualCoupon = 0;
      const yearsToMaturity = 5;
      const result = service.calculateTotalInterest(annualCoupon, yearsToMaturity);
      expect(result).toBe(0);
    });
  });

  describe('calculatePremiumOrDiscount', () => {
    it('should return DISCOUNT when marketPrice < faceValue', () => {
      const faceValue = 1000;
      const marketPrice = 950;
      const result = service.calculatePremiumOrDiscount(faceValue, marketPrice);
      expect(result).toBe('DISCOUNT');
    });

    it('should return PREMIUM when marketPrice > faceValue', () => {
      const faceValue = 1000;
      const marketPrice = 1050;
      const result = service.calculatePremiumOrDiscount(faceValue, marketPrice);
      expect(result).toBe('PREMIUM');
    });

    it('should return PAR when marketPrice equals faceValue', () => {
      const faceValue = 1000;
      const marketPrice = 1000;
      const result = service.calculatePremiumOrDiscount(faceValue, marketPrice);
      expect(result).toBe('PAR');
    });

    it('should return DISCOUNT for realistic bond trading below par', () => {
      const faceValue = 1000;
      const marketPrice = 980;
      const result = service.calculatePremiumOrDiscount(faceValue, marketPrice);
      expect(result).toBe('DISCOUNT');
    });
  });
});
