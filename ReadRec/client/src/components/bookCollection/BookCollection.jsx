import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import Loading from "../bookPage/Loading";
import { Typography, Row, Card, Col, Rate } from "antd";
import { useEffect } from "react";
import axiosInstance from "../../axiosApi";

const { Title } = Typography;
const { Meta } = Card;

// For showing an individual book collection
const BookCollection = () => {
  const location = useLocation();
  const history = useHistory();
  const cid = location.state.cid;
  const name = location.state.name;
  const [books, setBooks] = useState({ loaded: false, books: [], empty: true });
  useEffect(() => {
    async function getData() {
      try {
        const config = {
          headers: {
            Authorization: localStorage.getItem("access_token")
              ? " Token " + localStorage.getItem("access_token")
              : null,
          },
        };
        axiosInstance.interceptors.response.use(
          (response) => response,
          (error) => {
            const { status } = error.response;
            if (status === 401) {
              history.push("login");
            }
            return Promise.reject(error);
          }
        );
        const response = await axiosInstance
          .get(`/collection/book/?cid=${cid}`, config)
          .then((response) => {
            return response;
          });
        const data = response.data;
        if (data.length === 0) {
          setBooks({ loaded: true, books: [], empty: true });
        } else {
          const real = data.map((details, index) => {
            return (
              <Col
                span={6}
                key={index}
                style={{ display: "inline-flex", alignSelf: "stretch" }}
              >
                <Card
                  hoverable
                  style={{ width: 240, marginBottom: 10 }}
                  cover={<img alt={details.name} src={details.image_url}></img>}
                  onClick={() => {
                    history.push({
                      pathname: "/book",
                      state: { name: details.bid },
                    });
                  }}
                >
                  <Meta
                    title={details.name}
                    description={`by ${details.author}`}
                  />
                  <Rate
                    disabled={true}
                    value={details.rating}
                    style={{ marginTop: "10px" }}
                  />
                </Card>
              </Col>
            );
          });
          setBooks({ loaded: true, books: real, empty: false });
        }
      } catch (error) {
        console.log(error.stack);
      }
    }
    getData();
  }, [cid, history]);
  if (!books.loaded) {
    return <Loading />;
  }
  if (books.empty) {
    return <Title> {name} has no books in the collection! </Title>;
  }
  return (
    <>
      <Title style={{ marginBottom: "80px", marginTop: "15px" }}>
        {`Books in ${name}`}
      </Title>
      <Row gutther={[16, 24]}>{books.books}</Row>
    </>
  );
};

export default BookCollection;
