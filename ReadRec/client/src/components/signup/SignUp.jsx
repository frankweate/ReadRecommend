import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import axios from "axios";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 4 },
};

/**
 * A form that allows users to signup
 */
const SignUp = () => {
  // Call the api to create the given user
  const [suc, setSuc] = useState({
    username: false,
    password: false,
    fin: false,
  });
  const performSubmit = async (values) => {
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
        .post(
          "/auth/register/",
          {
            username: values.username,
            password: values.password,
          },
          config
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
    const res = await performSubmit(values);
    console.log(res);
    if (res.stat === 201) {
      setSuc({ fin: true });
    } else if (res.dat.message === "Username already exists") {
      setSuc({ username: true, password: false });
    } else if (
      res.dat.message === "valid password is required to register a user"
    ) {
      setSuc({ password: true, username: false, fin: false });
    } else {
      setSuc({ password: true, username: true, fin: false });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelAlign="left"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      {suc.fin ? (
        <Form.Item>
          <Alert message="Account Created" type="success" showIcon />
        </Form.Item>
      ) : (
        <></>
      )}
      {suc.username ? (
        <Form.Item>
          <Alert message="Username Wrong" type="error" showIcon />
        </Form.Item>
      ) : (
        <></>
      )}
      {suc.password ? (
        <Form.Item>
          <Alert message="Password Not Correct" type="error" showIcon />
        </Form.Item>
      ) : (
        <></>
      )}
      <Form.Item {...tailLayout}>
        {!suc.fin ? (
          <Button type="primary" htmlType="submit" size="large">
            Create Account
          </Button>
        ) : (
          <></>
        )}
      </Form.Item>
    </Form>
  );
};

export default SignUp;
