import { Meteor } from 'meteor/meteor'
import React, { useEffect, useState } from 'react';
import useFormInput from './hooks/FormInputHook';

import './SignUpLogin.scss';

export const Login = ({}) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const { value: email, bind: bindEmail, reset: resetEmail } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');

  const onSubmit = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(email, password, postLogin);
    resetEmail();
    resetPassword();
  }

  const postLogin = (err) => {
    if (err) {
      // handle error problem
      console.log(err);
    }
    console.log(Meteor.user())
    setShowForm(false);
  }

  return (
    <>
      {
        showForm ? 
        <div className="signup-login-form">
          <span onClick={() => setShowForm(!showForm)}>Close</span>
          <form onSubmit={onSubmit}>
            <input type="text" name="email" placeholder="email" maxLength="40" required {...bindEmail} />
            <input type="password" name="password" placeholder="password" required {...bindPassword} />
            <input type="submit" value="Login" required />
          </form> 
        </div> :
        <span onClick={() => setShowForm(!showForm)}>Login</span>
      }
    </>
  );
} 
