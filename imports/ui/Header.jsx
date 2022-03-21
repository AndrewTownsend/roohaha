import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Login } from './Login';
import { SignUp } from './SignUp';

export const Header = ({}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(Meteor.userId());

  const logout = () => {
    Meteor.logout(() => {
      setIsLoggedIn(false);
    });
  }

  return (
  <div id="header">
    <span className="header-options">
    {
      isLoggedIn ? 
      <span onClick={() => logout()}>Sign Out</span> :
      <>
        <SignUp />
        <Login setIsLoggedIn={setIsLoggedIn} />
      </>
    }
    </span>
  </div>
);

}