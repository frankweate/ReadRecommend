import React, { useState, useEffect, useRef } from "react";
import SearchResult from "./SearchResult";
import { Layout, Slider, Checkbox, Select } from "antd";
import "./FilterPanel.css";
import { FilterOutlined, StarFilled } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
const { Content, Sider } = Layout;

/*Filter panel for searching
  -year range
  -number of stars 
  -category
*/

export const FilterPanel = (props) => {
  const prevID = useRef();
  const location = useLocation();
  const [stars, setStars] = useState({
    starClick: null,
    starState: ["star", "star", "star", "star", "star"],
    starVal: 0,
  });

  const [collection, setCollection] = useState({
    value: false,
  });

  const [years, setYears] = useState({
    earlier_year: 1800,
    later_year: 2020,
    use: false,
  });

  const marks = {
    1800: {
      style: {
        color: "#fff",
        left: "10px",
      },
      label: "<1800",
    },
    2020: {
      style: {
        color: "#fff",
        right: "-50px",
      },
      label: "2020",
    },
  };

  const [categories, setCategories] = useState({
    cat_list: null,
  });
  const currentState = [
    { name: "Non-Fiction", toggled: true },
    { name: "Fantasy", toggled: false },
    { name: "Sci-fi", toggled: false },
    { name: "Outer Space", toggled: false },
    { name: "Futuristic", toggled: false },
    { name: "Action", toggled: false },
    { name: "Adventure", toggled: false },
    { name: "Epic", toggled: false },
    { name: "Adult", toggled: false },
    { name: "Young Adult", toggled: false },
    { name: "Teens", toggled: false },
    { name: "Children's", toggled: false },
    { name: "Fairy Tales", toggled: false },
    { name: "Contemporary", toggled: false },
    { name: "Modern", toggled: false },
    { name: "Romance", toggled: false },
    { name: "Mystery", toggled: false },
    { name: "Detective", toggled: false },
    { name: "Thriller", toggled: false },
    { name: "Drama", toggled: false },
    { name: "Paranormal", toggled: false },
    { name: "Supernatural", toggled: false },
    { name: "Magic", toggled: false },
    { name: "Classic", toggled: false },
    { name: "Historical", toggled: false },
    { name: "War", toggled: false },
    { name: "American", toggled: false },
    { name: "British", toggled: false },
    { name: "Suspense", toggled: false },
    { name: "Horror", toggled: false },
    { name: "Murder", toggled: false },
    { name: "Dark", toggled: false },
    { name: "Psychological", toggled: false },
    { name: "Comedy", toggled: false },
    { name: "Satire", toggled: false },
    { name: "Family", toggled: false },
    { name: "Crime", toggled: false },
    { name: "Biographies", toggled: false },
    { name: "Memoirs", toggled: false },
    { name: "Inspirational", toggled: false },
    { name: "Speculative", toggled: false },
    { name: "Dystopian", toggled: false },
    { name: "Apocalyptic", toggled: false },
    { name: "Philosophy", toggled: false },
    { name: "Religion", toggled: false },
    { name: "Christian", toggled: false },
    { name: "Spirituality", toggled: false },
    { name: "Self Improvement", toggled: false },
    { name: "Health", toggled: false },
    { name: "Politics", toggled: false },
    { name: "Sociology", toggled: false },
    { name: "Animal", toggled: false },
    { name: "Mythology", toggled: false },
    { name: "Graphic Novels", toggled: false },
    { name: "Comics", toggled: false },
    { name: "Manga", toggled: false },
    { name: "Picture Books", toggled: false },
    { name: "Poetry", toggled: false },
    { name: "Business", toggled: false },
    { name: "Education", toggled: false },
    { name: "Leadership", toggled: false },
    { name: "Music", toggled: false },
  ];
  const children = [];
  for (var i of currentState) {
    children.push(<Select key={i.name}>{i.name}</Select>);
  }

  useEffect(() => {
    clearTimeout(prevID.current);

    var ID = setTimeout(() => {
      props.setFilter({
        year_range: years,
        starVal: stars.starVal,
        cat_list: categories.cat_list,
        recentCollection: collection.value,
      });
    }, 200);
    prevID.current = ID;
  }, [years, stars.starVal, categories, collection]);

  useEffect(() => {
    if (location.state != null) {
      if (location.state.category != null) {
        console.log("hi");
        setCategories({
          cat_list: location.state.category,
        });
      }
    }
  }, [location]);
  //Logic for hovering and clicking on
  const starHover = async (val, type) => {
    var newStarState = ["star", "star", "star", "star", "star"];

    if (type !== "click") {
      for (var i = 0; i < newStarState.length; ++i) {
        if (stars.starState[i] === "star_click") newStarState[i] = "star_click";
      }
    } else {
      if (val === stars.starVal) {
        setStars({
          starClick: null,
          starState: ["star", "star", "star", "star", "star"],
          starVal: 0,
        });
        return;
      }
    }
    var starVal = stars.starVal;
    for (let i = 0; i < val; ++i) {
      if (type === "click") {
        newStarState[i] = "star_click";
        starVal = i + 1;
      } else {
        if (stars.starState[i] === "star_click") {
          newStarState[i] = "star_click";
        } else {
          newStarState[i] = "star_hov";
        }
      }
    }
    if (stars.starState !== newStarState) {
      await setStars((prevStars) => ({
        starClick: prevStars.starClick,
        starState: newStarState,
        starVal: starVal,
      }));
    }
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={220}
        style={{
          top: 64,
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <div style={{ textAlign: "center", padding: "10px" }}>
          <FilterOutlined style={{ fontSize: 25, color: "white" }} />
        </div>

        <div style={{ textAlign: "center", padding: "10px" }}>
          <h4 style={{ color: "white" }}>Avg Reader Rating:</h4>

          <StarFilled
            id="star1"
            className={stars.starState[0]}
            onMouseEnter={() => starHover(1, "hover")}
            onClick={() => starHover(1, "click")}
          />
          <StarFilled
            id="star2"
            className={stars.starState[1]}
            onMouseEnter={() => starHover(2, "hover")}
            onClick={() => starHover(2, "click")}
          />
          <StarFilled
            id="star3"
            className={stars.starState[2]}
            onMouseEnter={() => starHover(3, "hover")}
            onClick={() => starHover(3, "click")}
          />
          <StarFilled
            id="star4"
            className={stars.starState[3]}
            onMouseEnter={() => starHover(4, "hover")}
            onClick={() => starHover(4, "click")}
          />
          <StarFilled
            id="star5"
            className={stars.starState[4]}
            onMouseEnter={() => starHover(5, "hover")}
            onClick={() => starHover(5, "click")}
          />
          <p style={{ color: "white" }}>& up</p>
        </div>
        <div style={{ textAlign: "center", padding: "10px" }}>
          <h4 style={{ color: "white" }}>Year Published</h4>
          <Slider
            range
            min={1800}
            max={2020}
            step={5}
            marks={marks}
            value={[years.earlier_year, years.later_year]}
            onChange={async (value) => {
              if (value[0] === 1800 && value[1] === 2020) {
                setYears({
                  earlier_year: value[0],
                  later_year: value[1],
                  use: false,
                });
              }
              if (value[1] >= value[0]) {
                setYears({
                  earlier_year: value[0],
                  later_year: value[1],
                  use: true,
                });
              }
            }}
          />
          <h4 style={{ color: "white" }}>
            <YearText years={years} />
          </h4>
        </div>

        <div style={{ textAlign: "center", padding: "10px 0px 0px 0px" }}>
          <h4 style={{ color: "white" }}>Category</h4>
        </div>
        <div style={{ padding: "0px 0px 10px 10px" }}>
          <Select
            dropdownStyle={{ position: "fixed" }}
            style={{ padding: "10px 0px 0px 0px" }}
            allowClear
            onChange={(value) => {
              setCategories({
                cat_list: value,
              });
            }}
            style={{ width: 200 }}
          >
            {children}
          </Select>
        </div>

        <div style={{ textAlign: "center", padding: "10px 0px 0px 0px" }}>
          <h4 style={{ color: "white" }}>Collections</h4>
        </div>
        <div style={{ textAlign: "center", padding: "10px" }}>
          <Checkbox
            className="cat_div"
            onChange={(e) => {
              let currentState = categories.cat_list;
              setCategories({
                cat_list: currentState,
              });

              setCollection({
                value: e.target.checked,
              });
            }}
          >
            Recently Added to Your Collections
          </Checkbox>
        </div>
      </Sider>

      <Layout className="site-layout">
        <Content>
          <div
            className="site-layout-background"
            style={{ position: "relative", left: 130 }}
          >
            <SearchResult search={props.search} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const YearText = (props) => {
  if (props.years.earlier_year === 1800) {
    return (
      <h4 style={{ color: "white" }}>
        &lt;
        {props.years.earlier_year} - {props.years.later_year}
      </h4>
    );
  } else {
    return (
      <h4 style={{ color: "white" }}>
        {props.years.earlier_year} - {props.years.later_year}
      </h4>
    );
  }
};
