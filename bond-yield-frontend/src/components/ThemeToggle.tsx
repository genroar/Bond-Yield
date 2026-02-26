import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import type { ThemeMode } from '../theme/theme';

export interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ mode, onToggle }) => {
  const isDark = mode === 'dark';
  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={onToggle}
        color="inherit"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
