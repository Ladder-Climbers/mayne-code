export function setConfig(data) {
  return dispatch => {
    dispatch({ type: "SET_CONFIG", data: data });
  };
}

export function setTasks(data) {
  return dispatch => {
    dispatch({ type: "SET_TASKS", data: data });
  };
}

export function setUser(data) {
  return dispatch => {
    dispatch({ type: "SET_USER", data: data });
  };
}

export function setUsers(data) {
  return dispatch => {
    dispatch({ type: "SET_USERS", data: data });
  };
}

export function setDaemon(data) {
  return dispatch => {
    dispatch({ type: "SET_DAEMON", data: data });
  };
}

export function setErrorInfo(data) {
  return dispatch => {
    dispatch({ type: "SET_ERROR_INFO", data: data });
  };
}

export function setMessage(data) {
  return dispatch => {
    dispatch({ type: "SET_MESSAGE", data: data });
  };
}

export function setSearchInfo(data) {
  return dispatch => {
    dispatch({ type: "SET_SEARCH_INFO", data: data });
  };
}

