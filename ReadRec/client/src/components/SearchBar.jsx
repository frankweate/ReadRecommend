import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Input, Select, Spin } from "antd";
import axios from "axios";
import "./searchbar.css";

const { Option } = Select;

export const SearchBar = (props) => {
  let history = useHistory();
  const location = useLocation();
  const [prevId, setPrevID] = useState({
    prev_id: -1,
  });

  const [search, setSearchType] = useState({
    searchType: "name",
    searchText: "",
    enterButtonHit: false,
  });

  const [loading, setLoading] = useState({
    isLoading: false,
  });

  useEffect(() => {
    clearTimeout(prevId.prev_id);
    if (
      location.pathname !== "/result" &&
      search.searchText.length === 0 &&
      search.enterButtonHit === false
    ) {
      return;
    }

    const prev_id = setTimeout(async () => {
      var and_var = false;
      var searchString = "http://localhost:8000/search/?";
      console.log(props.filter);
      if (search.searchText.length > 0 && !props.filter.category_books) {
        and_var = true;
        searchString = searchString.concat(
          search.searchType + "=" + search.searchText
        );
      }
      if (props.filter.starVal > 0) {
        if (and_var === true) {
          searchString = searchString.concat("&rating=" + props.filter.starVal);
        } else {
          searchString = searchString.concat("rating=" + props.filter.starVal);
          and_var = true;
        }
      }

      if (
        props.filter.year_range !== null &&
        props.filter.year_range.use === true
      ) {
        if (and_var === true) {
          searchString = searchString.concat(
            "&publication=" +
              props.filter.year_range.earlier_year +
              "-" +
              props.filter.year_range.later_year
          );
        } else {
          searchString = searchString.concat(
            "publication=" +
              props.filter.year_range.earlier_year +
              "-" +
              props.filter.year_range.later_year
          );
          and_var = true;
        }
      }
      // Most recently added to collection
      if (props.filter.recentCollection === true) {
        if (and_var === true) {
          searchString = searchString.concat(
            "&recentlyadded=" + props.filter.recentCollection
          );
        } else {
          searchString = searchString.concat(
            "recentlyadded=" + props.filter.recentCollection
          );
          and_var = true;
        }
      }

      //checks if there exists a true element in the array
      const the_category_index = props.filter.cat_list;
      //greater than 0 because the 1st element (all) should be ignored
      if (the_category_index != null) {
        if (and_var === true) {
          searchString = searchString.concat(
            "&category=" + props.filter.cat_list
          );
        } else {
          searchString = searchString.concat(
            "category=" + props.filter.cat_list
          );
          console.log("dwnjewndjwnjn");
        }
      }
      console.log("----------------");
      console.log(searchString);
      console.log("----------------");

      try {
        //-----------------------
        const baseURL = "http://localhost:8000/";
        const bookCall = axios.create({
          baseURL: baseURL,
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        });
        const config = {
          headers: {
            Authorization: localStorage.getItem("access_token")
              ? " Token " + localStorage.getItem("access_token")
              : null,
          },
        };
        bookCall.interceptors.response.use(
          (response) => response,
          (error) => {
            const { status } = error.response;
            if (status === 401) {
              history.push("login");
            }
            return Promise.reject(error);
          }
        );
        const response = await bookCall
          .get(searchString, config)
          .then((response) => {
            return response;
          });
        //------------------------
        //const response = await axios.get(searchString, config);
        props.setResults({ books: response.data });
        //props.setSearchResults(response.data);
      } catch (err) {
      } finally {
        setLoading({
          isLoading: false,
        });
        if (location.pathname !== "/result") {
          history.push("/result");
        }
      }
    }, 500);

    setPrevID({
      prev_id: prev_id,
    });
  }, [search, props.filter]);

  return (
    <div className="search_bar_div">
      <Input.Group size="large">
        <Input
          className="search_bar"
          placeholder="Search for Books, Authors and More!"
          size="large"
          id="searchBar"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              setLoading({
                isLoading: true,
              });
              setSearchType((prevState) => ({
                searchType: prevState.searchType,
                searchText: prevState.searchText,
                enterButtonHit: true,
              }));
            }
          }}
          onChange={async () => {
            setLoading({
              isLoading: true,
            });
            const val = document.getElementById("searchBar").value;
            await setSearchType((prevState) => ({
              searchType: prevState.searchType,
              searchText: val,
              enterButtonHit: false,
            }));
          }}
        />
        <div style={{ width: 100 }}>
          <Searcher
            setSearchType={setSearchType}
            search={search}
            loading={loading}
          ></Searcher>
        </div>
      </Input.Group>
    </div>
  );
};

const SearchPicker = (props) => {
  const handleChange = (value) => {
    props.setSearchType((prevState) => ({
      searchType: value,
      searchText: prevState.searchText,
      enterButtonHit: false,
    }));
  };

  return (
    <Select
      size="large"
      defaultValue={props.search.searchType}
      style={{ width: 100 }}
      onChange={handleChange}
    >
      <Option value="name">Book</Option>
      <Option value="author">Author</Option>
    </Select>
  );
};

const SearchPickerSearching = () => {
  return (
    <div style={{ padding: "" }}>
      <Spin
        size="large"
        style={{
          position: "relative",
          left: "15px",
          top: "4px",
          color: "white",
        }}
      />
    </div>
  );
};

const Searcher = (props) => {
  if (props.loading.isLoading) {
    return <SearchPickerSearching />;
  } else {
    return (
      <SearchPicker setSearchType={props.setSearchType} search={props.search} />
    );
  }
};
