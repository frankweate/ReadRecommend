import React, { useState, useEffect } from "react";
import { Typography, Avatar, Button } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../Loading";
import axios from "axios";
import { UserOutlined } from "@ant-design/icons";
import CreateChallenge from "../../bookReminder/CreateChallenge";

const { Title } = Typography;

/**
 * A component for displaying a user profile.
 */
const Profile = () => {
  const location = useLocation();
  const history = useHistory();
  const name = location.state.user;
  console.log(name);
  const [prof, setProf] = useState({ loaded: false, cols: 0, chal: 0 });
  useEffect(() => {
    async function getData() {
      try {
        const baseURL = "http://localhost:8000/";

        const axiosInstance = axios.create({
          baseURL: baseURL,
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        });
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
          .get(`/profile/?username=${name}`)
          .then((response) => {
            return response;
          });
        const data = response.data;
        setProf({
          loaded: true,
          cols: data.no_collections,
          chal: data.no_challenges,
        });
      } catch (error) {
        console.log(error.stack);
      }
    }
    getData();
  }, [name, history]);
  return (
    <>
      {prof.loaded ? (
        <div style={{ marginLeft: "50px", marginTop: "50px" }}>
          <div style={{ display: "flex" }}>
            <Avatar size={64} icon={<UserOutlined />} />{" "}
            <Title style={{ marginLeft: "20px", marginTop: "2px" }}>
              {" "}
              {name}{" "}
            </Title>
          </div>
          <Title level={4} style={{ marginTop: "30px" }}>
            Book Collections: {prof.cols}
          </Title>
          <Title level={4}>Challenges Received: {prof.chal}</Title>
          <Button
            size="large"
            type="primary"
            style={{ marginTop: "5px" }}
            onClick={() => {
              history.push({
                pathname: "/collection",
                state: { user: name },
              });
            }}
          >
            View {name}&rsquo;s Book Collections!
          </Button>
          <CreateChallenge name={name} />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Profile;
