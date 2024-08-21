import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Profile from '../../src/pages/Profile';

const mockStore = configureStore([]);

describe('Profile Page', () => {
  test('renders user information when logged in', () => {
    const store = mockStore({
      user: {
        currentUser: {
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Username: testuser')).toBeInTheDocument();
    expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
  });

  test('renders login message when not logged in', () => {
    const store = mockStore({
      user: {
        currentUser: null,
      },
    });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('Please log in to view your profile.')).toBeInTheDocument();
  });
});