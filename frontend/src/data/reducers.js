import { combineReducers } from 'redux'
import Config from "../Config"

const defaultState = {
  config: new Config(),
  tasks: [],
  user: null,
  daemon: null,
  errorInfo: null,
  message: null,
}

function config(state = defaultState.config, action) {
  switch (action.type) {
    case "SET_CONFIG":
      return action.data;
    default:
      return state;
  }
}

function user(state = defaultState.user, action) {
  switch (action.type) {
    case "SET_USER":
      return action.data;
    default:
      return state;
  }
}

function tasks(state = defaultState.tasks, action) {
  switch (action.type) {
    case "SET_TASKS":
      return action.data;
    default:
      return state;
  }
}

function daemon(state = defaultState.daemon, action) {
  switch (action.type) {
    case "SET_DAEMON":
      return action.data;
    default:
      return state;
  }
}

function errorInfo(state = defaultState.errorInfo, action) {
  switch (action.type) {
    case "SET_ERROR_INFO":
      // console.log('SET_ERROR_INFO', action.data);
      return action.data;
    default:
      return state;
  }
}

function message(state = defaultState.message, action) {
  switch (action.type) {
    case "SET_MESSAGE":
      return action.data;
    default:
      return state;
  }
}

export default combineReducers({ config, errorInfo, message, daemon, user, tasks });
