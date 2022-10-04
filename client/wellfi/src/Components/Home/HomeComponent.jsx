import React from "react";
import { useQuery } from "@apollo/client";
import { useContext, useParams } from "react-router-dom";
import Auth from "../../utils/auth";
import { QUERY_ME } from "../../utils/queries";
import couplePic from "../../Images/Couple_Cook(Jumbo).jpg";
import foodPic from "../../Images/Chicken_Carrots(Jumbo).webp";
import quotePic from "../../Images/Food_List(Jumbo).jpg";
import './Home.css'
import { Carousel } from "react-bootstrap";

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

  console.log(`This is the the homepage data: `);
  return (
    <div>
      <Carousel className="Background">
        <Carousel.Item>
          <img width={900} height={400} alt="900x500" className="Jumbo"  src={couplePic} />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img width={900} height={400} alt="900x500" className="Jumbo"  src={foodPic} />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img width={900} height={400} alt="900x500" className="Jumbo" src={quotePic} />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      ;
    </div>
  );
}
