import React from "react";
import { Form, Input, Button } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import axios from "axios";

const { TextArea } = Input;

const BookReminder = () => {
  // Call the api to create the given user
  const history1 = useHistory();
  const location = useLocation();
  const username1 = location.state.user;
  if (username1 !== "") {
    console.log(username1);
  }
  if (localStorage.getItem("access_token") === null) {
    history1.push("login");
  }
  const history = useHistory();
  const performSubmit = async (values) => {
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
      console.log(config);
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
        .get(
          `/reminder/create/?name=${values.username}&text=${values.description}`,
          config,
          {
            message: values.username,
          }
        )
        .then((response) => ({
          stat: response.status,
          dat: response.data,
        }));
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.stack);
    }
  };

  const onFinish = async (values) => {
    console.log(values);
    const res = await performSubmit(values);
    console.log(res);
  };

  return (
    <div>
      <h2>Create your Reminders here!</h2>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        labelAlign="left"
      >
        <Form.Item name="username">
          <Input placeholder="Enter a Reminder Name" />
        </Form.Item>
        <Form.Item name="description">
          <TextArea
            placeholder="Enter a Reminder Description"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
        <Button key="submit" type="primary" htmlType="submit">
          <b>Create Reminder +</b>
        </Button>
        <br></br>
        <br></br>
        <Button
          type="primary"
          onClick={() => {
            history.push({
              pathname: "/home",
            });
          }}
        >
          <b>Go back to Home</b>
        </Button>
      </Form>
    </div>
  );
};
export default BookReminder;
