export function setConfig(data) {
  return dispatch => {
    dispatch({ type: "SET_CONFIG", data: data });
  };
}

export function setReserveTableData(data) {
  return dispatch => {
    dispatch({ type: "SET_RESERVE_TABLE_DATA", data: data });
  };
}

export function setRoomStockData(data) {
  return dispatch => {
    dispatch({ type: "SET_ROOM_STOCK_DATA", data: data });
  };
}

export function setShopInfo(data) {
  return dispatch => {
    dispatch({ type: "SET_SHOP_INFO", data: data });
  };
}

export function setTimetableNodes(data) {
  return dispatch => {
    dispatch({ type: "SET_TIMETABLE_NODES", data: data });
  };
}

export function setRoomStockPlans(data) {
  return dispatch => {
    dispatch({ type: "SET_ROOM_STOCK_PLANS", data: data });
  };
}

export function setTimetablePeriods(data) {
  return dispatch => {
    dispatch({ type: "SET_TIMETABLE_PERIODS", data: data });
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

