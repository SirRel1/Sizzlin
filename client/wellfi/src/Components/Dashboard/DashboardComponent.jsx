import Auth from "../../utils/auth";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import {
  Alert,
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { useQueryAgain } from "../../hooks/useQuery2";
import navProfile from "../../Images/profileImg.png";
import timeline from "../../Images/timelineImg.png";
import notificationImg from "../../Images/notificationsImg.png";
import { USERPOST_QUERY } from "../../utils/queries";
import "./Dashboard.css";

export default function DashboardComponent() {
  function logoutHandler() {
    Auth.logout();
    window.location.replace("/");
  }

  const { data } = Auth.getToken() ? Auth.getProfile() : "";
  const user = Auth.getToken() ? data.username : "Guest";
  let dashImg = "";

  if (user !== "Guest") {
    const {
      loading,
      error: postError,
      data: postData,
      refetch,
    } = useQuery(USERPOST_QUERY, {
      variables: { username: user },
    });

    if (loading) return <p>Loading...</p>;
    if (postError) {
      refetch();
      return <div>Error: Refreshing...</div>;
    }

    dashImg = Auth.getToken() ? postData.user.profileImg : "";
  } else {
  }

  return (
    // <Container fluid>

    <Navbar sticky="top" className="navColor" variant="light" expand="lg">
      <Navbar.Brand href="/" className="brand sizzling-text">
        S i Z Z L i N .
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto1">
          <Nav.Link
            href={`/profile/${JSON.stringify(user).replace(/['"]/g, "")}`}
            className="options"
          >
            {Auth.loggedIn() ? (
              <img
                className="dashIcon"
                src={
                  user !== "Guest" && dashImg !== "No proifle photo yet"
                    ? dashImg
                    : navProfile
                }
              />
            ) : (
              ""
            )}
          </Nav.Link>
          {/* Set navigation to Notifications for each user on login */}
          <Nav.Link
            href={`/profile/${JSON.stringify(user).replace(/['"]/g, "")}`}
            className="options"
          >
            {Auth.loggedIn() ? (
              <img className="dashIcon" src={notificationImg} />
            ) : (
              ""
            )}
          </Nav.Link>

          <Nav.Link href="/timeline" className="options">
            <img className="timeIcon" src={timeline} />
          </Nav.Link>
        </Nav>
        {!Auth.loggedIn() ? (
          <Nav.Link href="/login" className="link">
            Login
          </Nav.Link>
        ) : (
          <Button onClick={logoutHandler} className="link">
            Logout:{}
          </Button>
        )}
        <NavDropdown
          className="dropdown"
          title="Dropdown"
          id="basic-nav-dropdown"
          hidden
        >
          {/* <Button onClick={}>Logout</Button> */}
          <NavDropdown.Item href="/profile">Profile Page</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>

    // </Container>
  );
}
