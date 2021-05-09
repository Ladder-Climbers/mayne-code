import { combineReducers } from 'redux';
import Config from '../config';

const defaultState = {
  config: new Config()
}

function config(state = defaultState.config, action) {
  switch (action.type) {
    case "SET_CONFIG":
      return action.data;
    default:
      return state;
  }
}


export default combineReducers({ config });
