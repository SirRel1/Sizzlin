import { useState } from "react";
import React from "react";
import { useQuery, useMutation } from "@apollo/client"
import { POST_QUERY } from "../../utils/queries";
import { Button, Card, Image, Row, Col } from "react-bootstrap";
import moment from 'moment';
import defaultProfile from "../../Images/DefaultProfile-SiZZLIN.png";
import './UserTimeline.css'

export default function UserTimeline() {

  const {loading, error, data} = useQuery(POST_QUERY)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : </p>;
  console.log("Error: ", error);
  

  function convertTimestamp(timestamp) {
    return moment(timestamp * 1).fromNow();
  }
  // console.log("The post: ", thePost)
  return (
    <div>
      UserTimeline
      {data.posts &&
        data.posts
          .map((post) => (
            <div key={post.id}>
              <Card.Img className="avatarPic" src={post.profileImg} />

              <p>...{convertTimestamp(post.createdAt)}</p>
              <p>Author: {post.username}</p>
              <p>{post.thePost}</p>
            </div>
          ))
          .reverse()}
    </div>
  );
}
