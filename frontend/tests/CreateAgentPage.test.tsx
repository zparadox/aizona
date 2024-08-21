import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CreateAgent from '../../src/pages/CreateAgent';

const mockStore = configureStore([]);

describe('CreateAgent Page', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      agents: {
        loading: false,
        error: null,
      },
    });
  });

  test('renders form elements', () => {
    render(
      <Provider store={store}>
        <CreateAgent />
      </Provider>
    );

    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByLabelText('Capabilities (comma-separated):')).toBeInTheDocument();
    expect(screen.getByText('Create Agent')).toBeInTheDocument();
  });

  test('submits form with correct data', () => {
    render(
      <Provider store={store}>
        <CreateAgent />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test Agent' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Capabilities (comma-separated):'), { target: { value: 'cap1, cap2' } });

    fireEvent.click(screen.getByText('Create Agent'));

    const actions = store.getActions();
    expect(actions[0].type).toBe('CREATE_AGENT_REQUEST');
  });
});