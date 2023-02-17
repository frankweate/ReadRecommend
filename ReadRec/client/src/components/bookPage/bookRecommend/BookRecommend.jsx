import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Divider, Row, Col, Card, Carousel } from "antd";
import Loading from "../Loading";
import "./recs.css";
import axios from "axios";
import { useRef } from "react";
import historya from "./history";

const { Meta } = Card;

// A functional component for book recommendations
const BookRecommend = ({ bid }) => {
  const ref = useRef();
  const [recs, setRecs] = useState({
    loaded: false,
    books: [],
    modes: [],
    page: -1,
  });
  const onChange = (a) => {
    setRecs((prev) => {
      return {
        loaded: true,
        books: prev.books,
        modes: prev.modes,
        page: a,
      };
    });
  };
  useEffect(() => {
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
          .get(`/recommendation/book/?bid=${bid}`, config)
          .then((response) => {
            return response;
          });
        const data = response.data.recs;
        const recs = [];
        const real = data.map((details, index) => {
          // Push the recommendation mode into an array
          recs.push(details.mode);
          const cards = details.books.map((book, index) => {
            return (
              <Col
                span={4}
                key={index}
                style={{ display: "inline-flex", alignSelf: "stretch" }}
              >
                <Card
                  hoverable
                  style={{ width: 150 }}
                  onClick={() => {
                    historya.push({
                      pathname: "/book",
                      state: { name: book.bid },
                    });
                  }}
                  cover={<img alt={book.name} src={book.image_url} />}
                >
                  <Meta title={book.name} />
                </Card>
              </Col>
            );
          });
          return (
            <div key={index}>
              <Row
                gutter={[16, 24]}
                style={{
                  marginLeft: "10px",
                  marginTop: "1px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                {cards}
              </Row>
            </div>
          );
        });
        if (ref && ref.current) {
          // this 'ref' has access to 'goTo', 'prev' and 'next'
          ref.current.goTo(0, true);
        } else {
          setRecs({ loaded: true, books: real, modes: recs, page: 0 });
        }
      } catch (error) {
        console.log(error.stack);
      }
    }
    getData();
  }, [bid, ref]);
  return (
    <div style={{ marginTop: "10px" }}>
      <Divider orientation="left">
        {" "}
        {recs.page === -1 ? "Similar Books" : `${recs.modes[recs.page]}`}
      </Divider>
      {recs.loaded ? (
        <div style={{ width: 1200 }}>
          <Carousel initialSlide={0} afterChange={onChange} ref={ref}>
            {" "}
            {recs.books}{" "}
          </Carousel>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default BookRecommend;

BookRecommend.propTypes = {
  bid: PropTypes.number,
};
