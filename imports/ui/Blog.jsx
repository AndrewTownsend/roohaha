import React from 'react';
import { BlogPost } from './BlogPost';
import './Blog.scss';


export const Blog = ({blogPosts}) => {

  return (
    <div className="blog">
      <h2 className="">Yet another developer's blog</h2>
      <ul className="">
        {
          blogPosts.map(post => <li key={post._id}><BlogPost blogPost={post} /></li>)
        }
      </ul>
    </div>
  )
}