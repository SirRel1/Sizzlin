import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import "./LoginStyle.css";
import Axios from "axios";
import Background from "../../Images/SizzlinMain(Chicken).jpeg";
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

const Login = () => {
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
  });
  
  const [validated] = useState(false);
  const [word, setWord] = useState(['Mix', 'Cook', 'Eat']);
  const [showAlert, setShowAlert] = useState(false);
  const [login] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const [text, setText] = useState('Mix');
  let index = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setText(word[index]);
      index = (index + 1) % word.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // const { loginUser, logOutUser} = useAuth()

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {

      const { data } = await login({
        variables: { ...userFormData },
        
        
      });

      // await loginUser(userFormData.email, userFormData.password)
      
      Auth.login(data.login.token);
      
    } catch (err) {
      console.error(err)
      
    }

    
    setUserFormData({
      email: '',
      password: '',
    });


    // check if form has everything (as per react-bootstrap docs)
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }

    // try {
    //   const response = await axios.post(
    //     "http://localhost:3001/users/login",
    //     userFormData
    //   );
    //   console.log(response);
    // } catch (err) {
    //   console.error(err);
    //   setShowAlert(true);
    // }

    // setUserFormData({
    //   email: "",
    //   password: "",
    // });
  };

  return (
    <>
      <div className="background row">
        <div className="col-8 row justify-content-start">
          <img src={Background} />
        </div>
        

        <Container className="login col-4 p-4 mt-5 bg-white border-none ">
          <h1 className="tag">{text === 'Eat' ? text + " It Up!" : text + " It Up."} </h1>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter Email"
                onChange={handleInputChange}
                value={userFormData.email}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Enter Password"
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
                !userFormData.password
              }
            >
              Submit
            </Button>
          </Form>
        </Container>
        <div>
          <h2 className="register">Don't have an account? Register <a href="/register">here</a></h2>
        </div>
      </div>
    </>
  );
};

export default Login;
