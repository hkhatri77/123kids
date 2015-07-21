import React, {Component} from 'react'
var qs = (selector) => document.querySelector(selector)

class SvgLogin extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return(
			<span className="icon" onClick={() => this.props.rotate()}>
				<span>Log In or Sign-Up</span>
			</span>
		)
	}
}


class LoginInputs extends Component{
	constructor(props){
		super(props)
	}

	_registerUser(e){
		e.preventDefault()
		var user = new Parse.User(),
			firstName = React.findDOMNode(this.refs.firstname).value,
			lastName = React.findDOMNode(this.refs.lastname).value,
			email = React.findDOMNode(this.refs.email).value,
			password = React.findDOMNode(this.refs.newPassword).value,
			username = React.findDOMNode(this.refs.newUsername).value

		user.set ({
			firstname: firstName,
			lastname: lastName,
			email: email,
			password: password,
			username: username
		})

		var signup = user.signUp()
		signup.then(()=> {
			alert("Welcome to 123kids")
			window.location.hash = 'events'
		})
		signup.fail(() => {
			alert('Try Again')
		})
	}

	_signIn(e) {
		e.preventDefault()
		var username = React.findDOMNode(this.refs.username).value,
			password = React.findDOMNode(this.refs.password).value

		var login = Parse.User.logIn(username, password, {
			success: (login) => {
				window.location.hash = 'events'
			},
			error: (login) => {
				this.setState({error: this.state.error + 1})
				alert('error')
			}
		})
	}

	render(){
		return(
			<div className="login-box">
				<div id="left">
					<h4>Already a member?</h4>
					<form>
						<div>
							<input type="text" ref="username" placeholder="Enter username"/>
							<input type="password" ref="password" placeholder="Enter password"/>
						</div>
						<button onClick={(e)=> this._signIn(e)}>Sign In</button>
					</form>
				</div>
				<div id="right">
					<h4>Join 123Kids!</h4>
					<form>
						<div>
							<input type="text" ref="firstname" placeholder="First Name"/>
							<input type="text" ref="lastname" placeholder="Last Name"/>
						</div>
						<div>
							<input type="email" ref="email" placeholder="Email"/>
							<input type="text" ref="newUsername" placeholder="Username"/>
							<input type="password" ref="newPassword" placeholder="Password"/>
						</div>
						<button onClick={(e) => this._registerUser(e)}>Sign Up</button>
					</form>
				</div>
			</div>
		)
	}
}

export class LoginView extends Component{
	constructor(props){
		super(props)
		this.state = { 
		}
	}
	render(){
		return(
			<div>
				<LoginInputs />
			</div>
		)
	}
}