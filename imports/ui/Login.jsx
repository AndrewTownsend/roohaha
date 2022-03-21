import { Meteor } from 'meteor/meteor'
import React, { useRef, useState } from 'react';
import useFormInput from './hooks/FormInputHook';
import useOutsideAlerter from './hooks/OutsideClickAlerter';

import './SignUpLogin.scss';

export const Login = ({
  setIsLoggedIn
}) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(false);

  const componentRef = useRef(null);
  useOutsideAlerter(componentRef, setShowForm);

  const { value: email, bind: bindEmail, reset: resetEmail } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError(false);
    Meteor.loginWithPassword(email, password, postLogin);
    resetEmail();
    resetPassword();
  }

  const postLogin = (err) => {
    if (err) {
      setError(true);
    } else {
      setShowForm(false);
      setIsLoggedIn(true);
    }
  }

  return (
    <div ref={componentRef}>
      {
        showForm ? 
        <div className="signup-login-form">
          <span onClick={() => setShowForm(!showForm)}>Close</span>
          <form onSubmit={onSubmit}>
            <span className={`${error ? 'error' : 'hide'}`}>Invalid Credentials</span>
            <input type="text" name="email" placeholder="email" maxLength="40" required {...bindEmail} />
            <input type="password" name="password" placeholder="password" required {...bindPassword} />
            <input type="submit" value="Login" required />
          </form> 
        </div> :
        <span onClick={() => setShowForm(!showForm)}>Login</span>
      }
    </div>
  );
} 
