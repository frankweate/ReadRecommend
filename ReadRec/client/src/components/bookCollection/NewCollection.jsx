import React from 'react';
import { Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import 'antd/dist/antd.css';
import axios from 'axios';

const NewCollection = () => {
  // Call the api to create the given user
  const history1 = useHistory();
  if (localStorage.getItem('access_token') === null) {
    history1.push('login');
  }
  const history = useHistory();
  const performSubmit = async (values) => {
    try {
      const baseURL = 'http://localhost:8000/';
      console.log(values.username);
      const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 5000,
        headers: {
          Authorization:
            localStorage.getItem('access_token') !== null
              ? ' Token ' + localStorage.getItem('access_token')
              : null,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });
      const config = {
        headers: {
          Authorization: localStorage.getItem('access_token')
            ? ' Token ' + localStorage.getItem('access_token')
            : null,
        },
      };
      console.log(config);
      axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          const { status } = error.response;
          if (status === 401) {
            history.push('login');
          }
          return Promise.reject(error);
        }
      );
      const response = await axiosInstance
        .get(`/collection/create/?name=${values.username}`, config, {
          message: values.username,
        })
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
  };

  return (
    <div>
      <h2>Create your collections here!</h2>
      <Form
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        labelAlign='left'
      >
        <Form.Item name='username'>
          <Input />
        </Form.Item>
        <Button key='submit' type='primary' htmlType='submit'>
          <b>Create Collection +</b>
        </Button>
        <br></br>
        <br></br>
        <Button
          type='primary'
          onClick={() => {
            history.push({
              pathname: '/collection',
              state: { user: '' },
            });
          }}
        >
          <b>Go back to Home</b>
        </Button>
      </Form>
    </div>
  );
};
export default NewCollection;
