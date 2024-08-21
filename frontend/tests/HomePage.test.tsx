import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../../src/pages/Home';

describe('Home Page', () => {
  test('renders welcome message and CTA buttons', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    expect(screen.getByText('Welcome to AI Zona')).toBeInTheDocument();
    expect(screen.getByText('Create an Agent')).toBeInTheDocument();
    expect(screen.getByText('Explore Agents')).toBeInTheDocument();
  });
});