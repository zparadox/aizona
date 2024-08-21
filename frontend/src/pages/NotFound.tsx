import React from 'react';
import { Typography, Container } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" gutterBottom>
        404: Page Not Found
      </Typography>
      <Typography align="center">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
    </Container>
  );
};

export default NotFound;