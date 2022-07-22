import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Login } from './Login';
import { SignUp } from './SignUp';

export default function Header({}) {
  const [isLoggedIn, setIsLoggedIn] = useState(Meteor.userId());
  
  const userCanPost = () => {
    const roles = Roles.getRolesForUser(Meteor.userId());
    return roles.includes('create')
  }
  
  const logout = () => {
    Meteor.logout(() => {
      setIsLoggedIn(false);
    });
  }

  return (
    <template id="header">
      <span className="header-options">
      {
        userCanPost ?
          (
            <Link to="/blog/new">Write</Link>
          ) : null
      }
      {
        isLoggedIn ? 
        <span onClick={() => logout()}>Sign Out</span> :
        <>
          <SignUp />
          <Login setIsLoggedIn={setIsLoggedIn} />
        </>
      }
      </span>
    </template>
  );
}