import React from "react";
import { useState } from "react";
import  {useMutationAgain}  from "../../hooks/useMutation2"
import { useMutation, useQuery } from "@apollo/client";
import { CURRENT_USER, QUERY_ME } from "../../utils/queries";
import { Navigate, useParams } from "react-router-dom";
import { Button, Card, Image } from "react-bootstrap";
import useQueryAgain from '../../hooks/useQuery2';
import './Profile.css'
import Auth from "../../utils/auth";

const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const URL = '/images';

export default function ProfileComponent() {
  const [refetch, setRefetch] = useState(0);

  const {
    mutate: uploadImage,
    isLoading: uploading,
    error: uploadError
  } = useMutationAgain({ url: URL});

  const {
    data: imageUrls = [],
    isLoading: imagesLoading,
    error: fetchError,
  } = useQueryAgain(URL, refetch);

  

  const { data } = Auth.getProfile();
  const user = data.username;
  // const { loading, data }  = useQuery(userId ? CURRENT_USER : QUERY_ME, {
  //     variables: { userId: userId }
  // });

  // const profile = data?.user || data?.user || {};

  // if (Auth.loggedIn() && Auth.getProfile().data._id === userId) {
  //     return <div>HomeComponent</div> ;
  //   }
  
  

  // const config = {
  //   bucketName: 'sizzlinimages',
  //   albumName: 'profilePhotos',
  //   region: 'us-east-1',
  //   accessKeyId: 'terrell',
  //   secretAccessKey: 'terrell'
  // }
  

  const fileSelectedHandler = async e => {
    
    // const [ error, setError ] = useState("");
    const file = e.target.files[0];
    console.log(e.target.files[0])
    // ReactS3.uploadFile(e.target.files[0], config)
    if(!validFileTypes.find(type => type === file.type)) {
      // setError("Must be PNG/JPG format")
      return;
    }

    const form = new FormData();
    form.append('image', file)

    await uploadImage(form)
    setTimeout(() => {
      setRefetch(s => s + 1);
    }, 1000);
  }

  return (
    <div>
      Hello {user}
      <Card style={{ width: "18rem" }}>
        <input id="imageInput" type="file" hidden onChange={fileSelectedHandler} />
        <Card.Img
          variant="top"
          src={imageUrls}
          className="rounded-circle"
        />
        <Card.Body>
          <Card.Title>{user}</Card.Title>
          <Button
          as="label"
          htmlFor="imageInput"
          colorScheme= "blue"
          variant= "outline"
          mb={4}
          cursor="pointer">
            Upload
            </Button>
          <Card.Text>Some profile information goes here</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
