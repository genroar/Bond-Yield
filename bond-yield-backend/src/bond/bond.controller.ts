import { Body, Controller, Post } from '@nestjs/common';
import { BondService } from './bond.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import type { BondResponse } from './interfaces/bond-response.interface';

@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  async calculate(@Body() dto: CalculateBondDto): Promise<BondResponse> {
    return this.bondService.calculateBondMetrics(dto);
  }
}