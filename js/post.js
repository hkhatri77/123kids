/**
timestamp: current date when published
title: input value from title input
tags: input value from tags input

**/

export const PostEvent = Parse.Object.extend({
	className: 'Post',

	defaults: {
		timestamp: null,
		title: null,
		content: null,
		src: null,
		tags: null,
		author: null,
		isPrivate: false,
		published: false
	}
})

export const PostEventList = Parse.Collection.extend({
	model: PostEvent
})