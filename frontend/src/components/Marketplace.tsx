import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAgents } from '../store/marketplaceSlice'; // Adjust the import path as needed
import { Agent, RootState } from '../store/types';
import { Typography, Container, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardActions, Button, SelectChangeEvent } from '@mui/material';

const Marketplace: React.FC = () => {
  const dispatch = useAppDispatch();
  const { agents, loading, error } = useAppSelector((state) => state.marketplace);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
  };

  const filteredAgents = agents.filter((agent: Agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === 'all' || agent.category === categoryFilter)
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Marketplace</Typography>
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search Agents"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="productivity">Productivity</MenuItem>
              <MenuItem value="creativity">Creativity</MenuItem>
              <MenuItem value="analysis">Analysis</MenuItem>
              {/* Add more categories as needed */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {filteredAgents.map((agent: Agent) => (
          <Grid item xs={12} sm={6} md={4} key={agent.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">{agent.name}</Typography>
                <Typography color="text.secondary">{agent.category}</Typography>
                <Typography variant="body2">{agent.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
                <Button size="small">Purchase</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Marketplace;