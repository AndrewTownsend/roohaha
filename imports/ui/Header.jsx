import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Login } from './Login';
import { SignUp } from './SignUp';

export const Header = ({}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!Meteor.user();

  return (
  <div id="header">
    {
      isLoggedIn ? 
      <span>Sign Out</span> :
      <span className="header-options">
        <SignUp setMenuOpen={setMenuOpen} />
        <Login setMenuOpen={setMenuOpen} />
      </span>
    
    }
  </div>
);

}