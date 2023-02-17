import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu, Dropdown, Button, Alert } from "antd";
import { useHistory } from "react-router-dom";
import axios from "axios";

const menu = <Menu></Menu>;

// The component for adding a book to a specific collection
const AddBook = ({ bid }) => {
  console.log(bid);
  const [cols, setCols] = useState({
    loading: true,
    avail: false,
    collections: menu,
  });

  const [fail, setFail] = useState(0);

  const history = useHistory();
  // Want to call our endpoint to get the collections relevant to a user
  useEffect(() => {
    // A function for hitting the route and adding the book to the collection
    const addBook = async (cid) => {
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
          .get(`/collection/add/?cid=${cid}&bid=${bid}`, config)
          .then((response) => {
            return response;
          });
        if (response.data.message === "success") {
          setFail(2);
        } else {
          setFail(1);
        }
      } catch (error) {
        console.log(error.stack);
      }
    };
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
          .get(`/collection/all/`, config)
          .then((response) => {
            return response;
          });
        const data = response.data;
        if (data.length === 0) {
          setCols({ loading: false, avail: false, collections: menu });
        } else {
          const real = data.map((details, index) => {
            return (
              <Menu.Item key={index} onClick={() => addBook(details.id)}>
                <p>{details.name}</p>
              </Menu.Item>
            );
          });
          const final = <Menu>{real}</Menu>;
          setCols({
            loading: false,
            avail: true,
            collections: final,
          });
        }
      } catch (error) {
        console.log(error.stack);
      }
    }
    getData();
  }, [bid, history]);
  return (
    <>
      {fail === 1 ? (
        <Alert
          message="Book Already in Collection!"
          type="error"
          style={{ marginBottom: "5px" }}
        />
      ) : (
        <></>
      )}
      {fail === 2 ? (
        <Alert
          message="Successfully Added Book!"
          type="success"
          style={{ marginBottom: "5px" }}
        />
      ) : (
        <></>
      )}
      <Dropdown
        overlay={cols.collections}
        placement="bottomCenter"
        arrow
        disabled={!cols.avail}
      >
        <Button size="large" loading={cols.loading}>
          Add To Collection
        </Button>
      </Dropdown>
    </>
  );
};

export default AddBook;

AddBook.propTypes = {
  bid: PropTypes.number,
};
