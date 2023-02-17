import React from "react";
import "./page.css";
import { Typography, List, Anchor } from "antd";
import BookReviews from "./BookReviews";
import Critic from "./Critic";
import AddBook from "./bookAdd/AddBook";
import BookRecommend from "./bookRecommend/BookRecommend";
import { useHistory } from "react-router-dom";
import "./Bookinfo.css";

const { Title } = Typography;
const { Paragraph } = Typography;
const { Link } = Anchor;

const BookInfo = (prop) => {
  let history = useHistory();
  console.log(prop.prop);
  const rows = 6;
  return (
    <div className="master">
      <div className="book">
        <div>
          <img className="image" src={prop.prop.image_url} alt="img"></img>
          <div style={{ marginTop: "20px", fontSize: "16px" }}>
            <p> Publication: {prop.prop.publication}</p>
          </div>
          <Critic book={prop.prop} />
        </div>
        <div className="right">
          <Title>{prop.prop.name}</Title>
          <span>by {prop.prop.author} </span>
          <div className="descrip">
            <Paragraph
              ellipsis={{
                rows,
                expandable: true,
              }}
              title={`${prop.prop.description}--William Shakespeare`}
            >
              {prop.prop.description}
            </Paragraph>
          </div>
        </div>
        <div className="cats">
          <List
            size="large"
            header={<div style={{ fontWeight: "bold" }}>Categories</div>}
            bordered
            dataSource={prop.prop.categories}
            renderItem={(item) => (
              <List.Item
                className="list_item"
                onClick={() => {
                  history.push({
                    pathname: "/result",
                    state: { category: item },
                  });
                }}
              >
                {item}
              </List.Item>
            )}
          />
          <div style={{ marginTop: "20px", fontSize: "16px" }}>
            <p> Collections with book: {prop.prop.collections}</p>
            <AddBook bid={prop.prop.id} />
          </div>
        </div>
      </div>
      <BookRecommend bid={prop.prop.id} />
      <BookReviews
        prop={{
          id: prop.prop.id,
          crits: prop.prop.no_critic,
          comm: prop.prop.no_comm,
        }}
      />
    </div>
  );
};

export default BookInfo;
