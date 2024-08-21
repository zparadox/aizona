import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import AgentCard from '../components/AgentCard';
import { fetchAgents } from '../store/actions/agentActions';
import { Agent, RootState } from '../store/types';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid, 
  Container, 
  Typography, 
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import Layout from '../components/Layout';

const Explore: React.FC = () => {
  const dispatch = useAppDispatch();
  const { agents, loading, error } = useAppSelector((state) => ({
    agents: state.marketplace.agents,
    loading: state.marketplace.loading,
    error: state.marketplace.error
  }));
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography color="error" variant="h6">Error: {error}</Typography>
      </Layout>
    );
  }
  return (
    <Layout>
      <Typography variant="h2" gutterBottom>
        Explore AI Agents
      </Typography>
      <Grid container spacing={3} style={{ marginBottom: '2rem' }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Agents"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="productivity">Productivity</MenuItem>
              <MenuItem value="creativity">Creativity</MenuItem>
              <MenuItem value="analysis">Analysis</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {filteredAgents.map((agent: Agent) => (
          <Grid item key={agent.id} xs={12} sm={6} md={4}>
            <AgentCard
              name={agent.name}
              description={agent.description}
              capabilities={agent.capabilities}
              category={agent.category}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Explore;