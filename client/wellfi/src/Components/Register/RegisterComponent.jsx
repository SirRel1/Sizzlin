import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client'
import Auth from '../../utils/auth';
import { ADD_USER } from '../../utils/mutations';
import "./RegisterStyle.css";
import Axios from "axios";
import Background from "../../Images/Wellfibckground.jpg";
import {
  Alert,
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import axios from "axios";


const Register = () => {
    const [userFormData, setUserFormData] = useState({
      username: "",
      email: "",
      password: "",
    });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [addUser, { error }] = useMutation(ADD_USER);
    const navigate = useNavigate();
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setUserFormData({ ...userFormData, [name]: value });
    };
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      // check if form has everything (as per react-bootstrap docs)
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      try {
        const { data } = await addUser({
            variables: { ...userFormData },
        });
        
        Auth.login(data.addUser.token);
    } catch (err) {
        console.error(err);
    }
        console.log(Auth.addUser);
    setUserFormData({
        username: '',
        email: '',
        password: '',
    });
    };
  
    return (
      <>
        <div className="background row">
          <div className="col-8 row justify-content-start">
            <img src={Background} />
          </div>
  
          <Container className="login col-4 p-4 mt-5 bg-white border-none ">
            <h1 className="tag">Your Path To Well.</h1>
            <h2>
                <ul>Sign Up!</ul>
            </h2>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  type="username"
                  placeholder="Enter A Username"
                  onChange={handleInputChange}
                  value={userFormData.username}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={handleInputChange}
                  value={userFormData.email}
                  required
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
  
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  value={userFormData.password}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                {/* <Form.Check type="checkbox" label="Check me out" /> */}
              </Form.Group>
              <Button
                className="btn"
                type="submit"
                disabled={
                  !userFormData.email ||
                  !userFormData.username ||
                  !userFormData.password
                }
                
                
              >
                Submit
              </Button>
            </Form>
          </Container>
          <div>
          <h2 className="register">Forgot your password? Click <a href="/register">here</a></h2>
        </div>
          
        </div>
      </>
    );
  };
  
  export default Register;