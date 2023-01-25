import { useState, useEffect } from "react";
import React from "react";
import Auth from "../../utils/auth";
import { useQuery, useMutation } from "@apollo/client";
import { POST_QUERY } from "../../utils/queries";
import { ADD_REPLY } from "../../utils/mutations";
import { ADD_LIKES } from "../../utils/mutations";
import { Button, Card, Image, Row, Col } from "react-bootstrap";
import moment from "moment";
import defaultProfile from "../../Images/DefaultProfile-SiZZLIN.png";
import chatBubble from "../../Images/chatBubble.png";
import emptyHeart from "../../Images/emptyHeart.png";
import filledHeart from "../../Images/filledHeart.png";
import "./UserTimeline.css";

export default function UserTimeline() {
  const { loading, error, data: postData } = useQuery(POST_QUERY);
  const [charCount, setCharCount] = useState(0);
  const [isReplyBoxShown, setIsReplyBoxShown] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [emptyHeart1, setEmptyHeart1] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [count, setCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [liked, setLiked] = useState({
    post: "",
    username: "",
  });
  const [aReply, setAReply] = useState({
    post: "",
    postId: "",
    userId: "",
    replyText: "",
    username: "",
    replyImg: "",
  });

  const { data } = Auth.getToken() ? Auth.getProfile() : "";
  const user = Auth.getToken() ? data.username : "Guest";
  const username = Auth.getToken() ? data.username : "Guest";

  const [addReply, { error: replyError }] = useMutation(ADD_REPLY);
  const [addLikes, { error: likeError }] = useMutation(ADD_LIKES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : </p>;
  // console.log("Auth: ", Auth.loggedIn);

  const handleClick = (key) => {
    if (key === selectedPostId) {
      setSelectedPostId(null);
      setIsReplyBoxShown(false);
    } else {
      setSelectedPostId(key);
      setIsReplyBoxShown(true);
    }
    setSelectedKey(key);
    setTimeout(() => {
      setSelectedKey(null);
    }, 123000);
    setIsReplyBoxShown(!isReplyBoxShown);
    setIsBouncing(!isBouncing);
    setTimeout(() => {
      setIsBouncing(isBouncing);
    }, 30);
  };

  const handleChange = (event, key) => {
    console.log("Key: ", key);
    const { name, value } = event.target;
    setCharCount(event.target.value.length);
    setAReply({
      post: key,
      postId: key,
      userId: user,
      [name]: value,
      username: user,
      replyImg: user,
    });
  };

  const replyHandler = async (e) => {
    try {
      const { data } = await addReply({
        variables: { ...aReply },
      });
      Auth.getToken(data);
      window.location.reload("/timeline");
    } catch (err) {
      console.error(err);
    }
  };

  async function heartHandler(id) {
    setLiked({
      post: id,
      username: user,
    });
    setSelectedKey(id);
    setEmptyHeart1((prevState) => !prevState);
    setCount((prevCount) => (prevCount === 0 ? prevCount + 1 : prevCount - 1));

    try {
      const { data } = await addLikes({
        variables: { post: id, username: user },
      });

      Auth.getToken(data);
      window.location.reload("/timeline");
    } catch (err) {
      console.error(err);
    }
  }

  function convertTimestamp(timestamp) {
    return moment(timestamp * 1).fromNow();
  }
  // console.log("The post: ", thePost)
  return (
    <div className="post-container">
      <b>{username.toUpperCase()}'s Timeline</b>
      {postData.posts &&
        postData.posts
          .map((post) => (
            <div className="postBox" key={post._id}>
              <Card.Img
                className="avatarPic"
                src={
                  post.profileImg !== "No proifle photo yet"
                    ? post.profileImg
                    : defaultProfile
                }
              />
              <p className="author">
                <b>{post.username}</b>
              </p>

              <p className="created">{convertTimestamp(post.createdAt)}</p>
              <p className="textBox">{post.thePost}</p>
              <hr className="divider" />
              {post.replies.map((replies) => (
                <div className="replyArea">
                  <b className="daName">{replies.username}: </b>{" "}
                  {replies.replyText}
                  <span class="dot"></span>
                  <div className="createdAt">
                    {convertTimestamp(replies.createdAt)}
                  </div>
                  <div className="replyAvatar">
                    <img
                      className="replyImg"
                      src={
                        replies.replyImg &&
                        replies.replyImg !== "No proifle photo yet"
                          ? replies.replyImg
                          : defaultProfile
                      }
                    />
                  </div>
                </div>
              ))}
              {Auth.getToken() && (
                <div className="replyContainer">
                  <img
                    key={post._id}
                    onClick={() => handleClick(post._id)}
                    className={`replyBubble${
                      selectedKey === post._id && isBouncing ? "bouncing" : ""
                    }`}
                    src={chatBubble}
                  />
                  <img
                    key={`${post._id}Likes`}
                    className="emptyHeart"
                    src={
                      post.postLikes > 0 && post.likedBy.includes(username)
                        ? filledHeart
                        : emptyHeart
                    }
                    onClick={() => heartHandler(post._id)}
                  />{" "}
                  <span id={post._id} className="count">
                    <p>{post.postLikes > 0 ? post.postLikes : ""}</p>
                    {/* {selectedKey === post._id ? count : " "} */}
                  </span>
                  {selectedPostId === post._id && isReplyBoxShown && (
                    <>
                      <textarea
                        key={post._id}
                        name="replyText"
                        onChange={(event) => handleChange(event, post._id)}
                        className={isReplyBoxShown ? "show" : "hide"}
                        cols={4}
                        autoFocus={isReplyBoxShown}
                      ></textarea>
                      <button
                        className="send-button"
                        onClick={() => replyHandler()}
                      >
                        Send
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
          .reverse()}
    </div>
  );
}
