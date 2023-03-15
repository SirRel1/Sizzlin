import { useState, useEffect } from "react";
import React from "react";
import Auth from "../../utils/auth";
import { useQuery, useMutation } from "@apollo/client";
import { POST_QUERY } from "../../utils/queries";
import { USERPOST_QUERY } from "../../utils/queries";
import { ADD_REPLY } from "../../utils/mutations";
import { ADD_LIKES } from "../../utils/mutations";
import { ADD_COMMENT_LIKES } from "../../utils/mutations";
import { SUB_LIKES } from "../../utils/mutations";
import { REMOVE_COMMENT_LIKES } from "../../utils/mutations";
import { ADD_FAVE } from "../../utils/mutations";
import { ADD_FOLLOW } from "../../utils/mutations";
import { REMOVE_FOLLOW } from "../../utils/mutations";
import { REMOVE_FAVE } from "../../utils/mutations";
import { Button, Card, Image, Row, Col } from "react-bootstrap";
import moment from "moment";
import defaultProfile from "../../Images/DefaultProfile-SiZZLIN.png";
import chatBubble from "../../Images/chatBubble.png";
import emptyHeart from "../../Images/emptyHeart.png";
import filledHeart from "../../Images/filledHeart.png";
import faveIcon from "../../Images/faveIcon.png";
import filledFave from "../../Images/filledFave.png";
import followIcon from "../../Images/followIcon.png";
import followingIcon from "../../Images/followingIcon.png";
import likeThumb from "../../Images/likeThumbnail.png";
import RightSidePanel from "./RightSidePanel"
import PostInput from "../ProfileFolder/PostInput"
import "./UserTimeline.css";
import { Link } from "react-router-dom";

