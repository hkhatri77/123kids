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
		return(<div>
			<form>
            	<button id="button-right" onClick={(e) => this._logOut(e) }> Logout </button>
			</form>
            
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
			<HomeLogoutView />
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
			</div>
			
		)
	}
}

class HomePageView extends Component{
	constructor(props){
		super(props)
		this.state = { 

		}
	}
	render () {
		return(
			<div>
				<NavView/>
				<UserMenu/>
				<HomeBody/>
			</div>
			)
	}
}


class NavView extends Component {
	constructor(props){
		super(props)
		this.state = { 

		}
	}
	render () {
		return(
			<div>
				<div className="header">
            <div><a href="http://localhost:3000/#login">login</a></div>
            <button><img src="./images/magnifying47.png"/></button>
            <input type="search" placeholder="Search"/>
            <div className="nav-menu">
                <div>123Parenting</div>
                <div id="places-wrapper">
                    <div id="places-icon">
                        <p>Places</p>
                    </div>
                    <ul id="places-submenu">
                        <li><a href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories</a></li>
                        <li><a href="http://localhost:3000/templates/babyshops.html">Baby Shops</a></li>
                        <li><a href="http://localhost:3000/templates/playareas.html">Play Areas</a></li>
                        <li><a href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores</a></li>
                        <li><a href="http://localhost:3000/templates/museums.html">Museums</a></li>
                        <li><a href="http://localhost:3000/templates/amusementparks.html">Amusement Parks</a></li>
                    </ul>
                </div>
                <div>Classes</div>
                <div id="events-wrapper">
                    <div id="events-icon">
                        <p>Events & Camps</p>
                    </div>
                    <ul id="events-submenu">
                        <li><a href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps</a></li>
                            <li><a href="http://localhost:3000/templates/sportsevents.html">Sports Events</a></li>
                            <li><a href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre</a></li>
                    </ul>
                </div>
                <div id="schools-wrapper">
                    <div id="schools-icon">
                        <p>Schools</p>
                    </div>
                    <ul id="schools-submenu">
                        <li><a href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools</a></li>
                        <li><a href="http://localhost:3000/templates/daycares.html">Day Cares</a></li>
                        <li><a href="http://localhost:3000/templates/preschools.html">Preschools</a></li>
                    </ul>
                </div>
            </div>
            <ul className="sub-nav-menu">
                <li className="left-margin">Crafts</li>
                <li>Recipes</li>
                <li>Printables</li>
                <li>Activities</li>
            </ul>
            <div className="wrapper">
                <div id="icon-div"><img className="ham-icon" src="./images/menu48.png"/></div>
                <div className="ham-menu">
                    <div>123Parenting</div>
                    <div id="ham-places-wrapper">
                        <div id="ham-places-icon">
                            <p>Places</p>
                        </div>
                        <ul id="ham-places-submenu">
                            <li><a href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories</a></li>
                        <li><a href="http://localhost:3000/templates/babyshops.html">Baby Shops</a></li>
                        <li><a href="http://localhost:3000/templates/playareas.html">Play Areas</a></li>
                        <li><a href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores</a></li>
                        <li><a href="http://localhost:3000/templates/museums.html">Museums</a></li>
                        <li><a href="http://localhost:3000/templates/amusementparks.html">Amusement Parks</a></li>
                        </ul>
                    </div>
                    <div>Classes</div>
                    <div id="ham-events-wrapper">
                        <div id="ham-events-icon">
                            <p>Events & Camps</p>
                        </div>
                        <ul id="ham-events-submenu">
                            <li><a href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps</a></li>
                            <li><a href="http://localhost:3000/templates/sportsevents.html">Sports Events</a></li>
                            <li><a href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre</a></li>
                        </ul>
                    </div>
                    <div id="ham-schools-wrapper">
                        <div id="ham-schools-icon">
                            <p>Schools</p>
                        </div>
                        <ul id="ham-schools-submenu">
                            <li><a href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools</a></li>
                        <li><a href="http://localhost:3000/templates/daycares.html">Day Cares</a></li>
                        <li><a href="http://localhost:3000/templates/preschools.html">Preschools</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

			</div>
			)
	}
}

class UserMenu extends Component {
	constructor(props){
		super(props)
		this.state = { 

		}
	}
	render () {
		return (
			<div className="subheader">
            	<ul>
                	<li className="right-margin">ASK DR. MOM</li>
                	<li>ACTIVITES</li>
                	<li>PRINTABLES</li>
                	<li>RECIPES</li>
                	<li>CRAFTS</li>
            	</ul>
            	<img src="./images/unnamed.png"/>
        	</div>
			)
	}
}

