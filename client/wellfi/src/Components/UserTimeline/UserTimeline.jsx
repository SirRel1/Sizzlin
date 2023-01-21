import { useState } from "react";
import React from "react";
import Auth from "../../utils/auth";
import { useQuery, useMutation } from "@apollo/client";
import { POST_QUERY } from "../../utils/queries";
import { ADD_REPLY } from "../../utils/mutations";
import { Button, Card, Image, Row, Col } from "react-bootstrap";
import moment from "moment";
import defaultProfile from "../../Images/DefaultProfile-SiZZLIN.png";
import chatBubble from "../../Images/chatBubble.png";
import "./UserTimeline.css";

export default function UserTimeline() {
  const { loading, error, data: postData } = useQuery(POST_QUERY);
  console.log("Post data: ", postData)
  const [charCount, setCharCount] = useState(0);
  const [isReplyBoxShown, setIsReplyBoxShown] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [isBouncing, setIsBouncing] = useState(false);
  const [aReply, setAReply] = useState({
    postId: "",
    userId: "",
    replyText: "",
    username: ""
    
  });

  const { data } = Auth.getToken() ? Auth.getProfile() : "";
  const user = Auth.getToken() ? data.username: "Guest";
  const username = Auth.getToken() ? data.username : "Guest";

  const [addReply, { error: replyError }] = useMutation(ADD_REPLY);

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
    console.log("Key: ", key)
    const { name, value } = event.target;
    setCharCount(event.target.value.length);
    setAReply({ postId: key, userId: user, [name]: value, username: user });
  };

  const replyHandler = async (e) => {
    
    try {
      const { data } = await addReply({
        variables: { ...aReply },
      });
      Auth.getToken(data);
      window.location.reload("/timeline")
    } catch (err) {
      console.error(err);
    }
  };

  function convertTimestamp(timestamp) {
    return moment(timestamp * 1).fromNow();
  }
  // console.log("The post: ", thePost)
  return (
    <div>
      <b>Timeline</b>
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
              {post.replies.map((replies) => (
                <p>{replies.username} Said: {replies.replyText}</p>
              ))}
              {Auth.getToken() && (
                <div
                  className="replyContainer"
                  onClick={() => handleClick(post._id)}
                >
                  <img
                    key={post._id}
                    className={`replyBubble${
                      selectedKey === post._id && isBouncing ? "bouncing" : ""
                    }`}
                    src={chatBubble}
                  />
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
