import React from 'react';
import { Tag } from './Tag';
import './BlogPost.scss';

const users = [
  { _id: 1, name: 'Andrew'},
  { _id: 2, name: 'Omnipotent Bob'},
]

const tags = [
  { _id: 1, tagName: 'Coding', symbol: 'fa-cubes' },
  { _id: 2, tagName: 'Poker', symbol: 'fa-diamond' },
]


export const BlogPost = ({blogPost}) => {
  const author = users.find((user) => user._id === blogPost.authorId).name;
  
  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }
  const writtenOn = blogPost.createDate.toLocaleDateString("en-US", dateFormat);
  const edittedOn = blogPost.lastEditDate?.toLocaleDateString("en-US", dateFormat);
  const dates = blogPost.lastEditDate ? `${writtenOn} (Last editted on: ${edittedOn})` : `${writtenOn}`;
  const tagData = blogPost.tags.map(tagId => tags.find(tag => tag._id === tagId));


  return (
    <div className="post">
      <span className="post-header">
        <h3 className="title">{blogPost.title}</h3>
        <span className="dates">{dates}</span>
      </span>
      <span className="author">Written by {author}</span>
      <div className="body">{blogPost.body}</div>
      <div className="tags">
        <ul>
          { tagData.map(tag => <li key={tag._id}><Tag tag={tag} /></li>) }
        </ul>
      </div>
    </div> 
  )
}