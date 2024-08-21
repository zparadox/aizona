import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <Box component="footer" sx={{ mt: 'auto', py: 2, textAlign: 'center', bgcolor: theme.palette.background.paper }}>
      <Typography variant="body2" color="text.secondary">
        © 2023 AI Zona. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;