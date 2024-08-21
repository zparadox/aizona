import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Box textAlign="center">
      <Typography variant="h2" gutterBottom>
        Welcome to AI Zona
      </Typography>
      <Typography variant="h5" paragraph>
        Your gateway to AI-powered experiences
      </Typography>
      <Box mt={4}>
        <Button
          component={RouterLink}
          to="/create-agent"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mr: 2 }}
        >
          Create an Agent
        </Button>
        <Button
          component={RouterLink}
          to="/explore"
          variant="outlined"
          color="primary"
          size="large"
        >
          Explore Agents
        </Button>
      </Box>
    </Box>
  );
};

export default Home;