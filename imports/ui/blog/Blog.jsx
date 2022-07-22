import React from 'react';
import BlogPost from './BlogPost';
import './Blog.scss';


export default function Blog ({blogPosts}) {

  return (
    <>
      <div className="left-column">
        <h2>About Me</h2>
        <span>
          <p>I’m a full-stack software engineer with knowledge of a variety of languages, but I prefer working with JavaScript-based frameworks and building web applications. Some of the code I’ve worked on has surely touched your life in some minor way, which is pretty cool.</p>
          <p>I’m also a poker enthusiast, a voracious bibliophile, and former hardcore gamer that’s become more casual about it in recent years.</p></span>
      </div>
      <div className="blog">
        <h2 className="">Yet another developer's blog</h2>
        <ul className="">
          {
            blogPosts.map(post => <li key={post._id}><BlogPost blogPost={post} /></li>)
          }
        </ul>
      </div>
    </>
  )
}