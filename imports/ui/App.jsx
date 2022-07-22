import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Header from './Header';
import NotFound from './NotFound';
import Blog from './blog/Blog';
import BlogPost from './blog/BlogPost';
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

export const App = () => (
  <BrowserRouter>
    <div className="main">
      <Header />
      {/* <img src="/assets/logo.png" id="logo" height="35%" width="35%" /> */}
      <img src="/assets/logo.png" id="logo" />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Blog blogPosts={blogPosts} />} />
          <Route path="/blog/:id" element={<BlogPost />} />  
          <Route path="*" element={<NotFound />} />  
        </Routes>
      </div>
    </div>
  </BrowserRouter>
);
