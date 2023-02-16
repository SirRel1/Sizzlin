import React from 'react'
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Auth from "../../utils/auth";
import { ADD_POST } from "../../utils/mutations";




export default function PostInput({user}) {

    const [status, setStatus] = useState("");
    const [charCount, setCharCount] = useState(0);
    const countClass = charCount > 312 ? "exceeded" : "counting";

    const [addPost, { loading, error }] = useMutation(ADD_POST);

    const [aPost, setAPost] = useState({
      userId: "",
      username: "",
      thePost: "",
    });
     const handleChange = (event) => {
       const { name, value } = event.target;
       setCharCount(event.target.value.length);
       setStatus(event.target.value);
       setAPost({ userId: user, username: user, [name]: value });
     };

     const postHandler = async (e) => {
       try {
         const { data } = await addPost({
           variables: { ...aPost },
         });
         Auth.getToken(data);
       } catch (err) {
         console.error(err);
       }

       setTimeout(() => {
         setStatus("");
       }, 1000);
     };

    

  return (
    <div>
      <input
        id="words"
        className="statusBox"
        name="thePost"
        type="text"
        placeholder={user.toUpperCase() + " " + "whats cookin ? "}
        value={status}
        onChange={handleChange}
      />
      <p className={countClass}>Character count: {charCount}/313</p>
      <button
        className="statusButton"
        onClick={postHandler}
        disabled={charCount > 313 || charCount < 1 || loading}
      >
        Update Status
      </button>
    </div>
  );
}
