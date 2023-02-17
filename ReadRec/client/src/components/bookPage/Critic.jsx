import React from "react";
import PropTypes from "prop-types";
import { Typography, Rate } from "antd";

const { Title, Text } = Typography;

const Critic = ({ book }) => {
  return (
    <div>
      <Title level={4}>Score: {book.critic_rating}/5</Title>
      <Rate
        allowHalf
        defaultValue={0}
        value={book.critic_rating}
        disabled={true}
      />
      <Text style={{ display: "flex", marginTop: "10px" }}>
        {" "}
        Critic Score: {book.critic_rating}/5
      </Text>
      <Rate
        allowHalf
        defaultValue={0}
        value={book.critic_rating}
        disabled={true}
        style={{ marginTop: "10px" }}
      />
      <Text style={{ display: "flex", marginTop: "10px" }}>
        {" "}
        Community Score: {book.comm_rating}/5
      </Text>
      <Rate
        allowHalf
        defaultValue={0}
        value={book.comm_rating}
        disabled={true}
        style={{ marginTop: "10px" }}
      />
    </div>
  );
};

export default Critic;

Critic.propTypes = {
  book: PropTypes.object,
};
