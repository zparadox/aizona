import React, { useState } from 'react';
import { AgentFormData } from '../store/types';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';

interface AgentBuilderProps {
  onSubmit: (agentData: AgentFormData) => void;
}

const AgentBuilder: React.FC<AgentBuilderProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capabilities, setCapabilities] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      capabilities: capabilities.split(',').map(cap => cap.trim()),
      category
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1 } }}>
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Capabilities (comma-separated)"
        value={capabilities}
        onChange={(e) => setCapabilities(e.target.value)}
        required
      />
      <FormControl fullWidth required>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          label="Category"
          onChange={(e: SelectChangeEvent) => setCategory(e.target.value)}
        >
          <MenuItem value="productivity">Productivity</MenuItem>
          <MenuItem value="creativity">Creativity</MenuItem>
          <MenuItem value="analysis">Analysis</MenuItem>
          <MenuItem value="communication">Communication</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Create Agent
      </Button>
    </Box>
  );
};

export default AgentBuilder;