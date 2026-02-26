import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { BondResponse } from '../types/bond';
import { formatCurrency } from '../utils/currency';

export interface BondResultsProps {
  data: BondResponse | null;
  loading?: boolean;
}

const roundTwo = (value: number): number =>
  Math.round(value * 100) / 100;

const BondResults: React.FC<BondResultsProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}
        aria-live="polite"
        aria-busy="true"
        data-testid="bond-results"
      >
        <CircularProgress size={24} />
        <Typography>Calculating…</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box aria-live="polite" data-testid="bond-results" sx={{ py: 2 }}>
        <Typography color="text.secondary">
          Submit the form to see results.
        </Typography>
      </Box>
    );
  }

  const { currentYield, ytm, totalInterest, premiumOrDiscount } = data;

  return (
    <Box aria-live="polite" data-testid="bond-results" sx={{ width: '100%' }}>
      <Typography component="h2" variant="h6" gutterBottom>
        Results
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Current Yield
              </Typography>
              <Typography variant="h6">{roundTwo(currentYield)}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                YTM
              </Typography>
              <Typography variant="h6">{roundTwo(ytm)}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Interest
              </Typography>
              <Typography variant="h6">{formatCurrency(roundTwo(totalInterest))}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Price
              </Typography>
              <Typography variant="h6">{premiumOrDiscount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BondResults;
