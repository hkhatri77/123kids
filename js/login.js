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

class SvgBack extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return(
			<span className="back" onClick={() => this.props.rotate()}>
				<span>Go back</span>
			</span>
		)
	}
}

class CoinFront extends Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div className="frontOfCoin">
			</div>
		)
	}
}

class CoinBack extends Component{
	constructor(props){
		super(props)
		// this.state = {
		// 	error: 0
		// }
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
			<div className="backOfCoin">
				<SvgBack {...this.props} />
				<div className="login">
					<h4>Login</h4>
					<form>
						<div>
							<input type="text" ref="username" placeholder="Enter username"/>
							<input type="password" ref="password" placeholder="Enter password"/>
						</div>
						<button onClick={(e)=> this._signIn(e)}>Sign In</button>
					</form>
				</div>
				<div className="signup">
					<h4>Sign Up</h4>
					<form>
						<div>
							<span><input type="text" ref="firstname" placeholder="First Name"/>
							<input type="text" ref="lastname" placeholder="Last Name"/></span>
						</div>
						<div>
							<span><input type="email" ref="email" placeholder="Email"/>
							<input type="text" ref="newUsername" placeholder="Username"/></span>
						</div>
						<div><input type="password" ref="newPassword" placeholder="Password"/></div>
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
			rotated: false
		}
	}
	rotate(){
		this.setState({rotated: !this.state.rotated})
	}
	render(){
		return(
			<div className={`rotationContainer ${this.state.rotated ? 'rotated' : ''}`}>
				<CoinFront rotate={() => this.rotate()} />
				<CoinBack rotate={() => this.rotate()} />
			</div>
		)
	}
}