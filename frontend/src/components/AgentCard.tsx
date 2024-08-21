import React from 'react';
import { Card, CardContent, Typography, Chip, Fade } from '@mui/material';

interface AgentCardProps {
  name: string;
  description: string;
  capabilities: string[];
  category: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, description, capabilities, category }) => {
  return (
    <Fade in={true} timeout={500}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {category}
          </Typography>
          <Typography variant="body2" paragraph>
            {description}
          </Typography>
          <Typography variant="subtitle2">Capabilities:</Typography>
          {capabilities.map((capability, index) => (
            <Chip key={index} label={capability} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default AgentCard;