import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import type { BondResponse } from '../types/bond';
import type { CalculateBondDto } from '../types/bond';
import {
  calculateBond,
  getBondApiErrorMessage,
} from '../services/bondApi';

export interface BondFormProps {
  setResult?: (data: BondResponse | null) => void;
  onLoadingChange?: (loading: boolean) => void;
}

type FormValues = CalculateBondDto;

const BondForm: React.FC<BondFormProps> = ({ setResult, onLoadingChange }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      couponFrequency: 'ANNUAL',
    },
  });

  const onSubmit = async (data: FormValues): Promise<void> => {
    if (!setResult) return;
    setIsSubmitting(true);
    setSubmitError(null);
    onLoadingChange?.(true);
    setResult(null);
    try {
      const dto: CalculateBondDto = {
        faceValue: Number(data.faceValue),
        annualCouponRate: Number(data.annualCouponRate),
        marketPrice: Number(data.marketPrice),
        yearsToMaturity: Number(data.yearsToMaturity),
        couponFrequency: data.couponFrequency,
      };
      const response: BondResponse = await calculateBond(dto);
      setResult(response);
    } catch (err: unknown) {
      setSubmitError(getBondApiErrorMessage(err));
      setResult(null);
    } finally {
      setIsSubmitting(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate data-testid="bond-form" sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
        <Controller
          name="faceValue"
          control={control}
          rules={{
            required: 'Face value is required',
            validate: (v) =>
              (typeof v === 'number' && !Number.isNaN(v) && v > 0) ||
              'Must be greater than 0',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              type="number"
              inputProps={{ step: 'any', min: 0 }}
              label="Face Value"
              error={Boolean(errors.faceValue)}
              helperText={errors.faceValue?.message}
              fullWidth
              required
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="annualCouponRate"
          control={control}
          rules={{
            required: 'Annual coupon rate is required',
            validate: (v) =>
              (typeof v === 'number' && !Number.isNaN(v) && v >= 0) ||
              'Must be greater than or equal to 0',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              type="number"
              inputProps={{ step: 'any', min: 0 }}
              label="Annual Coupon Rate (%)"
              error={Boolean(errors.annualCouponRate)}
              helperText={errors.annualCouponRate?.message}
              fullWidth
              required
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="marketPrice"
          control={control}
          rules={{
            required: 'Market price is required',
            validate: (v) =>
              (typeof v === 'number' && !Number.isNaN(v) && v > 0) ||
              'Must be greater than 0',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              type="number"
              inputProps={{ step: 'any', min: 0 }}
              label="Market Price"
              error={Boolean(errors.marketPrice)}
              helperText={errors.marketPrice?.message}
              fullWidth
              required
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="yearsToMaturity"
          control={control}
          rules={{
            required: 'Years to maturity is required',
            validate: (v) =>
              (typeof v === 'number' && !Number.isNaN(v) && v > 0) ||
              'Must be greater than 0',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              type="number"
              inputProps={{ step: 1, min: 0 }}
              label="Years to Maturity"
              error={Boolean(errors.yearsToMaturity)}
              helperText={errors.yearsToMaturity?.message}
              fullWidth
              required
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="couponFrequency"
          control={control}
          rules={{ required: 'Coupon frequency is required' }}
          render={({ field }) => (
            <FormControl fullWidth required error={Boolean(errors.couponFrequency)}>
              <InputLabel id="coupon-frequency-label">Coupon Frequency</InputLabel>
              <Select
                {...field}
                labelId="coupon-frequency-label"
                label="Coupon Frequency"
              >
                <MenuItem value="ANNUAL">Annual</MenuItem>
                <MenuItem value="SEMI_ANNUAL">Semi-Annual</MenuItem>
              </Select>
              {errors.couponFrequency && (
                <FormHelperText>{errors.couponFrequency.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        {submitError && (
          <Alert severity="error" role="alert" aria-live="polite" onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Calculating…' : 'Calculate'}
        </Button>
      </Box>
    </Box>
  );
};

export default BondForm;
