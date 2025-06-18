import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { useDispatch, useSelector } from "react-redux";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import {
  fetchPopularPosts,
  fetchPosts,
  fetchTags,
} from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags, popularPosts } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isPopularPostsLoading = popularPosts.status === "loading";
  const isPostLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [selectedTab, setSelectedTab] = React.useState(0);
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchPopularPosts());
  }, []);

  console.log(posts);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  let itemsToDisplay = [];
  let isLoading = false;

  if (selectedTab === 0) {
    itemsToDisplay = posts.items;
    isLoading = isPostLoading;
  } else {
    itemsToDisplay = popularPosts.items;
    isLoading = isPopularPostsLoading;
  }

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={selectedTab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isLoading ? [...Array(5)] : itemsToDisplay).map((obj, index) =>
            isLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index} // Добавлен key
                _id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          {/* <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          /> */}
        </Grid>
      </Grid>
    </>
  );
};
