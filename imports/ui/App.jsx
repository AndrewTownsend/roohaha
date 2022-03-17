import React from 'react';
import { Blog } from './Blog.jsx';
import { Header } from './Header.jsx';
import './App.scss';

const blogPosts = [
  {
    _id: 1, authorId: 1, createDate: new Date(), lastEditDate: new Date,
    title: `Andrew's first post!`,
    body: `Body of Andrew's first post!`,
    tags: [1, 2],
  },
  {
    _id: 2, authorId: 1, createDate: new Date(), lastEditDate: undefined,
    title: `Andrew's second post!`,
    body: `Body of Andrew's second post!`,
    tags: [1, 2],
  }
]

console.log(Meteor.user());

export const App = () => (
  <div className="main">
    <Header />
    <img src="/assets/logo.png" id="logo" height="35%" width="35%" />
    <div className="main-content">
      <div className="left-column">
        <h2>About Me</h2>
        <span>
          <p>I’m a full-stack software engineer with knowledge of a variety of languages, but I prefer working with JavaScript-based frameworks and building web applications. Some of the code I’ve worked on has surely touched your life in some minor way, which is pretty cool.</p>
          <p>I’m also a poker enthusiast, a voracious bibliophile, and former hardcore gamer that’s become more casual about it in recent years.</p></span>
      </div>
      <Blog blogPosts={blogPosts} />
    </div>
  </div>
);
