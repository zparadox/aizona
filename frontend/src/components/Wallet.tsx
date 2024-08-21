import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { AppDispatch } from '../store/store'; // Make sure this path is correct
import { fetchWalletData, depositFunds, withdrawFunds } from '../store/actions/walletActions';
import { Typography, Container, Paper, Grid, Button, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Transaction {
  type: string;
  amount: number;
  timestamp: string;
}

const Wallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const { balance, transactions, loading, error } = useAppSelector((state) => state.wallet);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    (dispatch as AppDispatch)(fetchWalletData());
  }, [dispatch]);

  const handleDeposit = () => {
    if (amount && !isNaN(Number(amount))) {
      (dispatch as AppDispatch)(depositFunds(Number(amount)));
      setOpenDeposit(false);
      setAmount('');
    }
  };

  const handleWithdraw = () => {
    if (amount && !isNaN(Number(amount)) && Number(amount) <= balance) {
      dispatch(withdrawFunds(Number(amount)));
      setOpenWithdraw(false);
      setAmount('');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Wallet
      </Typography>
      <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Balance: ${balance !== undefined ? balance.toFixed(2) : '0.00'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => setOpenDeposit(true)} style={{ marginRight: '1rem' }}>
              Deposit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setOpenWithdraw(true)}>
              Withdraw
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>
      {transactions && transactions.length > 0 ? (
        transactions.map((transaction: Transaction, index: number) => (
          <Paper key={index} elevation={2} style={{ padding: '1rem', marginBottom: '1rem' }}>
            <Typography>Type: {transaction.type}</Typography>
            <Typography>Amount: ${transaction.amount.toFixed(2)}</Typography>
            <Typography>Date: {new Date(transaction.timestamp).toLocaleString()}</Typography>
          </Paper>
        ))
      ) : (
        <Typography>No transactions yet.</Typography>
      )}
      <Dialog open={openDeposit} onClose={() => setOpenDeposit(false)}>
        <DialogTitle>Deposit Funds</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeposit(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeposit} color="primary">
            Deposit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openWithdraw} onClose={() => setOpenWithdraw(false)}>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWithdraw(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleWithdraw} color="primary">
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wallet;