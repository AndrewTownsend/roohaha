import React, { useRef } from 'react';
import { useParams } from "react-router-dom";
// import { TinyMceEditor } from '../TinyMceEditor';
// import { Editor } from '@tinymce/tinymce-react';
import Tag from './Tag';
import '../styles/BlogPost.scss';

const users = [
  { _id: 1, name: 'Andrew'},
  { _id: 2, name: 'Omnipotent Bob'},
]

const tags = [
  { _id: 1, tagName: 'Coding', symbol: 'fa-cubes' },
  { _id: 2, tagName: 'Poker', symbol: 'fa-diamond' },
]


export default function BlogPost ({blogPost}) {

  let { id } = useParams();
  // const editorRef = useRef(null);

  const [ blogData, setBlogData ] = React.useState("Write your post!");

  console.log(id)

  const author = users.find((user) => user._id === blogPost?.authorId)?.name || undefined;
  
  const isNew = id === 'new' ? true : false;
  const isEditting = blogPost?.editting || false;
  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }
  const writtenOn = isNew ? new Date().toLocaleDateString("en-US", dateFormat) : blogPost?.createDate.toLocaleDateString("en-US", dateFormat);
  const edittedOn = isEditting ? new Date().toLocaleDateString("en-US", dateFormat) : blogPost?.lastEditDate?.toLocaleDateString("en-US", dateFormat);
  const dates = blogPost?.lastEditDate ? `${writtenOn} (Last editted on: ${edittedOn})` : `${writtenOn}`;
  const tagData = blogPost?.tags.map(tagId => tags.find(tag => tag._id === tagId));

  // const showForm = true;
  const saveBtnText = isNew ? 'Submit' : isEditting ? 'Update' : undefined;
  const showForm = isNew || isEditting;
  const onSubmit = async (e) => {
    e.preventDefault();
    const blogTitle = e.target.title.value;
    const allTags = e.target.tags.value.split(' ');
    // take action
    // console.log(e);
    // console.log(e.target.title.value)
    // console.log(blogData)
    // console.log(e.target.tags.value)

    //divide up tags, normalize; upsert.
    allTags.forEach(tag => {
      console.log(tag)
      Meteor.call('upsertTag', tag, (err, result) => {
        console.log(err)
        console.log(result)
      })
    })
  }

  return (
    <>
      {
        showForm ? 
          (
            <form onSubmit={onSubmit} className="write-post">
              <input type="text" placeholder="Blog Post Title" name="title" required />
              <div>
                {/* <Editor
                  apiKey={Meteor.settings.public.tinyMceApiKey}
                  value={blogData}
                  onEditorChange={(e) => setData(e)}
                /> */}
                <textarea
                  style={{ width: '100%', height: '200px' }}
                  className="rich-text-area"
                  value={blogData}
                  onChange={(e) => setBlogData(e.target.value)}
                  required
                />
              </div>
              <input type="text" placeholder="Tags (space separated)" name="tags" required />
              {
                saveBtnText ? (
                  <input type="submit" value={saveBtnText} />
                ) : null
              }
            </form>
          ) : 
          (
            <div className="post">
              <span className="post-header">
                <h3 className="title">{blogPost?.title}</h3>
                <span className="dates">{dates}</span>
              </span>
              <span className="author">Written by {author}</span>
              <div className="body">{blogPost?.body}</div>
              <div className="tags">
                <ul>
                  { tagData.map(tag => <li key={tag._id}><Tag tag={tag} /></li>) }
                </ul>
              </div>
            </div> 
          )
      }
    </>
  )
}