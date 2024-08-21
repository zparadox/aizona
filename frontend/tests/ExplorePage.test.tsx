import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Explore from '../../src/pages/Explore';

const mockStore = configureStore([]);

describe('Explore Page', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      agents: {
        list: [
          { id: '1', name: 'Agent 1', description: 'Description 1', capabilities: ['cap1', 'cap2'] },
          { id: '2', name: 'Agent 2', description: 'Description 2', capabilities: ['cap3', 'cap4'] },
        ],
        loading: false,
        error: null,
      },
    });
  });

  test('renders agent list', () => {
    render(
      <Provider store={store}>
        <Explore />
      </Provider>
    );

    expect(screen.getByText('Explore AI Agents')).toBeInTheDocument();
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Agent 2')).toBeInTheDocument();
  });
});