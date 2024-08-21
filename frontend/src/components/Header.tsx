import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';
import PersonIcon from '@mui/icons-material/Person';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useThemeContext } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { mode, toggleTheme, theme } = useThemeContext();

  return (
    <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Zona
        </Typography>
        <IconButton color="inherit" component={RouterLink} to="/">
          <HomeIcon />
        </IconButton>
        <Button color="inherit" component={RouterLink} to="/create-agent" startIcon={<AddIcon />}>
          Create Agent
        </Button>
        <Button color="inherit" component={RouterLink} to="/explore" startIcon={<ExploreIcon />}>
          Explore
        </Button>
        <Button color="inherit" component={RouterLink} to="/profile" startIcon={<PersonIcon />}>
          Profile
        </Button>
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;