import React from "react";
import { useQuery } from "@apollo/client";
import { useContext, useParams } from "react-router-dom";
import Auth from "../../utils/auth";
import { QUERY_ME } from "../../utils/queries";
import couplePic from "../../Images/Couple_Cook(Jumbo).jpg";
import foodPic from "../../Images/Chicken_Carrots(Jumbo).webp";
import quotePic from "../../Images/Food_List(Jumbo).jpg";
import articleOne from "../../Images/Couple_RecipeBook(Jumbo).webp";
import articleTwo from "../../Images/Old_Couple(Jumbo).jpg";
import articleThree from "../../Images/Health_Quote(Jumbo).webp";
import "./Home.css";
import { Carousel, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function HomeComponent() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      {/* <Container fluid> */}
      <Carousel className="Background">
        <Carousel.Item>
          <img
            width={900}
            height={400}
            alt="900x500"
            className="Jumbo"
            src={couplePic}
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            width={900}
            height={400}
            alt="900x500"
            className="Jumbo"
            src={foodPic}
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            width={900}
            height={400}
            alt="900x500"
            className="Jumbo"
            src={quotePic}
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <h2 className="Articles"> Articles </h2>
      <div className="CardsContainer">
        <Card className="Cards" style={{ width: "18rem" }}>
          <Card.Img variant="top" src={articleOne} />
          <Card.Body>
            <Card.Title>
              "Nourishing Our Bodies and Our Relationship"
            </Card.Title>
            <Card.Text>
              <div className={`truncated-text ${isExpanded ? "expanded" : ""}`}>
                Eating a nutritious diet is important not only for our physical
                health, but also for the health of our relationships. In this
                article, we explore the link between nourishing our bodies and
                strengthening our connections with others, and offer tips for
                incorporating healthy habits into our daily lives.
              </div>
              <Button
                variant="link"
                className="read-more"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read less" : "Read more"}
              </Button>
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
       
        <Card className="Cards" style={{ width: "18rem" }}>
          <Card.Img variant="top" src={articleThree} />
          <Card.Body>
            <Card.Title>"Your Health: Your Most Important Asset"</Card.Title>
            <Card.Text>
              Taking care of your health should be a top priority, as it is your
              most valuable asset. In this article, we discuss the importance of
              investing in your health, both physically and mentally, and offer
              tips for maintaining a healthy lifestyle.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
        <Card className="Cards" style={{ width: "18rem" }}>
          <Card.Img variant="top" src={articleTwo} />
          <Card.Body>
            <Card.Title>"Cooking for a Healthy Life Together"</Card.Title>
            <Card.Text>
            Explore the benefits of cooking and eating together as a family.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
       
      </div>
      {/* </Container> */}
    </div>
  );
}
