import React from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { CashFlow } from '../types/bond';
import { formatCurrency } from '../utils/currency';
import { exportCashFlowToCsv, exportCashFlowToPdf } from '../utils/cashFlowExport';

export interface CashFlowTableProps {
  cashFlowSchedule: CashFlow[];
  loading?: boolean;
}

const roundTwo = (value: number): number =>
  Math.round(value * 100) / 100;

const formatDate = (isoDate: string): string =>
  dayjs(isoDate).format('DD/MM/YYYY');

const CashFlowTable: React.FC<CashFlowTableProps> = ({
  cashFlowSchedule,
  loading = false,
}) => {
  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}
        aria-live="polite"
        aria-busy="true"
        data-testid="cash-flow-table"
      >
        <CircularProgress size={24} />
        <Typography>Loading schedule…</Typography>
      </Box>
    );
  }

  if (!cashFlowSchedule || cashFlowSchedule.length === 0) {
    return (
      <Box aria-live="polite" data-testid="cash-flow-table" sx={{ py: 2 }}>
        <Typography color="text.secondary">
          No cash flow schedule available.
        </Typography>
      </Box>
    );
  }

  const handleExportCsv = (): void => {
    exportCashFlowToCsv(cashFlowSchedule);
  };

  const handleExportPdf = (): void => {
    exportCashFlowToPdf(cashFlowSchedule);
  };

  return (
    <Box aria-live="polite" data-testid="cash-flow-table" sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography component="h2" variant="h6">
          Cash Flow Schedule
        </Typography>
        <ButtonGroup variant="outlined" size="medium" aria-label="Export cash flow schedule">
          <Button onClick={handleExportCsv}>Export to CSV</Button>
          <Button onClick={handleExportPdf}>Export to PDF</Button>
        </ButtonGroup>
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table size="small" stickyHeader aria-label="Cash flow schedule">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell align="right">Coupon Payment</TableCell>
              <TableCell align="right">Cumulative Interest</TableCell>
              <TableCell align="right">Remaining Principal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cashFlowSchedule.map((row: CashFlow) => (
              <TableRow key={row.period} hover>
                <TableCell>{row.period}</TableCell>
                <TableCell>{formatDate(row.paymentDate)}</TableCell>
                <TableCell align="right">{formatCurrency(roundTwo(row.couponPayment))}</TableCell>
                <TableCell align="right">{formatCurrency(roundTwo(row.cumulativeInterest))}</TableCell>
                <TableCell align="right">{formatCurrency(roundTwo(row.remainingPrincipal))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CashFlowTable;
