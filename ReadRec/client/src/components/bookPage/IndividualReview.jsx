import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Rate, Typography, Button, Alert } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import axiosInstance from "./../../axiosApi";
import { useHistory } from "react-router-dom";

const { Text, Paragraph } = Typography;

// For an individual review component
const IndividualReview = ({ review }) => {
  const [like, setLike] = useState({ likes: review.likes, failed: false });

  // For liking a review
  let history = useHistory();
  const likeReview = async () => {
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
    const config = {
      headers: {
        Authorization: localStorage.getItem("access_token")
          ? " Token " + localStorage.getItem("access_token")
          : null,
      },
    };
    try {
      const response = await axiosInstance
        .get(`/like/rating/?id=${review.id}`, config)
        .then((response) => {
          return response;
        });
      if (response.data.message === "liked") {
        setLike((prev) => {
          return {
            likes: prev.likes + 1,
            failed: false,
          };
        });
      } else if (response.data.status === "already liked") {
        setLike((prev) => {
          return {
            likes: prev.likes,
            failed: true,
          };
        });
      }
    } catch (error) {
      console.log(error.stack);
    }
  };
  const rows = 5;
  return (
    <Card
      hoverable
      onClick={() => {
        history.push({
          pathname: "/profile",
          state: { user: review.reviewer },
        });
      }}
      title={
        <div style={{ display: "flex" }}>
          {review.critic ? (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ marginTop: "10px", marginRight: "5px" }}
            />
          ) : (
            <></>
          )}
          <p style={{ marginTop: "5px", marginRight: "5px" }}>
            {review.reviewer} rated it:{" "}
          </p>
          <div>
            <Rate
              allowHalf
              defaultValue={0}
              value={review.score}
              disabled={true}
            />
          </div>
        </div>
      }
      bordered={false}
      style={{ width: 800 }}
    >
      <Paragraph
        ellipsis={{
          rows,
          expandable: true,
        }}
      >
        {review.text}
      </Paragraph>
      <div>
        <Text code>{like.likes} Likes</Text>
        <Button
          size={"small"}
          type={"link"}
          onClick={(e) => {
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            likeReview();
          }}
        >
          Like Review
        </Button>
        {like.failed ? (
          <Alert
            message="Already liked review!"
            type="info"
            showIcon
            style={{ width: "200px", marginTop: "10px" }}
          />
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};

export default IndividualReview;

IndividualReview.propTypes = {
  review: PropTypes.object,
};
