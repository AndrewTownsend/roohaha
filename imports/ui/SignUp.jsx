import React, { useRef, useState } from 'react';
import { Accounts } from 'meteor/accounts-base'
import useFormInput from './hooks/FormInputHook';
import useOutsideAlerter from './hooks/OutsideClickAlerter';
import { VALIDATION_RETURN_CODES, MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH } from '../../lib/constants';
import _ from 'lodash';
import './SignUpLogin.scss';

export const SignUp = ({}) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const { value: username, bind: bindUsername, reset: resetUsername } = useFormInput('');
  const { value: email, bind: bindEmail, reset: resetEmail } = useFormInput('');
  const { value: password1, bind: bindPassword1, reset: resetPassword1 } = useFormInput('');
  const { value: password2, bind: bindPassword2, reset: resetPassword2 } = useFormInput('');

  const componentRef = useRef(null);
  useOutsideAlerter(componentRef, setShowForm);

  const validateAll = () => {
    Meteor.call('validateNewUser', username, email, password1, password2, (err, result) => {
      if ( result === VALIDATION_RETURN_CODES.OK ) {
        setError("");
        return true;
      } else { // errors
        switch (result) {
          case VALIDATION_RETURN_CODES.USERNAME_MIN_LENGTH_ERROR:
            setError(`Username must be at least ${MIN_USERNAME_LENGTH} characters long`);
            resetUsername();
            break;
          case VALIDATION_RETURN_CODES.USERNAME_EXISTS:
            setError(`Username ${username} already exists`);
            resetUsername();
            break;
          case VALIDATION_RETURN_CODES.INVALID_EMAIL:
            setError(`Email ${email} is not a valid email address`);
            resetEmail();
            break;
          case VALIDATION_RETURN_CODES.EMAIL_EXISTS:
            setError(`Email already exists in this system`);
            resetEmail();
            break;
          case VALIDATION_RETURN_CODES.PASSWORD_MISMATCH:
            setError(`Passwords do not match!`);
            resetPassword1();
            resetPassword2();
            break;
          case VALIDATION_RETURN_CODES.PASSWORD_MIN_LENGTH_ERROR:
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
            resetPassword1();
            resetPassword2();
            break;
          case VALIDATION_RETURN_CODES.UNKNOWN:
          default:
            setError("An unknown error occured")
            break;
        }
        return false;
      }
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const validated = validateAll();
    if (validated) {
      Accounts.createUser({ username, email, password1 }, () => {
        setShowForm(false);
        console.log(Meteor.userId())
      })
    }
  }

  return (
    <div ref={componentRef}>
      {
        showForm ?  // maybe some sort of animation?
        <div className="signup-login-form">
          <span onClick={() => setShowForm(!showForm)}>Close</span>
          <form onSubmit={onSubmit}>
            <span className={`${error ? 'error' : 'hide'}`}>{error}</span>
            <input type="text" placeholder="Display Name" name="username" maxLength="25" required {...bindUsername} />
            <input type="text" placeholder="Email Address" name="email" maxLength="40" required {...bindEmail} />
            <input type="password" placeholder="Password" name="password1" required {...bindPassword1} />
            <input type="password" placeholder="Repeat password" name="password2" required {...bindPassword2} />
            <input type="submit" value="Sign Up" className={false ? 'submit-valid' : ''} />
          </form> 
        </div> :
        <span onClick={() => setShowForm(!showForm)}>Sign Up</span>
      }
    </div>
  );
} 
