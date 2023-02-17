import React, { useState } from "react";
import { Form, Button, InputNumber, Alert } from "antd";
import { useHistory } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import "./reminder.css";

/**
 * A component that allows the user to challenge another reader.
 */
const CreateChallenge = ({ name }) => {
  const [stat, setStat] = useState({ loading: false, stat: 0 });
  const history = useHistory();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
  const alertLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 4 },
  };

  /**
   * Hit the api endpoint to create a specific challenge
   * @param {form} values
   */
  const performSubmit = async (values) => {
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
    /**
     * We want the user to redirected to the login page when no auth present
     */
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
    const response = await axiosInstance.get(
      `/challenge/submit/?user=${name}&books=${values.amount}`
    );
    const data = response.data;
    /**
     * success -> the user was challenged
     * exists -> the user has already been challenged
     * otherwise -> failed to challenge the user
     */
    if (data.stat === "created") {
      setStat({ loading: false, stat: 1 });
    } else if (data.stat === "exists") {
      setStat({ loading: false, stat: 2 });
    } else {
      setStat({ loading: false, stat: 3 });
    }
  };
  /**
   * Return a standard form that allows a user to submit a challenge
   */
  return (
    <>
      <div style={{ marginTop: 50 }}>
        <h2>Challenge {name} to Read! </h2>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={async (values) => {
            setStat({ loading: true, stat: 0 });
            await performSubmit(values);
          }}
          labelAlign="left"
        >
          <Form.Item name="amount">
            <InputNumber
              min={1}
              max={1000}
              defaultValue={1}
              placeholder="Books"
            />
          </Form.Item>
          {stat.stat === 1 ? (
            <Form.Item {...alertLayout}>
              <Alert message="User Challenged!" type="success" showIcon />
            </Form.Item>
          ) : (
            <></>
          )}
          {stat.stat === 2 ? (
            <Form.Item {...alertLayout}>
              <Alert message="User Already Challenged!" type="error" showIcon />
            </Form.Item>
          ) : (
            <></>
          )}
          {stat.stat === 3 ? (
            <Form.Item {...alertLayout}>
              <Alert message="User Does Not Exist!" type="error" showIcon />
            </Form.Item>
          ) : (
            <></>
          )}
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            loading={stat.loading}
          >
            <b> Challenge User! </b>
          </Button>
        </Form>
      </div>
    </>
  );
};

export default CreateChallenge;

CreateChallenge.propTypes = {
  name: PropTypes.string,
};
