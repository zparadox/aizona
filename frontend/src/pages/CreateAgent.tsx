import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createAgent } from '../store/actions/agentActions';
import { AgentFormData } from '../store/types';
import { TextField, Button, Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Layout from '../components/Layout';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateAgent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    capabilities: [],
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name as string]: value
    }));
  };

  const handleCapabilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capabilities = e.target.value.split(',').map(cap => cap.trim());
    setFormData(prevState => ({
      ...prevState,
      capabilities
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createAgent(formData));
      setSnackbar({ open: true, message: 'Agent created successfully!', severity: 'success' });
      setFormData({ name: '', description: '', capabilities: [], category: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create agent. Please try again.', severity: 'error' });
    }
    setLoading(false);
  };
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Layout>
      <Typography variant="h2" gutterBottom>
        Create New Agent
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Agent Name"
          name="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="description"
          label="Description"
          id="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="capabilities"
          label="Capabilities (comma-separated)"
          id="capabilities"
          value={formData.capabilities.join(', ')}
          onChange={handleCapabilitiesChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={formData.category}
            label="Category"
            onChange={handleSelectChange}
          >
            <MenuItem value="productivity">Productivity</MenuItem>
            <MenuItem value="creativity">Creativity</MenuItem>
            <MenuItem value="analysis">Analysis</MenuItem>
            {/* Add more categories as needed */}
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Agent'}
        </Button>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default CreateAgent;