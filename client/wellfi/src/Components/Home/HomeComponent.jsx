import React from "react";
import { useQuery } from "@apollo/client";
import { useContext, useParams } from "react-router-dom";
import Auth from "../../utils/auth";
import { QUERY_ME } from "../../utils/queries";

export default function HomeComponent() {
  
  // const { data } = Auth.getProfile()
  //   const user = data.username;
    // const { loading, data }  = useQuery(userId ? CURRENT_USER : QUERY_ME, {
    //     variables: { userId: userId }
    // });

    // const profile = data?.user || data?.user || {};

    // if (Auth.loggedIn() && Auth.getProfile().data._id === userId) {
    //     return <div>HomeComponent</div> ;
    //   }
    
    console.log(`This is the the homepage data: `)
  return (
    <div>
      This is the Home area
        
    </div>
  )
}
