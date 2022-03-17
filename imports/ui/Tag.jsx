import React from 'react';
import './Tag.scss';

export const Tag = ({tag}) => {

  return (
    <div className="tag">
      {/* Add link to search by this */}
      <i className={`fa-solid ${tag.symbol}`} /><span className="">{tag.tagName}</span>
    </div> 
  )
}