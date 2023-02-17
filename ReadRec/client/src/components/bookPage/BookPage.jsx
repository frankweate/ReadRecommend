import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
import BookInfo from "./BookInfo";
import axios from "axios";

// For getting the actual book page
const BookPage = () => {
  const location = useLocation();
  console.log(location.state.name);
  const [book, setBook] = useState({ loaded: false, book: {} });
  useEffect(() => {
    // Make an API call here to get all the relevant book data
    async function getData() {
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
        headers: {},
      };
      try {
        const response = await bookCall
          .get(`/book/?id=${location.state.name}`, config)
          .then((response) => {
            return response;
          });
        setBook({ loaded: true, book: response.data });
      } catch (error) {
        console.log(error.stack);
      }
    }
    getData();
  }, [location.state.name]);
  if (book.loaded) {
    console.log(book);
    return (
      <>
        <BookInfo prop={book.book} />
      </>
    );
  } else {
    return <Loading />;
  }
};

export default BookPage;