export default function UserTimeline({ client }) {
  const {
    loading,
    error,
    data: postData,
    refetch,
  } = useQuery(POST_QUERY, { client });

  const { data } = Auth.getToken() ? Auth.getProfile() : "";
  const user = Auth.getToken() ? data.username : "Guest";
  const username1 = Auth.getToken() ? data.username : "Guest";

  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery(USERPOST_QUERY, { variables: { username: username1 } });

  const [charCount, setCharCount] = useState(0);
  const [isReplyBoxShown, setIsReplyBoxShown] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [emptyHeart1, setEmptyHeart1] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [count, setCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [postLikes, setPostLikes] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [thumbsUp, setThumbsUp] = useState(false);
  const [liked, setLiked] = useState({
    post: "",
    username: "",
  });
  const [fave, setFave] = useState({
    post: "",
    username: "",
  });
  const [follow, setFollow] = useState({
    username: "",
    followedUser: "",
    profilePic: "",
  });
  const [aReply, setAReply] = useState({
    post: "",
    postId: "",
    userId: "",
    replyText: "",
    username: "",
    replyImg: "",
  });
  // This effect runs everytime that postData has a new payload for rerender

  const [addReply, { error: replyError }] = useMutation(ADD_REPLY);
  const [addLikes, { error: likeError }] = useMutation(ADD_LIKES, {
    refetchQueries: [{ query: POST_QUERY }],
  });

  const [addCommentLikes, { error: commentlikeError }] = useMutation(
    ADD_COMMENT_LIKES,
    {
      refetchQueries: [{ query: POST_QUERY }],
    }
  );

  const [removeLikes, { error: removeLikeError }] = useMutation(SUB_LIKES, {
    refetchQueries: [{ query: POST_QUERY }],
  });

  const [removeCommentLikes, { error: removeCommentLikeError }] = useMutation(
    REMOVE_COMMENT_LIKES,
    {
      refetchQueries: [{ query: POST_QUERY }],
    }
  );

  const [addFollow, { error: followError }] = useMutation(ADD_FOLLOW, {
    refetchQueries: [{ query: POST_QUERY }],
  });

  const [unFollow, { error: unfollowError }] = useMutation(REMOVE_FOLLOW, {
    refetchQueries: [{ query: POST_QUERY }],
  });

  const [addFaves, { error: faveError }] = useMutation(ADD_FAVE, {
    refetchQueries: [{ query: POST_QUERY }],
  });

  const [removeFaves, { error: removeFaveError }] = useMutation(REMOVE_FAVE, {
    refetchQueries: [{ query: POST_QUERY }],
  });

  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime >= 5 && currentTime < 12) {
      setGreeting("Good morning");
    } else if (currentTime >= 12 && currentTime < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    if (addReply.data) {
      refetch();
    }
  }, [addReply.data]);

  useEffect(() => {
    if (addFaves.data) {
      userRefetch();
    }
  }, [addFaves.data]);

  useEffect(() => {
    if (postLikes) {
      setTimeout(() => {
        refetch();
      }, 1000);
    }
  }, [count]);

  useEffect(() => {
    if (postData) {
      setPostLikes(postData.posts.map((post) => post.postLikes));
    }
  }, [postData]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    refetch();
    return <div>Error: Refreshing...</div>;
  }

  const handleClick = (key, to) => {
    let token = Auth.getToken();
    if (!token) {
      alert("Must Login to like or reply to a post");
      return;
    }
    const recipient = to;
    replyHandler(recipient);
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
    setTimeout(() => {
      setIsBouncing(isBouncing);
    }, 30);
  };
  const vulgarWords = new Set([
    "ass",
    "shit",
    "bitch",
    "hoe",
    "fuck",
    "dick",
    "pussy",
    "motherfucker",
    "damn",
    "cum",
    "balls",
    "nigger",
    "asshole",
  ]);
  const handleChange = (event, key) => {
    const { name, value } = event.target;
    const words = value.toLowerCase().split(" ");
    let cleaned;
    for (let i = 0; i < words.length; i++) {
      if (vulgarWords.has(words[i])) {
        // Do something if a vulgar word is found

        console.log("Error: The input contains a vulgar word!");
        break;
      }

      const wordString = words.join(" ");

      vulgarWords.forEach((word) => {
        wordString = wordString.replace(word, "****");
        cleaned = wordString;
      });
    }

    setCharCount(event.target.value.length);
    setAReply({
      post: key,
      postId: key,
      userId: user,
      [name]: cleaned,
      username: user,
      replyImg: user,
    });
  };

  const replyHandler = async () => {
    try {
      const { data } = await addReply({
        variables: { ...aReply },
      });

      setAReply({
        post: "",
        postId: "",
        userId: "",
        replyText: "",
        username: "",
        replyImg: "",
      });
      setIsReplyBoxShown(false);

      Auth.getToken(data);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  async function faveHandler(id) {
    let thefavedPost = postData.posts.filter((post) => post._id === id);
    let clickedFave = thefavedPost[0].favedBy.includes(username1);
    setFave({
      post: id,
      username: user,
    });
    if (!clickedFave) {
      try {
        const { data } = await addFaves({
          variables: { post: id, username: username1 },
        });

        Auth.getToken(data);

        await refetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const { data } = await removeFaves({
          variables: { post: id, username: username1 },
        });

        Auth.getToken(data);

        await refetch();
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function heartHandler(id) {
    let theLikedPost = postData.posts.filter((post) => post._id === id);
    let clickedLike = theLikedPost[0].likedBy.includes(username1);
    setLiked({
      post: id,
      username: user,
    });

    setSelectedKey(id);
    setEmptyHeart1((prevState) => !prevState);
    setCount((prevCount) => (prevCount === 0 ? prevCount + 1 : prevCount - 1));

    if (!clickedLike) {
      try {
        const { data } = await addLikes({
          variables: { post: id, username: username1 },
        });

        Auth.getToken(data);
        // setPostLikes(postLikes + 1);
        await refetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const { data } = await removeLikes({
          variables: { post: id, username: username1 },
        });

        Auth.getToken(data);
        setPostLikes(postLikes - 1);
        await refetch();
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function replyLikeHandler(id, e) {
    let theLikedComment = e.target.id;
    let token = Auth.getToken();
    if (!token) {
      alert("Must Login to like or reply to a post");
      return;
    }
    let theCommentLiked = false;
    for (let i = 0; i < postData.posts.length; i++) {
      let allPost = postData.posts[i];
      let postReplies = allPost.replies.filter((replies, i) =>
        replies._id.includes(id)
      );

      if (postReplies.length > 0 && postReplies) {
        theCommentLiked = postReplies[0].replyLikedBy.includes(username1);
        break;
      } else {
        theCommentLiked = false;
      }
    }

    if (!theCommentLiked) {
      try {
        const { data } = await addCommentLikes({
          variables: { reply: id, username: username1 },
        });

        Auth.getToken(data);
        // setPostLikes(postLikes + 1);
        await refetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const { data } = await removeCommentLikes({
          variables: { reply: id, username: username1 },
        });

        Auth.getToken(data);
        await refetch();
      } catch (err) {
        console.error(err);
      }
    }
  }
  // Finish logic for setting new icon once user follows and persist data to mongo
  async function followHandler(user, userPic) {
    let thefollowedUser = await userData;
    let clickedFollow = thefollowedUser.user.following.includes(user);

    setFollow({
      username: username1,
      following: user,
      profilePic: userPic,
    });

    if (!clickedFollow) {
      try {
        const { data } = await addFollow({
          variables: { following: user, username: username1 },
        });

        Auth.getToken(data);

        await userRefetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const { data } = await unFollow({
          variables: { following: user, username: username1 },
        });

        Auth.getToken(data);

        await userRefetch();
      } catch (err) {
        console.error(err);
      }
    }
  }

  function showReplyHandler(id, e) {
    const { lastChild } = e.target;
    if (lastChild === null) return;

    if (lastChild.id === id) {
      const { childNodes } = e.target;
      childNodes[7].classList.toggle("hidden");
      childNodes[8].classList.toggle("hidden");
    }
  }

  function convertTimestamp(timestamp) {
    return moment(timestamp * 1).fromNow();
  }

  return (
    <div className="post-container">
      {Auth.getToken() && <PostInput user={username1} />}
      <hr />
      <div className="side-panel">
        {Auth.getToken() && <b className="panelTitle">{user}'s Crew...</b>}
        {Auth.getToken() && (
          <img className="avatarPic" src={userData.user.profileImg} alt="" />
        )}
        <hr />

        <b>
          <span className="followTag">Following</span>(
          {Auth.getToken()
            ? userData.user.following.length
            : "Login to access..."}
          ):
        </b>
        <h2 className="panelText">
          {Auth.getToken() &&
            userData.user.following.map((person) => {
              // Find the post corresponding to the person's username
              const post = postData.posts.find(
                (post) => post.username === person
              );

              // If a post was found, return the profileImg along with the person's name
              if (post) {
                return (
                  <p>
                    <Link
                      to={"/profile/" + post.username}
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        className="followPics"
                        src={
                          post.profileImg === "No proifle photo yet"
                            ? defaultProfile
                            : post.profileImg
                        }
                        alt="Profile"
                      />
                      {person}
                    </Link>
                  </p>
                );
              }

              // If no post was found, return just the person's name
              return (
                <p>
                  <img
                    className="followPics"
                    src={defaultProfile}
                    alt="Default Profile"
                  />
                  {person}
                </p>
              );
            })}
        </h2>
        <b>
          <span className="followTag">Followers</span>(
          {Auth.getToken()
            ? userData.user.followers.length
            : "Login to access..."}
          ):
        </b>
        <h2 className="panelText">
          {Auth.getToken() &&
            userData.user.followers.map((person) => {
              // Find the post corresponding to the follower's username
              const post = postData.posts.find(
                (post) => post.username === person
              );

              // If a post was found, return the profileImg along with the follower's name
              if (post) {
                return (
                  <p>
                    <Link
                      to={"/profile/" + post.username}
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        className="followPics"
                        src={
                          post.profileImg === "No proifle photo yet"
                            ? defaultProfile
                            : post.profileImg
                        }
                        alt="Profile"
                      />
                      {person}
                    </Link>
                  </p>
                );
              }

              // If no post was found, return just the follower's name
              return (
                <p>
                  <img
                    className="followPics"
                    src={defaultProfile}
                    alt="Default Profile"
                  />
                  {person}
                </p>
              );
            })}
        </h2>
      </div>
      <RightSidePanel />
      
      <b className="greeting">
        {greeting}, {username1.toUpperCase()}!
      </b>
      {postData.posts &&
        postData.posts
          .map((post, index) => (
            <div className="postBox" key={post._id}>
              <Link
                to={"/profile/" + post.username}
                style={{ textDecoration: "none" }}
              >
                <Card.Img
                  className="avatarPic"
                  src={
                    post.profileImg !== "No proifle photo yet"
                      ? post.profileImg
                      : defaultProfile
                  }
                  alt={"Image of " + post.username}
                />
              </Link>
              <p className="author">
                <b>{post.username}</b>
                {Auth.getToken() && (
                  <img
                    className="follow"
                    src={
                      followIcon &&
                      !userData.user.following.includes(post.username)
                        ? followIcon
                        : followingIcon
                    }
                    onClick={() =>
                      followHandler(post.username, post.profileImg)
                    }
                  />
                )}
              </p>

              <p className="created">{convertTimestamp(post.createdAt)}</p>
              <p className="textBox">{post.thePost}</p>

              {post.replies
                .map((replies) => (
                  <div
                    className="replyArea"
                    onClick={(e) => showReplyHandler(replies._id, e)}
                  >
                    <b className="daName">{replies.username}: </b>{" "}
                    {replies.replyText}
                    <span className="dot"></span>
                    <div className="createdAt">
                      {convertTimestamp(replies.createdAt)}
                    </div>
                    <div
                      id={replies._id}
                      className={replies.replyLikes ? "thumbsUp" : "hidden"}
                      data-likes={
                        replies.replyLikedBy.includes(username1)
                          ? replies.replyLikedBy.length > 1
                            ? "Liked by YOU & " +
                              replies.replyLikedBy
                                .filter((name) => name !== username1)
                                .join(", ")
                            : "Liked by YOU"
                          : "Liked by: " + replies.replyLikedBy.join(", ")
                      }
                    >
                      <img
                        id={replies._id}
                        className="thumbsUp"
                        src={likeThumb}
                      />
                    </div>
                    <div className="replyAvatar">
                      <Link
                        to={"/profile/" + replies.username}
                        style={{ textDecoration: "none" }}
                      >
                        <img
                          className="replyImg"
                          src={
                            replies.replyImg &&
                            replies.replyImg !== "No proifle photo yet"
                              ? replies.replyImg
                              : defaultProfile
                          }
                          alt={"Image of " + replies.username}
                        />
                      </Link>
                    </div>
                    <button
                      id={replies._id}
                      className="hidden like-btn"
                      onClick={(e) => replyLikeHandler(replies._id, e)}
                    >
                      {replies.replyLikedBy.includes(username1)
                        ? "Liked!"
                        : "Like"}
                    </button>
                    <button
                      id={replies._id}
                      key={replies.username}
                      className="hidden reply-btn"
                      onClick={(e) => handleClick(post._id, replies.username)}
                    >
                      Reply
                    </button>
                  </div>
                ))
                .reverse()}

              {Auth.getToken() && (
                <div className="replyContainer">
                  <hr className="divider" />
                  <img
                    key={post._id}
                    onClick={() => handleClick(post._id)}
                    className={`replyBubble${
                      selectedKey === post._id && isBouncing ? "bouncing" : ""
                    }`}
                    src={chatBubble}
                    alt="Reply Button"
                  />
                  <img
                    key={`${post._id}Likes`}
                    className={
                      post.postLikes > 0 && post.likedBy.includes(username1)
                        ? "filledHeart"
                        : "emptyHeart"
                    }
                    src={
                      post.postLikes > 0 && post.likedBy.includes(username1)
                        ? filledHeart
                        : emptyHeart
                    }
                    alt="Like Button"
                    onClick={() => heartHandler(post._id)}
                  />{" "}
                  <span postError className="count" post-likes={post.likedBy}>
                    <p>{postLikes[index] > 0 ? postLikes[index] : ""}</p>
                  </span>
                  <img
                    key={`${post._id}Faves`}
                    className={
                      post.favedBy.includes(username1)
                        ? "filledFave"
                        : "faveIcon"
                    }
                    src={
                      post.favedBy.includes(username1) ? filledFave : faveIcon
                    }
                    alt="Fave Button"
                    onClick={() => faveHandler(post._id)}
                  />
                  <span className="faveCount">
                    {post.favedBy.length === 0 ? "" : post.favedBy.length}
                  </span>
                  {selectedPostId === post._id && isReplyBoxShown && (
                    <>
                      <textarea
                        key={post._id}
                        name="replyText"
                        onChange={(event) => handleChange(event, post._id)}
                        className={isReplyBoxShown ? "show" : "hide"}
                        placeholder="Reply here..."
                        cols={4}
                        autoFocus={isReplyBoxShown}
                      ></textarea>
                      <button
                        className="send-button"
                        onClick={() => replyHandler()}
                      ></button>
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
