import { Container } from "@material-ui/core";
import React from "react";
import { api } from "../api/api";
import SearchBox from "../components/SearchBox";
import SearchResult from "../components/SearchResult";
import { setSearchInfo } from "../data/action";
import store from "../data/store";

export default function Search(props) {
  const [result, setResult] = React.useState(null);
  return <Container>
    <SearchBox onSearch={async (val, type, info) => {
      console.log(val, type, info);
      const resp = await api.request('search', 'GET', {
        key: val, src: type
      });
      console.log(resp);
      setResult(resp.data);
    }}></SearchBox>
    {result ? <SearchResult result={result.search}></SearchResult> : null}
  </Container>
}