"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")

import {Promise} from 'es6-promise'
import $ from 'jquery'
import React, {Component} from 'react'
import _ from 'underscore'

import {LoginView} from './login'
import {PostEvent, PostEventList} from './post'
var Parse = window.Parse 
Parse.$ = $

var qs = (selector) => document.querySelector(selector);

const stories = new PostEventList();

class Toolbar extends Component{
	constructor(props){
		super(props)
	}
// _blockSubmit(e) {
// 	e.preventDefault()

// }

_logOut (e) {
	e.preventDefault()
	Parse.User.logOut()
	window.location.hash = '#login'
}
	

	render(){
		return(<div id="wrapper">
        <div className="header">
            <div className="logo"></div>
            <form >
            <button id="button-right" onClick={(e) => this._logOut(e) }> Logout </button>
            <button id="button-right">Write a story</button>
            <input id="search-input" type="text" ref=""/>
            <button id="search-icon"></button>
           	
			</form>
            
        </div>
        <div className="subheader"></div>
			<div>
				<svgIcon />
			</div>
			
			
			

		</div>)
	}
}

class NewEvent extends Component {
	constructor(props){
		super(props)
		this.rerender = () => this.forceUpdate()
	}

	componentDidMount(){
		var model = this.props.newBlogPostModel
        model && model.on('change', (e) => { this.rerender() } )
    }

	_publish(e){
		var currentUser = Parse.User.current().toJSON()
		var title = React.findDOMNode(this.refs.title).innerText
		this.props.newBlogPostModel.set('title', title)
		this.props.newBlogPostModel.set('author', `${currentUser.firstname} ${currentUser.lastname}`)
		var imgSrc = React.findDOMNode(this.refs.imgsrc).innerHTML
		this.props.newBlogPostModel.set('src', imgSrc)
		console.log('publishing !!!!	')
		var content = React.findDOMNode(this.refs.storyContent).value
        this.props.newBlogPostModel.set('content', content)
        var keywords = React.findDOMNode(this.refs.keywords).value
       	this.props.newBlogPostModel.set('tags', keywords)

       	this.props.newBlogPostModel.save()
	}

	render(){
		console.log(this.props.newBlogPostModel)
		if(!this.props.newBlogPostModel){
			return (<span></span>)
		} else{
			return (<div>
				<h3  ref="title" contentEditable>{this.props.title}</h3>
				<label for = 'src'> Share a picture with your story. </label>
				<input type = 'url' name='src' ref='imgsrc' placeholder='Image Url'/> 
				<input type="text" ref='storyContent' placeholder="Share your story."/>
				<label for = 'keywords'> Enter 3 story tags. </label>
				<input type ='text' name='keywords' ref='keywords' placehloder='Tags' />
				<label for='isPrivate'> Make Story Private </label>
				<input type = 'checkbox' name='isPrivate' ref='isPrivate'/>
				<button onClick={(e) => this._publish(e)}> Publish </button>
			</div>
			)
		}
	}
}

class EventView extends Component {
	constructor(props){
		super(props)
		this.state = {
			title: null,
			workingModel: null
		}
		this.rerender = () => this.forceUpdate()
	}

    componentDidMount(){
        this.props.storedPosts.on('update sync', this.rerender)
    }

    componentDidUnmount(){
        this.props.storedPosts.off('update sync', this.rerender)
    }

	_NewEvent(e){
		e.preventDefault()
		var title = React.findDOMNode(this.refs.newTitle)
		this.setState({title: title.value})

		if (this.state.title){
			var model = new PostEvent({title: this.state.title})
			this.setState({workingModel : model})
			this.props.storedPosts.create(model)
			title.value = ''
		}

	}

	render() { 
		console.log(this.state.workingModel)
		var postedEvents = this.props.storedPosts
		console.log(postedEvents)
		console.log(postedEvents.map((model) => model.toJSON()))
		return (<div>
			<Toolbar />

			<div id="new-event">
			<form onSubmit={(e) => this._NewEvent(e)}> 
				<label id="new-event-label" for = 'title'> Event Name </label>
				<input id="new-event-title" type='text' name='title' ref='newTitle' placeholder='New Events'/>
				<button id="post-new-event"> + </button>
			</form>

			</div>
				<NewEvent newBlogPostModel={this.state.workingModel} title={this.state.title} />

			<h3 id="event-title">User Events</h3>
             <hr />
			<ul>
				{postedEvents.map((model) => <PostView existingStories={model} />)}
			</ul>	
		</div>)
	}
}

class PostView extends Component{
	constructor(props){
		super(props)
	}

	render(){
		var model = this.props.existingStories
		console.log(model)
		console.log('here in postview')
		var user = model.get('author')
		console.log(user)
		// var timestamp = model.get('timestamp')
		return (
			<div className="left_box">
			<li className="post">
				<p id="user-name" ref = 'user'> {model.get('author')} </p>
				<p id="time-stamp">1 day ago</p>
			    <p ref='timestamp'> {model.get('timestamp')} </p>
			    <button id="like" ref='recommend'></button>
				<div id="story-img"><img ref='src' src={model.get('src')}/></div>
				<h4 id="title" contenteditable ref='title'> {model.get('title')} </h4>
				<p id="description" contenteditable ref='content'>{model.get('content')}</p>
				<p id="read-more">Continue reading</p>
				<p ref='tags'> {model.get('tags')} </p>
				
			</li>
			<div className="floating-logo"><p>M</p></div>
			</div>
			
		)
	}
}

class PostListView extends Component{
	constructor(props){
		super(props)
		this.rerender = () => {
			this.props.storedPosts.save()
			this.forceUpdate()
		}
	}

	componentDidMount() {
		this.props.storedPosts.on('change', this.rerender)
	}

	componentDidUnMount() {
		this.props.storedPosts.off('change', this.rerender)
	}

	render(){
		return(<div className='homescreen'> 
			<ul> 
				{this.props.storedPosts.map((model)=> <PostView storedPost={model} />)}
			</ul>
		</div>)
	}
}

var ParseRouter = Parse.Router.extend({
	routes: {
		'#':'home',
		'events': 'events',
		'story': 'story',
		'login': 'login',
		'logout': 'logout'
	}, 

	login: () => {
		if(Parse.User.current()){
			window.location.hash = '#events'
			return
		}
		React.render(<LoginView />, qs('.container'))
	},

	home: () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
			return
		}
		stories.fetch()
		// React.render(<frontOfCoin />, qs('.container'))
		React.render(<PostListView storedPosts={stories} />, qs('.container'))
	},

	story: () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
			return
		}
		React.render(<PostView />, qs('.container'))
	},

	events: () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
			return
		}
		stories.fetch()
		React.render(<EventView storedPosts={stories}/>, qs('.container'))
	},

	initialize: () => {
		Parse.history.start()
	}
})

var router = new ParseRouter() 