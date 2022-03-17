import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles';
import crypto from 'crypto';

// import { LinksCollection } from '/imports/api/links';

// function insertLink({ title, url }) {
//   LinksCollection.insert({title, url, createdAt: new Date()});
// }

Meteor.methods({
  checkIfUsernameExists (username) {
    return (Meteor.users.findOne( {username })) ? true : false;
  },
  checkIfEmailExists (email) {
    return (Meteor.users.findOne( {"emails.address" : email })) ? true : false;
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
