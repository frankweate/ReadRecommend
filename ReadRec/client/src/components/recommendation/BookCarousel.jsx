import React from "react";
import { Row, Col, Divider } from "antd";
import "./BookCarousel.css";
import { useHistory } from "react-router-dom";
import { Arrow } from "./Arrow";
import { BookCard } from "./BookCard";
import { useState } from "react";
import { useEffect } from "react";

export const BookCarousel = (props) => {
  let history = useHistory();
  const [carousel, setCarousel] = useState({
    shownBooks: props.allBooks.books.slice(0, 6),
    //index of first shownbook in all books
    currentpos: 0,
  });
  const [buttonpress, setButtonpress] = useState({
    pressedLeft: false,
    pressedRight: false,
  });
  //called when a button press occurs
  useEffect(() => {
    var offset = 1;

    console.log(buttonpress);
    if (buttonpress.pressedLeft) {
      offset = -1;
      buttonpress.pressedLeft = false;
    } else if (!buttonpress.pressedRight) {
      //if neither buttons were pressed then dont do anything

      return;
    }
    buttonpress.pressedRight = false;
    var change = 0;
    if (offset === 1) {
      for (var pos = 0; pos < carousel.shownBooks.length; pos++) {
        console.log(carousel.currentpos + carousel.shownBooks.length + pos);
        if (
          carousel.currentpos + carousel.shownBooks.length + pos <
          props.allBooks.books.length
        ) {
          console.log("hi");
          props.allBooks.books.push(props.allBooks.books.shift());
          change++;
        }
      }
    } else {
      for (var neg = 0; neg < carousel.shownBooks.length; neg++) {
        if (carousel.currentpos - neg > 0) {
          props.allBooks.books.unshift(props.allBooks.books.pop());
          change--;
        }
      }
    }
    var newshownBooks = props.allBooks.books.slice(
      0,
      carousel.shownBooks.length
    );
    setCarousel((prevstate) => ({
      shownBooks: newshownBooks,
      currentpos: carousel.currentpos + change,
    }));
  }, [buttonpress]);
  return (
    <div style={{ height: 600 }}>
      <Divider orientation="left">
        <b>{props.allBooks.mode}</b>
        <p style={{ fontSize: 14 }}>
          {" "}
          showing results:{carousel.currentpos + 1}-
          {carousel.currentpos + carousel.shownBooks.length} of{" "}
          {props.allBooks.books.length}
        </p>
      </Divider>
      <Row gutter={8}>
        <Col className="bookCard" span={2}>
          <Arrow
            pos={carousel.currentpos}
            left={true}
            setPress={setButtonpress}
          ></Arrow>
        </Col>
        {carousel.shownBooks.map((inputdetail, index) => {
          return (
            <Col
              className="bookCard"
              span={3}
              onClick={() => {
                history.push({
                  pathname: "/book",
                  state: { name: inputdetail.bid },
                });
              }}
            >
              <BookCard book={carousel.shownBooks[index]} />
            </Col>
          );
        })}

        <Col className="bookCard" span={2}>
          <Arrow
            left={false}
            pos={
              props.allBooks.books.length -
              carousel.currentpos -
              carousel.shownBooks.length
            }
            setPress={setButtonpress}
          ></Arrow>
        </Col>
      </Row>
    </div>
  );
};
