import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, Grid, Button, CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchProposals, voteOnProposal } from '../store/actions/governanceActions';
import { Proposal } from '../store/types';

const Governance: React.FC = () => {
  const dispatch = useAppDispatch();
  const { proposals, loading, error } = useAppSelector((state) => state.governance);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    if (selectedProposal) {
      dispatch(voteOnProposal(proposalId, vote));
      setSelectedProposal(prev => {
        if (!prev) return null;
        return {
          ...prev,
          votes_for: vote === 'for' ? prev.votes_for + 1 : prev.votes_for,
          votes_against: vote === 'against' ? prev.votes_against + 1 : prev.votes_against
        };
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error" variant="h6">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Governance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '1rem' }}>
            <Typography variant="h5" gutterBottom>
              Active Proposals
            </Typography>
            {proposals && proposals.length > 0 ? (
              proposals.map((proposal: Proposal) => (
                <Button
                  key={proposal.id}
                  fullWidth
                  variant={selectedProposal?.id === proposal.id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedProposal(proposal)}
                  sx={{ marginBottom: '0.5rem' }}
                >
                  {proposal.title}
                </Button>
              ))
            ) : (
              <Typography variant="body1">No active proposals at the moment.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedProposal ? (
            <Paper elevation={3} sx={{ padding: '1rem' }}>
              <Typography variant="h4" gutterBottom>
                {selectedProposal.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedProposal.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Current Votes:
              </Typography>
              <Typography>For: {selectedProposal.votes_for}</Typography>
              <Typography>Against: {selectedProposal.votes_against}</Typography>
              <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleVote(selectedProposal.id, 'for')}
                  >
                    Vote For
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleVote(selectedProposal.id, 'against')}
                  >
                    Vote Against
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Typography variant="h5">Select a proposal to view details</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Governance;