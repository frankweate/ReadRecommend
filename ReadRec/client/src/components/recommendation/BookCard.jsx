import React from "react";
import { Card } from "antd";
import "./BookCard.css";
const { Meta } = Card;
export const BookCard = (props) => {
  return (
    <Card
      style={{
        height: 500,
        overflow: "hidden",
        padding: "20px",
      }}
      hoverable
      cover={
        <img style={{ height: 400 }} alt="example" src={props.book.image_url} />
      }
    >
      <Meta
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        title={props.book.name}
      ></Meta>
    </Card>
  );
};
