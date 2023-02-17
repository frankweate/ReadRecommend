import React from "react";
import SignUp from "./SignUp";
import { Row, Col, Card, Divider, Badge } from "antd";

/**
 * The page for viewing signing up for an account
 */
const SignPage = () => {
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "40vh" }}
    >
      <Col span={12}>
        <Card>
          <h1>Create Account</h1>
          <SignUp />
          <Divider />
          <Badge
            status="default"
            text="Password must be greater than six characters"
          />
          <br />
          <Badge
            status="default"
            text="Password must be less than twenty characters"
          />
          <br />
          <Badge status="default" text="Password must have upper-case" />
          <br />
          <Badge status="default" text="Password must have lower-case" />
          <br />
          <Badge status="default" text="Password must have $, #, % or &" />
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </Card>
      </Col>
    </Row>
  );
};

export default SignPage;
