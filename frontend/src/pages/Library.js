import { Container } from "@material-ui/core";
import React from "react";
import { api } from "../api/api";
import { LocalDatabaseResult } from "../components/SearchResult";
import store from "../data/store";
import history from "../utils/history";

export default function Library(props) {
  const [result, setResult] = React.useState(null);
  const [requesting, setRequesting] = React.useState(false);

  if (!requesting) {
    setRequesting(true);
    (async () => {
      const resp = await api.request('search', 'GET', { key: "", src: "local_database" });
      console.log(resp);
      setRequesting(true);
      setResult(resp.data);
    })();
  }
  return <Container>
    {result ? <LocalDatabaseResult books={result.search.local_database.books}></LocalDatabaseResult> : null}
  </Container>
}