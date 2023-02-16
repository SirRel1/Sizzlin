import { useState, useEffect } from "react";
import React from "react";
import Auth from "../../utils/auth";
import { useQuery, useMutation } from "@apollo/client";
import { POST_QUERY } from "../../utils/queries";
import { USERPOST_QUERY } from "../../utils/queries";
import { ADD_REPLY } from "../../utils/mutations";
import { ADD_LIKES } from "../../utils/mutations";
import { SUB_LIKES } from "../../utils/mutations";
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
  } = useQuery(USERPOST_QUERY,  { variables: { username: username1 }});

  const [charCount, setCharCount] = useState(0);
  const [isReplyBoxShown, setIsReplyBoxShown] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [emptyHeart1, setEmptyHeart1] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [count, setCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [postLikes, setPostLikes] = useState([]);
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
    followedUser: ""
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
  const [removeLikes, { error: removeLikeError }] = useMutation(SUB_LIKES, {
    refetchQueries: [{ query: POST_QUERY }],
  });

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
    if (addReply.data) {
      refetch();
    }
  }, [addReply.data]);

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
    setTimeout(() => {
      setIsBouncing(isBouncing);
    }, 30);
  };

  const handleChange = (event, key) => {
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
      console.log("Fave clicked: ", clickedFave);
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
      console.log("Fave unclicked: ", clickedFave);
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
// Finish logic for setting new icon once user follows and persist data to mongo
  async function followHandler(user) {
    let thefollowedUser = await userData;
    // let clickedFollow = thefollowedUser;
    setFollow({
      username: username1,
      following: user
    });
    setTimeout(() => {
    console.log("Following...:", thefollowedUser);
    }, 3000)
    // if (!clickedFollow) {
    //   console.log("Fave clicked: ", clickedFollow);
      try {
        const { data } = await addFollow({
          variables: { following: user, username: username1 },
        });

        Auth.getToken(data);

        await refetch();
      } catch (err) {
        console.error(err);
      }
    // } else {
    //   console.log("Fave unclicked: ", clickedFollow);
    //   try {
    //     const { data } = await unFollow({
    //       variables: { following: user, username: username1 },
    //     });

    //     Auth.getToken(data);

    //     await refetch();
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  }

  function convertTimestamp(timestamp) {
    return moment(timestamp * 1).fromNow();
  }

  return (
    <div className="post-container">
      <div className="side-panel">
        <b>Left Side Panel</b>
        <hr />
        {/* Add content for the side panel here */}
      </div>
      <div className="right-side-panel">
        <b>Right Side Panel</b>
        <hr />
        {/* Add content for the side panel here */}
      </div>
      <b>{username1.toUpperCase()}'s Timeline</b>
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
                <img
                  className="follow"
                  src={Auth.getToken() && followIcon}
                  onClick={() => followHandler(post.username)}
                />
              </p>

              <p className="created">{convertTimestamp(post.createdAt)}</p>
              <p className="textBox">{post.thePost}</p>

              {post.replies
                .map((replies) => (
                  <div className="replyArea">
                    <b className="daName">{replies.username}: </b>{" "}
                    {replies.replyText}
                    <span className="dot"></span>
                    <div className="createdAt">
                      {convertTimestamp(replies.createdAt)}
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
                  <span postError className="count">
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
