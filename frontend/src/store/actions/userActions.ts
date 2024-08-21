import { Dispatch } from 'redux';
import api from '../../services/api';

export const fetchCurrentUser = () => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_CURRENT_USER_REQUEST' });
  try {
    const response = await api.get('/user/current');
    dispatch({ type: 'FETCH_CURRENT_USER_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'FETCH_CURRENT_USER_FAILURE',
      payload: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const updateUserProfile = (userData: any) => async (dispatch: Dispatch) => {
  dispatch({ type: 'UPDATE_USER_PROFILE_REQUEST' });
  try {
    const response = await api.put('/user/profile', userData);
    dispatch({ type: 'UPDATE_USER_PROFILE_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'UPDATE_USER_PROFILE_FAILURE',
      payload: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};