class HomeBody extends Component {
	constructor(props){
		super(props)
		this.state = { 

		}
	}
	render () {
		return (
				<div id="wrapper">
            		<div className="line"></div>
            		<div className="line"></div>
            		<div className="rot-banner"><img src="./images/banner5.jpg"/></div>
            		<div className="group-ad"></div>
            		<div className="upcoming-data-ticker">
                	<button><a href="http://localhost:3000/#events">Create Event</a></button>
            	</div>
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
		return(
			<div className='homescreen'>
				<ul> 
					{this.props.storedPosts.map((model)=> <PostView storedPost={model} />)}
				</ul>
			</div>)
	}
}

class HomeLoginView extends Component {
	constructor(props){
		super(props)
		this.state = { 

		}
	}

	render () {
		return (
				<div>
				<NavView/>
				<LoginView />
				</div>
			)
	}

}

class HomeLogoutView extends Component {
	constructor(props){
		super(props)
		this.state = { 

		}
	}
	render () {
		return (
			<div>
				<div className="header">
            <button><img src="./images/magnifying47.png"/></button>
            <input type="search" placeholder="Search"/>
            <div className="nav-menu">
                <div>123Parenting</div>
                <div id="places-wrapper">
                    <div id="places-icon">
                        <p>Places</p>
                    </div>
                    <ul id="places-submenu">
                        <li><a href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories</a></li>
                        <li><a href="http://localhost:3000/templates/babyshops.html">Baby Shops</a></li>
                        <li><a href="http://localhost:3000/templates/playareas.html">Play Areas</a></li>
                        <li><a href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores</a></li>
                        <li><a href="http://localhost:3000/templates/museums.html">Museums</a></li>
                        <li><a href="http://localhost:3000/templates/amusementparks.html">Amusement Parks</a></li>
                    </ul>
                </div>
                <div>Classes</div>
                <div id="events-wrapper">
                    <div id="events-icon">
                        <p>Events & Camps</p>
                    </div>
                    <ul id="events-submenu">
                        <li><a href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps</a></li>
                            <li><a href="http://localhost:3000/templates/sportsevents.html">Sports Events</a></li>
                            <li><a href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre</a></li>
                    </ul>
                </div>
                <div id="schools-wrapper">
                    <div id="schools-icon">
                        <p>Schools</p>
                    </div>
                    <ul id="schools-submenu">
                        <li><a href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools</a></li>
                        <li><a href="http://localhost:3000/templates/daycares.html">Day Cares</a></li>
                        <li><a href="http://localhost:3000/templates/preschools.html">Preschools</a></li>
                    </ul>
                </div>
            </div>
            <ul className="sub-nav-menu">
                <li className="left-margin">Crafts</li>
                <li>Recipes</li>
                <li>Printables</li>
                <li>Activities</li>
            </ul>
            <div className="wrapper">
                <div id="icon-div"><img className="ham-icon" src="./images/menu48.png"/></div>
                <div className="ham-menu">
                    <div>123Parenting</div>
                    <div id="ham-places-wrapper">
                        <div id="ham-places-icon">
                            <p>Places</p>
                        </div>
                        <ul id="ham-places-submenu">
                            <li><a href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories</a></li>
                        <li><a href="http://localhost:3000/templates/babyshops.html">Baby Shops</a></li>
                        <li><a href="http://localhost:3000/templates/playareas.html">Play Areas</a></li>
                        <li><a href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores</a></li>
                        <li><a href="http://localhost:3000/templates/museums.html">Museums</a></li>
                        <li><a href="http://localhost:3000/templates/amusementparks.html">Amusement Parks</a></li>
                        </ul>
                    </div>
                    <div>Classes</div>
                    <div id="ham-events-wrapper">
                        <div id="ham-events-icon">
                            <p>Events & Camps</p>
                        </div>
                        <ul id="ham-events-submenu">
                            <li><a href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps</a></li>
                            <li><a href="http://localhost:3000/templates/sportsevents.html">Sports Events</a></li>
                            <li><a href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre</a></li>
                        </ul>
                    </div>
                    <div id="ham-schools-wrapper">
                        <div id="ham-schools-icon">
                            <p>Schools</p>
                        </div>
                        <ul id="ham-schools-submenu">
                            <li><a href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools</a></li>
                        <li><a href="http://localhost:3000/templates/daycares.html">Day Cares</a></li>
                        <li><a href="http://localhost:3000/templates/preschools.html">Preschools</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

			</div>)

	}
}

var ParseRouter = Parse.Router.extend({
	routes: {
		'events': 'events',
		'story': 'story',
		'login': 'login',
		'logout': 'logout',
		'*defaults':'home',
	}, 

	login: () => {
		if(Parse.User.current()){
			window.location.hash = '#events'
			return
		}
		React.render(<HomeLoginView />, qs('.container'))
	},

	home: () => {
		React.render(<HomePageView/>, qs('.container'))
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