import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import BondForm from './components/BondForm';
import BondResults from './components/BondResults';
import CashFlowTable from './components/CashFlowTable';
import ThemeToggle from './components/ThemeToggle';
import type { BondResponse } from './types/bond';
import { createAppTheme, type ThemeMode } from './theme/theme';
import { getStoredThemeMode, setStoredThemeMode } from './theme/storage';
import './App.css';

function App(): React.ReactElement {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);
  const [bondResult, setBondResult] = useState<BondResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  const handleThemeToggle = (): void => {
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
    setStoredThemeMode(nextMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 1,
            }}
          >
            <Typography component="h1" variant="h4">
              Bond Yield Calculator
            </Typography>
            <ThemeToggle mode={themeMode} onToggle={handleThemeToggle} />
          </Box>

          <Box component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 3 }}>
            <BondForm setResult={setBondResult} onLoadingChange={setLoading} />

            <BondResults data={bondResult} loading={loading} />

            {bondResult?.cashFlowSchedule && (
              <CashFlowTable
                cashFlowSchedule={bondResult.cashFlowSchedule}
                loading={loading}
              />
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
