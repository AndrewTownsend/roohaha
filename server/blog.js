import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'simpl-schema';

Meteor.methods({
    tagExists (tag) {
        return Meteor.tags.findOne({tag}) ? true : false;
    },

    'upsertTag': function(tag) {
        console.log("Upserting")
        console.log(tag)
        
        new SimpleSchema({ tag: String} ).validate({ tag })
        Mongo.Collection.update( { tag }, tag, { upsert: true} )
    }
})