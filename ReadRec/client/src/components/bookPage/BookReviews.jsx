import React, { useEffect, useState } from "react";
import { Divider, Select, Button } from "antd";
import Loading from "./Loading";
import Reviews from "./Reviews";
import axios from "axios";
import { useHistory } from "react-router-dom";
import CreateReview from "./bookReview/CreateReview";
const Option = { Select };

const handleChange = async (val, setState, revs) => {
  setState((prevState) => {
    return {
      ...prevState,
      sort: val,
      loaded: false,
    };
  });
  // Make an API call here to get the new sort direction
  try {
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
    const response = await bookCall
      .get(`/rating/?id=${revs.id}&no=${1}&filter=${val}`, config)
      .then((response) => {
        return response;
      });
    setState((prev) => {
      return {
        loaded: true,
        revs: response.data,
        page: 1,
        sort: prev.sort,
        id: prev.id,
      };
    });
  } catch (error) {
    console.log(error.stack);
  }
};

const BookReviews = (prop) => {
  console.log("in here!!!");
  console.log(prop.prop.id);
  let history = useHistory();
  const [revs, setRevs] = useState({
    loaded: false,
    revs: {},
    page: 1,
    sort: "likes",
    id: prop.prop.id,
  });
  console.log(revs);
  const [wants, setWants] = useState(false);
  useEffect(() => {
    setRevs(() => {
      return {
        sort: "likes",
        id: prop.prop.id,
        page: 1,
        revs: {},
        loaded: false,
      };
    });
    async function getData() {
      try {
        console.log("in get data!");
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
        const response = await bookCall
          .get(`/rating/?id=${prop.prop.id}&no=${1}&filter=${`likes`}`, config)
          .then((response) => {
            return response;
          });
        setRevs((prev) => {
          return {
            loaded: true,
            revs: response.data,
            page: prev.page,
            sort: prev.sort,
            id: prev.id,
          };
        });
      } catch (error) {
        console.log(error.stack);
      }
    }
    getData();
  }, [prop.prop.id]);
  return (
    <div style={{ marginTop: "20px" }}>
      <Divider orientation="left">
        {" "}
        Reviews: {prop.prop.crits} Critics and {prop.prop.comm} Community
        Reviews{" "}
      </Divider>
      <p> Sort Reviews: </p>
      <Select
        defaultValue="likes"
        style={{ width: 120 }}
        onChange={(val) => {
          handleChange(val, setRevs, revs);
        }}
        size="large"
      >
        <Option value="likes">Likes</Option>
        <Option value="date">Date</Option>
      </Select>
      <Button
        type="primary"
        size="large"
        style={{ marginLeft: "5px" }}
        onClick={() => {
          // Do not want a user who has no login to access a review
          if (localStorage.getItem("access_token") === null) {
            history.push("login");
          }
          setWants(true);
        }}
      >
        Create Review
      </Button>
      {wants ? <CreateReview set={setWants} id={revs.id} /> : <></>}
      {revs.loaded ? <Reviews prop={revs} setPrev={setRevs} /> : <Loading />}
    </div>
  );
};
export default BookReviews;
