import { Container } from "@material-ui/core";
import React from "react";
import { api } from "../api/api";
import SearchBox from "../components/SearchBox";
import { setSearchInfo } from "../data/action";
import store from "../data/store";

export default function Search(props) {
  return <Container>
    <SearchBox onSearch={async (val, type, info) => {
      console.log(val, type, info);
      const resp = await api.request('search', 'GET', {
        key: val, src: type
      });
      console.log(resp);
    }}></SearchBox>
  </Container>
}