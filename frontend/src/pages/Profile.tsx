import React from 'react';
import { Typography, Box, Avatar } from '@mui/material';
import Layout from '../components/Layout';
import { useAppSelector } from '../store/hooks';
import { User } from '../store/types'; // Updated import

const Profile: React.FC = () => {
  const user = useAppSelector(state => state.user.currentUser) as User | null;

  if (!user) {
    return (
      <Layout>
        <Typography variant="h5">Please log in to view your profile.</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={user.avatarUrl}
          alt={user.username}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          {user.username}'s Profile
        </Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        {/* Add more user information as needed */}
      </Box>
    </Layout>
  );
};

export default Profile;