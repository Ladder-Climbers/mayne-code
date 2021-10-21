import { Container } from "@material-ui/core";
import React from "react";
import { api } from "../api/api";
import SearchBox from "../components/SearchBox";
import SearchResult, { LocalDatabaseResult } from "../components/SearchResult";
import { setSearchInfo } from "../data/action";
import store from "../data/store";
import history from "../utils/history";
import { getHashedQuery } from "../utils/utils";

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