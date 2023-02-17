import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Alert, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import { useState } from "react";
const axios = require("axios");

export const NormalLoginForm = ({ setLogged, log }) => {
  const [err, setErr] = useState(0);
  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:8000/login/", values);
      console.log(response.data.token);
      setLogged({
        logged: true,
        username: response.data.token,
      });
      console.log(response.data.token);
      localStorage.setItem("access_token", response.data.token);
      // localStorage.setItem("access_token", response.data.token);
    } catch (error) {
      console.log(error);
      setErr(true);
    }
  };
  return (
    <div className="login-div">
      <Card>
        <h1>Login Here:</h1>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={async (vals) => {
            await onFinish(vals);
            console.log("finished fn");
            console.log(log.username);
            if (log.username !== "") {
              console.log("IN HERE");
              console.log(log.username);
              localStorage.setItem("access_token", log.username);
            }
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <ErrorMessage err={err} />
          </Form.Item>
          <Form.Item>
            <a className="login-form-forgot" href="/forgot_login">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="/register">register now!</a>
          </Form.Item>
        </Form>
        {log.logged ? (
          <Alert message="Successfully logged in!" type="success" />
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
};

const ErrorMessage = (props) => {
  if (props.err) {
    return <p className="invalid-text">Invalid Credentials!</p>;
  } else {
    return null;
  }
};

NormalLoginForm.propTypes = {
  setLogged: PropTypes.func,
  log: PropTypes.object,
};
