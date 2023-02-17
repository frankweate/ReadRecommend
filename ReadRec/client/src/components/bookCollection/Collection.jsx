import React from "react";
import { Typography, Row, Col, Card, Button } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";
import Loading from "../bookPage/Loading";
import { useEffect } from "react";
import axios from "axios";

const { Title } = Typography;

// Basic page for viewing a collection
const Collection = () => {
  // Want the individual to be directed to the login page with no auth
  const history = useHistory();
  const location = useLocation();
  const username = location.state.user;
  let suc = false;
  if (username !== "") {
    suc = true;
    console.log(username);
  }
  // console.log(localStorage.getItem("access_token"));
  // if (localStorage.getItem("access_token") === null) {
  //   history.push("login");
  // }
  const [cols, setCols] = useState({
    loaded: false,
    cols: [],
    nobooks: true,
    other: suc,
  });
  useEffect(() => {
    async function getData() {
      try {
        const baseURL = "http://localhost:8000/";

        const axiosInstance = axios.create({
          baseURL: baseURL,
          timeout: 5000,
          headers: {
            Authorization:
              localStorage.getItem("access_token") !== null
                ? " Token " + localStorage.getItem("access_token")
                : null,
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
          .get(`/collection/all/?username=${username}`, config)
          .then((response) => {
            return response;
          });
        const data = response.data;
        if (data.length === 0) {
          setCols({ loaded: true, cols: [], nobooks: true });
        } else {
          const real = data.map((details, index) => {
            return (
              <Col span={6} key={index}>
                <Card
                  title={details.name}
                  hoverable
                  onClick={() => {
                    history.push({
                      pathname: "/uniquecollection",
                      state: { cid: details.id, name: details.name },
                    });
                  }}
                  style={{ width: 300, marginBottom: 10 }}
                >
                  <p>Books in Collection: {details.amount}</p>
                  <Button type="link" size="large">
                    View Collection
                  </Button>
                </Card>
              </Col>
            );
          });
          setCols((prev) => {
            return { loaded: true, cols: real, nobooks: false, suc: prev.suc };
          });
        }
      } catch (error) {
        console.log(error.stack);
      }
    }
    getData();
    return function () {};
  }, [history, username]);
  if (cols.loaded === false) {
    return <Loading />;
  }
  if (cols.nobooks === true) {
    return (
      <Title style={{ marginBottom: "80px", marginTop: "15px" }}>
        No Book Collections Available
      </Title>
    );
  }
  return (
    <>
      {cols.other ? (
        <Title style={{ marginBottom: "80px", marginTop: "15px" }}>
          Book Collections for {username}
        </Title>
      ) : (
        <Title style={{ marginBottom: "80px", marginTop: "15px" }}>
          Book Collections
        </Title>
      )}
      <Row gutther={[16, 24]}>{cols.cols}</Row>
    </>
  );
};

export default Collection;
