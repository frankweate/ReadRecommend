import React from "react";
import { BookCarousel } from "./BookCarousel";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export const RecommendPage = (props) => {
  const [books, setBooks] = useState({
    allBooks: [],
  });

  useEffect(() => {
    async function fetchData() {
      const baseURL = "http://localhost:8000/";
      const config = {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? " Token " + localStorage.getItem("access_token")
            : null,
        },
      };
      var data;

      const response = await axios.post(
        baseURL + `recommendation/base/`,
        {},
        config
      );
      data = response.data;

      console.log("gois");
      setBooks({
        allBooks: data.recs,
      });
    }
    fetchData();
  }, []);
  return (
    <div>
      {books.allBooks.map((list, index) => {
        console.log(list);
        return <BookCarousel allBooks={list} />;
      })}
    </div>
  );
};
