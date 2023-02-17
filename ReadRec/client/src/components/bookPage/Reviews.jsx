import React from "react";
import { Pagination } from "antd";
import PropTypes from "prop-types";
import IndividualReview from "./IndividualReview";
import axios from "axios";

const Reviews = ({ prop, setPrev }) => {
  const revs = prop.revs.reviews.map((review, index) => {
    return (
      <div key={index}>
        <IndividualReview review={review} />
      </div>
    );
  });
  const onChange = async (page) => {
    // Make an API call here to get new page data for reviews
    setPrev((prev) => {
      return {
        ...prev,
        loaded: false,
      };
    });
    try {
      const baseURL = "http://localhost:8000/";

      const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 5000,
        headers: {},
      });
      const config = {
        headers: {},
      };
      const response = await axiosInstance
        .get(`/rating/?id=${prop.id}&no=${page}&filter=${prop.sort}`, config)
        .then((response) => {
          return response;
        });
      setPrev((prev) => {
        return {
          loaded: true,
          revs: response.data,
          page: page,
          sort: prev.sort,
          id: prev.id,
        };
      });
    } catch (error) {
      console.log(error.stack);
    }
  };

  return (
    <div>
      <div style={{ marginTop: "50px" }}>{revs}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          current={prop.page}
          onChange={onChange}
          total={prop.revs.no_pages * 10}
          pageSizeOptions={["10"]}
        />
      </div>
    </div>
  );
};

export default Reviews;

Reviews.propTypes = {
  prop: PropTypes.object,
  setPrev: PropTypes.func,
};
