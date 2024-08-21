import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentCard from '../../src/components/AgentCard';

describe('AgentCard Component', () => {
  const mockAgent = {
    name: 'Test Agent',
    description: 'This is a test agent',
    capabilities: ['capability1', 'capability2'],
  };

  test('renders agent information correctly', () => {
    render(<AgentCard {...mockAgent} />);

    expect(screen.getByText('Test Agent')).toBeInTheDocument();
    expect(screen.getByText('This is a test agent')).toBeInTheDocument();
    expect(screen.getByText('capability1')).toBeInTheDocument();
    expect(screen.getByText('capability2')).toBeInTheDocument();
  });
});