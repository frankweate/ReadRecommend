import React from "react";
import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import "./Arrow.css";
const style = { fontSize: 150 };

export const Arrow = (props) => {
  const handleClick = () => {
    if (props.left) {
      props.setPress({
        pressedLeft: true,
        pressedRight: false,
      });
    } else {
      props.setPress({
        pressedLeft: false,
        pressedRight: true,
      });
    }
  };
  if (props.pos === 0) {
    return null;
  }
  if (props.left) {
    console.log(props.pos);
    return (
      <div className="Arrow" onClick={handleClick}>
        <CaretLeftOutlined style={style} />
      </div>
    );
  } else {
    return (
      <div className="Arrow" onClick={handleClick}>
        <CaretRightOutlined style={style} />
      </div>
    );
  }
};
