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
  let { clientId } = useParams();
 
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

  const { data } = Auth.getToken() ? Auth.getProfile() : "";
  const user = Auth.getToken() ? data.username : "Guest";
  // const username = data.username;

  
   const { loading, error: postError, data: postData, refetch: postRefetch } = useQuery(USERPOST_QUERY, {
     variables: { username: clientId }
   });

  //  debug querying and resolver to load user post!
   if (loading) return <p>Loading...</p>;
   if (postError) {
     postRefetch();
     return <div>Error: Refreshing...</div>;
   }
 

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
      window.location.reload("/profile")
    }, 4000);
  };

  return (
    <div className="profileSection">
      {clientId === user ? <PostInput user={user} /> : ""}
      <Card style={{ width: "18rem" }}>
        <input
          id="imageInput"
          type="file"
          hidden
          onChange={fileSelectedHandler}
        />
        ...
        <Card.Img
          variant="top"
          src={
            postData.user.profileImg !== "No proifle photo yet"
              ? postData.user.profileImg
              : defaultProfile
          }
          className="rounded-circle"
        />
        <Card.Body>
          <Card.Title>{clientId}</Card.Title>
          <Button
            as="label"
            htmlFor="imageInput"
            variant="outline"
            mb={4}
            cursor="pointer"
            isLoading={uploading}
          >
            Upload
          </Button>
          <Card.Text>
            Some profile information goes here{JSON.stringify(clientId)}
          </Card.Text>
        </Card.Body>
      </Card>

      {!loading &&
        postData.user.posts &&
        postData.user.posts.map((post) => <p>{post.thePost}</p>).reverse()}
    </div>
  );
}
