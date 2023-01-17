import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import LoginComponent from "./Components/Login/LoginComponent";
import DashboardComponent from "./Components/Dashboard/DashboardComponent";
import HomeComponent from "./Components/Home/HomeComponent";
import RegisterComponent from "./Components/Register/RegisterComponent";
import ProfileComponent from "./Components/ProfileFolder/ProfileComponent";
import New from "./Components/Dashboard/New";
import UserTimeline from "./Components/UserTimeline/UserTimeline";

const link = createHttpLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'same-origin'
});

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
  link
});

function App() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
      <Router>
        <DashboardComponent />
        <Routes>
          <Route exact path="/" element={<HomeComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/new" element={<New />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/profile" element={<ProfileComponent theUser={client} />} />
          <Route path="/timeline" element={<UserTimeline user={client} />} />
        </Routes>
      </Router>
      </ApolloProvider>
    </React.Fragment>
  );
}

export default App;
