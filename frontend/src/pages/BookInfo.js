import { Container } from "@material-ui/core";
import React from "react";
import { getHashedQuery } from "../utils/utils";

export default function BookInfo(props) {
  const [state, setInnerState] = React.useState({
    title: null
  });
  const query = getHashedQuery();
  console.log(query);
  if (state.title !== query[0][1]) {
    setInnerState({ title: query[0][1] });
    return <Container>Loading...</Container>;
  }
  return <Container>
    {state.title}
  </Container>;
}