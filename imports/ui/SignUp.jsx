import React, { useEffect, useState } from 'react';
import { Accounts } from 'meteor/accounts-base'
import useFormInput from './hooks/FormInputHook';
import _ from 'lodash';
import './SignUpLogin.scss';

export const SignUp = ({}) => {

  const { value: username, bind: bindUsername, reset: resetUsername } = useFormInput('');
  const { value: email, bind: bindEmail, reset: resetEmail } = useFormInput('');
  const { value: password1, bind: bindPassword1, reset: resetPassword1 } = useFormInput('');
  const { value: password2, bind: bindPassword2, reset: resetPassword2 } = useFormInput('');
  
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const MIN_USERNAME_LENGTH = 3;
  const MIN_PASSWORD_LENGTH = 6;

  const VALIDATION_RETURN_CODES = Object.freeze({
    OK: 0,
    PASSWORD_MISMATCH: 1,
    PASSWORD_MIN_LENGTH_ERROR: 2,
    USERNAME_MIN_LENGTH_ERROR: 3,
    USERNAME_EXISTS: 4,
    EMAIL_EXISTS: 5,
    INVALID_EMAIL: 6,
    UNKNOWN: -1
  });

  const validateUsername = () => {
    const longEnough = username.length >= MIN_USERNAME_LENGTH;
    if (!longEnough) {
      return VALIDATION_RETURN_CODES.USERNAME_MIN_LENGTH_ERROR;
    }

    const result = Meteor.call('checkIfUsernameExists', username)
    return result ? VALIDATION_RETURN_CODES.USERNAME_EXISTS : VALIDATION_RETURN_CODES.OK;
  }

  const validateEmail = () => {
    const valid = String(email)
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!valid) {
      return VALIDATION_RETURN_CODES.INVALID_EMAIL;
    }
    
    const result = Meteor.call('checkIfEmailExists', email)
    console.log(result)
    return result ? VALIDATION_RETURN_CODES.EMAIL_EXISTS : VALIDATION_RETURN_CODES.OK;
  }

  const validatePasswords = () => {
    if (password1 === password2 && password2.length >= MIN_PASSWORD_LENGTH) {
      return VALIDATION_RETURN_CODES.OK;
    } else if (password1 !== password2) {
      return VALIDATION_RETURN_CODES.PASSWORD_MISMATCH;
    } else if (password2.length < MIN_PASSWORD_LENGTH) {
      return VALIDATION_RETURN_CODES.PASSWORD_MIN_LENGTH_ERROR;
    } else {
      return VALIDATION_RETURN_CODES.UNKNOWN;
    }
  }

  const validateAll = async () => {
    const usernameOK = validateUsername();
    const emailOK = validateEmail();
    const passwordsOK = validatePasswords();

    console.log(usernameOK)
    console.log(emailOK)
    console.log(passwordsOK)

    if (
      usernameOK === VALIDATION_RETURN_CODES.OK &&
      emailOK === VALIDATION_RETURN_CODES.OK &&
      passwordsOK === VALIDATION_RETURN_CODES.OK
    ) {
      setError("");
      return true;
    } else { // errors
      if (usernameOK !== VALIDATION_RETURN_CODES.OK) {
        if (usernameOK === VALIDATION_RETURN_CODES.USERNAME_MIN_LENGTH_ERROR) {
          setError(`Username must be at least ${MIN_USERNAME_LENGTH} characters long`);
        } else if (usernameOK === VALIDATION_RETURN_CODES.USERNAME_EXISTS) {
          setError(`Username ${username} already exists`);
        }
      } else if (emailOK !== VALIDATION_RETURN_CODES.OK) {
        if (emailOK === VALIDATION_RETURN_CODES.INVALID_EMAIL) {
          setError(`Email ${email} is not a valid email address`);
        } else if (emailOK === VALIDATION_RETURN_CODES.EMAIL_EXISTS) {
          setError(`Email ${email} already exists in this system`);
        }
      } else if (passwordsOK !== VALIDATION_RETURN_CODES.OK) {
        if (passwordsOK === VALIDATION_RETURN_CODES.PASSWORD_MISMATCH) {
          setError(`Passwords do not match!`);
        } else if (passwordsOK === PASSWORD_MIN_LENGTH_ERROR) {
          setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`)
        }
      } else if (
          usernameOK === VALIDATION_RETURN_CODES.UNKNOWN || 
          emailOK === VALIDATION_RETURN_CODES.UNKNOWN ||
          passwordsOK === VALIDATION_RETURN_CODES.UNKNOWN
        ) {
        setError("An unknown error occured")
      }
      console.log(error)
      return false;
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(e)
    
    const validated = await validateAll();
    console.log(validated)
    if (validated) {
      Accounts.createUser({ username, email, password1 }, () => {
        setShowForm(false);
        console.log(Meteor.userId())
      })
    }
  }

  return (
    <>
      {
        showForm ?  // maybe some sort of animation?
        <div className="signup-login-form">
          <span onClick={() => setShowForm(!showForm)}>Close</span>
          <form onSubmit={onSubmit}>
            {/* <input type="text" placeholder="Display Name" name="username" ref={usernameRef} maxLength="25" onChange={() => isSubmitAllowed()} required  /> */}
            <input type="text" placeholder="Display Name" name="username" maxLength="25" required {...bindUsername} />
            <input type="text" placeholder="Email Address" name="email" maxLength="40" required {...bindEmail} />
            <input type="password" placeholder="Password" name="password1" required {...bindPassword1} />
            <input type="password" placeholder="Repeat password" name="password2" required {...bindPassword2} />
            {
              error ? <span className="error">{error}</span> : null
            }
            <input type="submit" value="Sign Up" className={false ? 'submit-valid' : ''} />
          </form> 
        </div> :
        <span onClick={() => setShowForm(!showForm)}>Sign Up</span>
      }
    </>
  );
} 
