import React from "react";
import { Spin } from "antd";
import "./page.css";

const Spinner = () => {
  return (
    <div className="container">
      <Spin size="large" />
    </div>
  );
};

export default Spinner;
