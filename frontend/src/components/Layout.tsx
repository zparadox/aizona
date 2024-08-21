import React, { ReactNode } from 'react';
import { Container, Box, useTheme } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { mode } = useThemeContext();

  return (
    <Container maxWidth="lg">
      <Box 
        py={4} 
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: 'calc(100vh - 64px)', // Adjust based on your header height
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default Layout;