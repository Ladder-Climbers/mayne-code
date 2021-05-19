import { Container } from "@material-ui/core";
import React from "react";
import { api } from "../api/api";
import SearchBox from "../components/SearchBox";
import SearchResult from "../components/SearchResult";
import { setSearchInfo } from "../data/action";
import store from "../data/store";
import history from "../utils/history";
import { getHashedQuery } from "../utils/utils";

export default function Search(props) {
  const [result, setResult] = React.useState(null);
  const [startedSearching, setStartedSearching] = React.useState(false);
  const [defaultValue, setDefaultValue] = React.useState(null);
  const query = getHashedQuery();
  console.log('query', query);
  const handleSearch = async (key, src, info) => {
    console.log(key, src, info);
    const resp = await api.request('search', 'GET', { key, src });
    console.log(resp);
    setResult(resp.data);
  };
  if (query.length === 2 && !startedSearching) {
    handleSearch(query[0][1], query[1][1]);
    setStartedSearching(true);
    setDefaultValue({ key: query[0][1], src: query[1][1] });
  }
  return <Container>
    <SearchBox defaultValue={defaultValue} onSearch={handleSearch}></SearchBox>
    {result ? <SearchResult result={result.search}></SearchResult> : null}
  </Container>
}