const Schemas = {};

const BlogPost = new Mongo.Collection('BlogPost');
const Tag = new Mongo.Collection('Tag');

BlogPost.schema = new SimpleSchema({
    title: {type: String},
    body: {type: String},
    author: {type: String}, // userid
    edittedBy: {type: String, defaultValue: undefined}, //userid
    tags: {type: Array, defaultValue: []},
    created_date: {type: Date, defaultValue: Date.now()},
    editted_date: {type: Date, defaultValue: undefined}
});

Tag.schema = new SimpleSchema({
tag: {type: String},
});

BlogPost.attachSchema(BlogPost.schema)
Tag.attachSchema(Tag.schema)