import axios, { AxiosError } from 'axios';
import type { CalculateBondDto } from '../types/bond';
import type { BondResponse } from '../types/bond';

const BOND_API_BASE_URL =
  process.env.REACT_APP_API_URL ?? 'http://localhost:3001';
const CALCULATE_ENDPOINT = `${BOND_API_BASE_URL}/bond/calculate`;

/**
 * Calculate bond metrics (YTM, current yield, cash flow schedule, etc.).
 * @param dto - Bond calculation inputs
 * @returns Promise resolving to the response data only
 */
export async function calculateBond(
  dto: CalculateBondDto
): Promise<BondResponse> {
  const { data } = await axios.post<BondResponse>(CALCULATE_ENDPOINT, dto);
  return data;
}

/** Backend error payload (NestJS validation or custom) */
interface ApiErrorPayload {
  message?: string | string[];
  statusCode?: number;
}

/**
 * Extract a user-facing error message from an API error.
 * Handles backend validation errors (message as string or string[]).
 */
export function getBondApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const msg = axiosError.response?.data?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.join('. ');
    if (axiosError.response?.status) {
      return `Request failed (${axiosError.response.status})`;
    }
    return axiosError.message || 'Network error';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
