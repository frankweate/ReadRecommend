import React, { useState } from "react";
import PropTypes from "prop-types";
import { Divider, Rate, Input, Button, Alert } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./revs.css";
import axiosInstance from "./../../../axiosApi";
import { useHistory } from "react-router-dom";
const { TextArea } = Input;

// A component for a user being able to create a review
const CreateReview = ({ set, id }) => {
  const [form, setForm] = useState({
    rating: 0,
    text: "",
    loading: false,
    book: id,
  });
  const history = useHistory();
  const [error, setError] = useState(0);
  const submitReview = async () => {
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
    const config = {
      headers: {
        Authorization: localStorage.getItem("access_token")
          ? " Token " + localStorage.getItem("access_token")
          : null,
      },
    };
    try {
      const response = await axiosInstance
        .post(
          `/rating/submit/`,
          {
            rating: form.rating,
            review: form.text,
            id: id,
          },
          config
        )
        .then((response) => {
          return response;
        });
      const data = response.data;
      if (data.stat === "success") {
        setError(1);
      } else if (data.stat === "User already has review") {
        setError(3);
      } else {
        setError(2);
      }
    } catch (error) {
      console.log(error.stack);
    }
  };
  return (
    <div>
      <Divider />
      <div style={{ display: "inline-block" }}>
        <p style={{ display: "inline-block", marginRight: "5px" }}>
          {" "}
          My Rating:{" "}
        </p>
        <Rate
          allowHalf
          defaultValue={0}
          onChange={(value) => {
            // Allow for the changing of the form
            setForm((prevState) => {
              return {
                rating: value,
                text: prevState.text,
                loading: false,
                book: prevState.book,
              };
            });
          }}
        />
      </div>
      <div style={{ width: "800px" }}>
        <TextArea
          rows={5}
          allowClear={true}
          onChange={(e) => {
            const valu = e.target.value;
            setForm((prevState) => {
              return {
                rating: prevState.rating,
                text: valu,
                loading: false,
                book: prevState.book,
              };
            });
          }}
        />
      </div>
      <Button
        type="primary"
        shape="round"
        size="large"
        style={{ marginTop: "5px" }}
        loading={form.loading}
        onClick={() => {
          // Make the API call to send to server
          console.log(form);
          submitReview();
        }}
      >
        Submit Review
      </Button>
      <Button
        shape="circle"
        onClick={() => {
          // At this point, the user wants to close the review so let them
          set(false);
        }}
        icon={<CloseOutlined />}
        style={{ marginLeft: "5px" }}
      />
      {error === 1 ? (
        <Alert
          message="Successfully Created Review"
          type="success"
          className="nots"
        />
      ) : (
        <></>
      )}
      {error === 2 ? (
        <Alert message="Please Provide Text" type="error" className="nots" />
      ) : (
        <></>
      )}
      {error === 3 ? (
        <Alert
          message="Already Submitted Review"
          type="error"
          className="nots"
        />
      ) : (
        <></>
      )}
      <Divider />
    </div>
  );
};

export default CreateReview;

CreateReview.propTypes = {
  set: PropTypes.func,
  id: PropTypes.any,
};
