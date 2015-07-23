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
		var src = React.findDOMNode(this.refs.src).value
		this.props.newBlogPostModel.set('src', src)
		console.log('')
		var content = React.findDOMNode(this.refs.storyContent).value
        this.props.newBlogPostModel.set('content', content)
        var keywords = React.findDOMNode(this.refs.keywords).value
       	this.props.newBlogPostModel.set('keywords', keywords)
       	var location = React.findDOMNode(this.refs.location).value
       	this.props.newBlogPostModel.set('location', location)

       	this.props.newBlogPostModel.save()
	}

	render(){
		console.log(this.props.newBlogPostModel)
		if(!this.props.newBlogPostModel){
			return (<span></span>)
		} else{
			return (<div className="event-box">
				<h3  ref="title" contentEditable>{this.props.title}</h3>
				<label for = 'src'></label>
				<input type = 'url' name='src' ref='src' placeholder='Upload an Image'/> 
				<input type="text" ref='storyContent' placeholder="Event Details"/>
				<input type ='text' name='' ref='location' placeholder='Location' />
				<input type ='date' name='keywords' ref='keywords'/>
				<button onClick={(e) => this._publish(e)}> Post Event </button>
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
				<label id="new-event-label" for = 'title'></label>
				<input id="new-event-title" type='text' name='title' ref='newTitle' placeholder='Add an Event'/>
				<button id="post-new-event"> + </button>
			</form>

			</div>
				<NewEvent newBlogPostModel={this.state.workingModel} title={this.state.title} />

			<h3 id="event-title">Find an Event!</h3>
			<div className="line"></div>
        	<div className="line"></div>
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
			    <div id="event-img"><img contenteditable ref='src' src={model.get('src')}/></div>
			    <div id="event-content-left">
					<h5 id="posted-title" contenteditable ref='title'> {model.get('title')} </h5>
					<p id="date" contenteditable ref='keywords'>When: {model.get('keywords')}</p>
					<p id="date" contenteditable ref='location'>Where: {model.get('location')}</p>
					<p id="user-name" ref = 'user'>  Posted By: {model.get('author')}</p>
					<p id="description" contenteditable ref='content'>Event Details: {model.get('content')}</p>

				</div>
				
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
            <div><button id="login"><a href="http://localhost:3000/#login">login</a></button></div>
            <button><img src="./images/magnifying47.png"/></button>
            <input type="search" placeholder="Search"/>
            <div className="nav-menu">
                <div>123Parenting</div>
                <div id="places-wrapper">
                    <div id="places-icon">
                        <p>Places</p>
                    </div>
                    <ul id="places-submenu">
                        <li><a id="first" href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories <img src="./images/hanger22.png"/></a></li>
                        <li><a id='first' href="http://localhost:3000/templates/babyshops.html">Baby Shops <img src="./images/baby32.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/playareas.html">Play Areas <img src="./images/park10.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores <img src="./images/books47.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/museums.html">Museums <img src="./images/museum34.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/amusementparks.html">Amusement Parks <img src="./images/entertaining1.png"/></a></li>
                    </ul>
                </div>
                <div>Classes</div>
                <div id="events-wrapper">
                    <div id="events-icon">
                        <p>Events & Camps</p>
                    </div>
                    <ul id="events-submenu">
                        <li><a id="first" href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps <img src="./images/paintbrush3.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/sportsevents.html">Sports Events <img src="./images/rugbyball.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre <img src="./images/comedy3.png"/></a></li>
                    </ul>
                </div>
                <div id="schools-wrapper">
                    <div id="schools-icon">
                        <p>Schools</p>
                    </div>
                    <ul id="schools-submenu">
                        <li><a id="first" href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools <img src="./images/school72.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/daycares.html">Day Cares <img src="./images/baby67.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/preschools.html">Preschools <img src="./images/letter19.png"/></a></li>
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
                            <li><a id="first" href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories <img src="./images/hanger22.png"/></a></li>
                        <li><a id='first' href="http://localhost:3000/templates/babyshops.html">Baby Shops <img src="./images/baby32.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/playareas.html">Play Areas <img src="./images/park10.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores <img src="./images/books47.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/museums.html">Museums <img src="./images/museum34.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/amusementparks.html">Amusement Parks <img src="./images/entertaining1.png"/></a></li>
                        </ul>
                    </div>
                    <div>Classes</div>
                    <div id="ham-events-wrapper">
                        <div id="ham-events-icon">
                            <p>Events & Camps</p>
                        </div>
                        <ul id="ham-events-submenu">
                            <li><a id="first" href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps <img src="./images/paintbrush3.png"/></a></li>
                            <li><a id="first" href="http://localhost:3000/templates/sportsevents.html">Sports Events <img src="./images/rugbyball.png"/></a></li>
                            <li><a id="first" href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre <img src="./images/comedy3.png"/></a></li>
                        </ul>
                    </div>
                    <div id="ham-schools-wrapper">
                        <div id="ham-schools-icon">
                            <p>Schools</p>
                        </div>
                        <ul id="ham-schools-submenu">
                            <li><a id="first" href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools <img src="./images/school72.png"/></a></li>
                        	<li><a id="first" href="http://localhost:3000/templates/daycares.html">Day Cares <img src="./images/baby67.png"/></a></li>
                        	<li><a id="first" href="http://localhost:3000/templates/preschools.html">Preschools <img src="./images/letter19.png"/></a></li>
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
		return (<div>
				<div className="line"></div>
            		<div className="line"></div>
				<div id="wrapper">
            		
            		<div className="rot-banner"><img src="./images/banner5.jpg"/></div>
            		<div className="group-ad"><img src=""/></div>
            		<div className="upcoming-data-ticker">
                		<div id="udt-left"><p>Be the first to post a 123Kids Event</p></div>
                <div id="udt-middle"><p>Sign up for fun ear-resistible 123Kids crafts, recipes, and activities soon to be delivered straight to your inbox!</p></div>
                <div id="udt-right"><p><button><a href="http://localhost:3000/#events">Create Event</a></button></p></div>
            	</div>
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
                        <li><a id="first" href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories <img src="./images/hanger22.png"/></a></li>
                        <li><a id='first' href="http://localhost:3000/templates/babyshops.html">Baby Shops <img src="./images/baby32.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/playareas.html">Play Areas <img src="./images/park10.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores <img src="./images/books47.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/museums.html">Museums <img src="./images/museum34.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/amusementparks.html">Amusement Parks <img src="./images/entertaining1.png"/></a></li>
                    </ul>
                </div>
                <div>Classes</div>
                <div id="events-wrapper">
                    <div id="events-icon">
                        <p>Events & Camps</p>
                    </div>
                    <ul id="events-submenu">
                        <li><a id="first" href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps <img src="./images/paintbrush3.png"/></a></li>
                            <li><a id="first" href="http://localhost:3000/templates/sportsevents.html">Sports Events <img src="./images/rugbyball.png"/></a></li>
                            <li><a id="first" href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre <img src="./images/comedy3.png"/></a></li>
                    </ul>
                </div>
                <div id="schools-wrapper">
                    <div id="schools-icon">
                        <p>Schools</p>
                    </div>
                    <ul id="schools-submenu">
                        <li><a id="first" href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools <img src="./images/school72.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/daycares.html">Day Cares <img src="./images/baby67.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/preschools.html">Preschools <img src="./images/letter19.png"/></a></li>
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
                            <li><a id="first" href="http://localhost:3000/templates/apparel&accessories.html">Apparel & Accessories <img src="./images/hanger22.png"/></a></li>
                        <li><a id='first' href="http://localhost:3000/templates/babyshops.html">Baby Shops <img src="./images/baby32.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/playareas.html">Play Areas <img src="./images/park10.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/libraries&bookstores.html">Libraries & Book Stores <img src="./images/books47.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/museums.html">Museums <img src="./images/museum34.png"/></a></li>
                        <li><a id="first" href="http://localhost:3000/templates/amusementparks.html">Amusement Parks <img src="./images/entertaining1.png"/></a></li>
                        </ul>
                    </div>
                    <div>Classes</div>
                    <div id="ham-events-wrapper">
                        <div id="ham-events-icon">
                            <p>Events & Camps</p>
                        </div>
                        <ul id="ham-events-submenu">
                            <li><a id="first" href="http://localhost:3000/templates/workshops&camps.html">Workshops & Camps <img src="./images/paintbrush3.png"/></a></li>
                            <li><a id="first" href="http://localhost:3000/templates/sportsevents.html">Sports Events <img src="./images/rugbyball.png"/></a></li>
                            <li><a id="first" href="http://localhost:3000/templates/arts&theatre.html">Arts & Theatre <img src="./images/comedy3.png"/></a></li>
                        </ul>
                    </div>
                    <div id="ham-schools-wrapper">
                        <div id="ham-schools-icon">
                            <p>Schools</p>
                        </div>
                        <ul id="ham-schools-submenu">
                            <li><a id="first" href="http://localhost:3000/templates/elementaryschools.html">Elementary Schools <img src="./images/school72.png"/></a></li>
                        	<li><a id="first" href="http://localhost:3000/templates/daycares.html">Day Cares <img src="./images/baby67.png"/></a></li>
                        	<li><a id="first" href="http://localhost:3000/templates/preschools.html">Preschools <img src="./images/letter19.png"/></a></li>
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