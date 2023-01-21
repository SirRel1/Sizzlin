import React from "react";
import { useState, useEffect } from "react";
import Auth from "../../utils/auth";
import { USERPOST_QUERY } from "../../utils/queries";
import { useMutationAgain } from "../../hooks/useMutation2";
import { useMutation, useQuery } from "@apollo/client";
import { CURRENT_USER, QUERY_ME } from "../../utils/queries";
import { Navigate, useParams } from "react-router-dom";
import { Button, Card, Image, Row, Col } from "react-bootstrap";
import { useQueryAgain } from "../../hooks/useQuery2";
import defaultProfile from "../../Images/DefaultProfile-SiZZLIN.png";
import "./Profile.css";
import PostInput from "./PostInput";


// const [addUser, { error }] = useMutation(ADD_USER);
const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];
const URL = "/images";


export default function ProfileComponent() {
  // const token = sessionStorage.getItem("token");
 
  const [ refetch, setRefetch ] = useState(0);
  
  const {
    mutate: uploadImage,
    isLoading: uploading,
    error: uploadError,
  } = useMutationAgain({ url: URL });

  const {
    data: imageUrls = [],
    isLoading: imagesLoading,
    error: fetchError,
  } = useQueryAgain(URL, refetch);

  const { data } = Auth.getProfile();
  const user = data.username;
  const username = data.username;

  
   const { loading, error: postError, data: postData } = useQuery(USERPOST_QUERY, {
     variables: { username }
   });
  //  debug querying and resolver to load user post!
   if (loading) return <p>Loading...</p>;
   if (postError) return `<p>Error : ${postError}</p>`;
  //  console.log("Post data: ", postData.user.posts[0].thePost);

  // const { loading, data }  = useQuery(userId ? CURRENT_USER : QUERY_ME, {
  //     variables: { userId: userId }
  // });

  // const profile = data?.user || data?.user || {};

  // if (Auth.loggedIn() && Auth.getProfile().data._id === userId) {
  //     return <div>HomeComponent</div> ;
  //   }
  // const updateProfileStatus = () => {
  //   const [status, setStatus] = useState("What's Cookin...");
  // };

 

  

  const fileSelectedHandler = async (e) => {
    // const [ error, setError ] = useState("");
    const file = e.target.files[0];
    console.log(e.target.files[0]);

    if (!validFileTypes.find((type) => type === file.type)) {
      // setError("Must be PNG/JPG format")
      return;
    }

    const form = new FormData();
    form.append("image", file);

    await uploadImage(form);
    setTimeout(() => {
      setRefetch((s) => s + 1);
    }, 1000);
  };

  return (
    <div className="profileSection">
      <PostInput user={user} />
      <Card style={{ width: "18rem" }}>
        <input
          id="imageInput"
          type="file"
          hidden
          onChange={fileSelectedHandler}
        />

        <Card.Img
          variant="top"
          src={
            imageUrls && imageUrls.length
              ? imageUrls.slice(0, 1)[0]
              : defaultProfile
          }
          className="rounded-circle"
        />

        <Card.Body>
          <Card.Title>{user}</Card.Title>
          <Button
            as="label"
            htmlFor="imageInput"
            colorScheme="blue"
            variant="outline"
            mb={4}
            cursor="pointer"
            isLoading={uploading}
          >
            Upload
          </Button>
          <Card.Text>Some profile information goes here</Card.Text>
        </Card.Body>
      </Card>

      {!loading && postData.user.posts &&
        postData.user.posts.map((post) => <p>{post.thePost}</p>)}
    </div>
  );
}
