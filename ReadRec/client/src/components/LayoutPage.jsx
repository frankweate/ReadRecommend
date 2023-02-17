import React, { useState } from "react";
import { Layout, Menu, Dropdown } from "antd";

import "antd/dist/antd.css";
import "./layout.css";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { NormalLoginForm } from "./Login";
import SignPage from "./signup/SignPage";
import { SearchBar } from "./SearchBar";
import "./FilterPanel";
import logo from "./logo.png";
import { DownOutlined } from "@ant-design/icons";
import axiosInstance from "../axiosApi";
import { FilterPanel } from "./FilterPanel";
import BookPage from "./bookPage/BookPage";
import Collection from "./bookCollection/Collection";
import NewCollection from "./bookCollection/NewCollection";
import BookCollection from "./bookCollection/BookCollection";
import BookReminder from "./bookReminder/BookReminder";
import Reminders from "./bookReminder/Reminders";
import { RecommendPage } from "./recommendation/RecommendPage";
import Profile from "./bookPage/userProfile/Profile";
const { Header, Content, Footer } = Layout;

/**
 * High level layout for the page, a core entry point into the react app
 */
const LayoutPage = () => {
  let det = false;
  const isLog = localStorage.getItem("access_token");
  if (isLog !== null) {
    det = true;
  }

  const [log, setLogged] = useState({
    logged: det,
    username: "",
  });

  const [searchResults, setSearchResults] = useState({
    books: [],
  });

  const [filter, setFilter] = useState({
    year_range: null,
    starVal: 0,
    cat_list: [],
    recentCollection: true,
    category_books: false,
  });

  return (
    <Router>
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/">
                <img src={logo} alt="Logo" className="img-logo" />
              </Link>
            </Menu.Item>

            <Menu.Item key="2" className="search">
              <SearchBar setResults={setSearchResults} filter={filter} />
            </Menu.Item>

            <Menu.Item key="4" style={{ float: "right" }}>
              <Dropdown overlay={Account(log.logged, setLogged)}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                  href="/"
                >
                  Account Management <DownOutlined />
                </a>
              </Dropdown>
            </Menu.Item>
            <Menu.Item key="3" style={{ float: "right" }}>
              <Link to={{ pathname: "/collection", state: { user: "" } }}>
                Collections
              </Link>
            </Menu.Item>
            <Menu.Item key="4" style={{ float: "right" }}>
              <Link to={{ pathname: "/reminders", state: { user: "" } }}>
                Reminders
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content
          className="site-layout"
          style={{ padding: "0 70px", marginTop: 64 }}
        >
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: "100vh" }}
          >
            <Switch>
              <Route exact path="/result">
                <Search search={searchResults} setFilter={setFilter} />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/login">
                <NormalLoginForm setLogged={setLogged} log={log} />
              </Route>
              <Route
                exact
                path="/register"
                render={() => {
                  return SignPage();
                }}
              />
              <Route exact path="/book">
                <BookPage />
              </Route>
              <Route exact path="/collection">
                <Collection />
              </Route>
              <Route exact path="/uniquecollection">
                <BookCollection />
              </Route>
              <Route exact path="/New_collection">
                <View />
              </Route>
              <Route exact path="/create_reminder">
                <ReminderView />
              </Route>
              <Route exact path="/reminders">
                <Reminders />
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>ReadRecommend</Footer>
      </Layout>
    </Router>
  );
};

const Home = () => {
  return (
    <div>
      <RecommendPage></RecommendPage>
    </div>
  );
};

const View = () => {
  return (
    <div>
      <NewCollection></NewCollection>
    </div>
  );
};

const ReminderView = () => {
  return (
    <div>
      <BookReminder></BookReminder>
    </div>
  );
};
const Search = (props) => {
  return (
    <div>
      <FilterPanel search={props.search} setFilter={props.setFilter} />
    </div>
  );
};

const Account = (logged, setLogged) => {
  // Function for doing the particular logout

  const handleLogout = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("access_token")
            ? " Token " + localStorage.getItem("access_token")
            : null,
        },
      };
      const response = await axiosInstance.get("/auth/logout/", config);
      localStorage.setItem("access_token", null);
      localStorage.removeItem("access_token");
      return response;
    } catch (error) {
      console.log("in here");
      console.log(error);
      axiosInstance.defaults.headers["Authorization"] = null;
      localStorage.removeItem("access_token");
    }
  };
  if (!logged) {
    return (
      <Menu>
        <Menu.Item>
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/register">Register</Link>
        </Menu.Item>
      </Menu>
    );
  }
  return (
    <Menu>
      <Menu.Item
        onClick={async () => {
          // Call Api Log-Out function
          await handleLogout();
          setLogged({ logged: false, username: "" });
          // window.location.href = "/";
        }}
      >
        Log Out
      </Menu.Item>
      <Menu.Item>
        <Link to={{ pathname: "/new_collection", state: { user: "" } }}>
          New Collections
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={{ pathname: "/create_reminder", state: { user: "" } }}>
          New Reminder
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default LayoutPage;
