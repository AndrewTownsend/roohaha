import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles';
import { VALIDATION_RETURN_CODES, MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH } from '../lib/constants';



Meteor.methods({
  validateNewUser (username, email, password1, password2) {
    // Username validation
    const longEnough = username.length >= MIN_USERNAME_LENGTH;
    if (!longEnough) {
      return VALIDATION_RETURN_CODES.USERNAME_MIN_LENGTH_ERROR;
    }

    Meteor.call('checkIfUsernameExists', username, (err, result) => {
      console.log(result);
      if (result) {
        return VALIDATION_RETURN_CODES.USERNAME_EXISTS;
      } else {
        // Email validation
        const valid = String(email)
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (!valid) {
          return VALIDATION_RETURN_CODES.INVALID_EMAIL;
        }
        
        Meteor.call('checkIfEmailExists', email, (err, result) => {
          console.log(result)
          if (result) {
            return VALIDATION_RETURN_CODES.EMAIL_EXISTS;
          } else {
            // Password validation
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
        });
      }
    })
  },

  checkIfUsernameExists (username) {
    return (Meteor.users.findOne( {username })) ? true : false;
  },
  checkIfEmailExists (email) {
    console.log(Meteor.users.find( {"emails.address" : email }).count() > 0)
    return Meteor.users.find( {"emails.address" : email }).count() > 0 ? true : false;
  },
  makeAdmin (userId) {
    return Meteor.users.update()
  }
});

Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready()
  }
})

Meteor.startup(() => {
  // eventually switch to enrollment - you don't set a password
  // https://guide.meteor.com/accounts.html#accounts-password 
  if (!Meteor.users.findOne()) {
    const userId = Accounts.createUser({
      email: Meteor.settings.private.initEmail,
      username: Meteor.settings.private.initUsername,
      // password: crypto.randomBytes(20).toString('hex'),
      password: Meteor.settings.private.initPassword
    });

    Roles.createRole('webmaster');
    Roles.createRole('commentor');

    Roles.addUsersToRoles(userId, ['webmaster']);
    
     
  
    // Accounts.sendEnrollmentEmail(userId);
    // console.log("sent email, supposedly")
  }
  // If the Links collection is empty, add some data.
  // if (LinksCollection.find().count() === 0) {
  //   insertLink({
  //     title: 'Do the Tutorial',
  //     url: 'https://www.meteor.com/tutorials/react/creating-an-app'
  //   });

  //   insertLink({
  //     title: 'Follow the Guide',
  //     url: 'http://guide.meteor.com'
  //   });

  //   insertLink({
  //     title: 'Read the Docs',
  //     url: 'https://docs.meteor.com'
  //   });

  //   insertLink({
  //     title: 'Discussions',
  //     url: 'https://forums.meteor.com'
  //   });
  // }
});
