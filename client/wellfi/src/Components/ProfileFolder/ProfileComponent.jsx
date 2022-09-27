import React from 'react'
import { useQuery } from '@apollo/client'
import { CURRENT_USER, QUERY_ME } from '../../utils/queries'
import { Navigate, useParams } from 'react-router-dom';
import Auth from '../../utils/auth';

export default function ProfileComponent() {
  
    const { data } = Auth.getProfile()
    const user = data.username;
    // const { loading, data }  = useQuery(userId ? CURRENT_USER : QUERY_ME, {
    //     variables: { userId: userId }
    // });

    // const profile = data?.user || data?.user || {};

    // if (Auth.loggedIn() && Auth.getProfile().data._id === userId) {
    //     return <div>HomeComponent</div> ;
    //   }
    
    console.log(`This is the the homepage data: `)
  return (
    <div>Hello {user}
        
    </div>
  )
}
