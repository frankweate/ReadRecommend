import React from "react";
import "../App.css";
import "./SearchResult.css";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";
import { Typography } from "antd";
import { DislikeOutlined } from "@ant-design/icons";

const { Text } = Typography;
export function SearchResults(props) {
  if (props.search.books.length === 0) {
    return <NoResults />;
  } else {
    return <SomeResults search={props.search} />;
  }
}

const SomeResults = (prop) => {
  let history = useHistory();
  return (
    <div>
      {prop.search.books.map((inputdetail, index) => {
        return (
          <h1 key={index}>
            <Card
              class="card"
              onClick={() => {
                history.push({
                  pathname: "/book",
                  state: { name: inputdetail.id },
                });
              }}
            >

              <Card.Body style={{padding:"10px"}}>
              <Card.Img variant="top" width="10%" src={inputdetail.image_url} />
                <Card.Title>{inputdetail.name}</Card.Title>
                <Text>By: {inputdetail.author}</Text>
              </Card.Body>
            </Card>
          </h1>
        );
      })}
    </div>
  );
};
const NoResults = (props) => {
  return (
    <div className="NoMatchDiv">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>No Matching results </h1>

      <DislikeOutlined style={{ fontSize: 80 }} />
    </div>
  );
};

export default SearchResults;
