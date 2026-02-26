import {
  IsNumber,
  IsPositive,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CouponFrequency } from './coupon-frequency.enum';

export class CalculateBondDto {
  @IsNumber()
  @IsPositive({ message: 'faceValue must be greater than 0' })
  @Type(() => Number)
  faceValue!: number;

  @IsNumber()
  @Min(0, { message: 'annualCouponRate must be greater than or equal to 0' })
  @Type(() => Number)
  annualCouponRate!: number;

  @IsNumber()
  @IsPositive({ message: 'marketPrice must be greater than 0' })
  @Type(() => Number)
  marketPrice!: number;

  @IsNumber()
  @IsPositive({ message: 'yearsToMaturity must be greater than 0' })
  @Type(() => Number)
  yearsToMaturity!: number;

  @IsEnum(CouponFrequency, {
    message: 'couponFrequency must be one of: ANNUAL, SEMI_ANNUAL',
  })
  couponFrequency!: CouponFrequency;
}
