import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../components/common/TextInput'
import * as loginActions from '../actions/loginActions';
import { browserHistory } from 'react-router';

class LoginContainer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.userNameChange = this.userNameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.login = this.login.bind(this);
        this.state = {
            User: { "UserName": "", "Password": "" },
            error: "",
            loading: false
        }
    }
    userNameChange(event) {
        this.setState({
            'User': Object.assign({}, this.state.User, {
                UserName: event.target.value
            })
        })
    }
    passwordChange(event) {
        this.setState({
            'User': Object.assign({}, this.state.User, {
                Password: event.target.value
            })
        })
    }

    login(event) {
        this.setState({
            'loading': true,
            'error': ""
        })
        event.preventDefault();

        this.props.loginActions.encrypt(this.state.User.Password)
            .then(value => {
                this.props.loginActions.login(this.state.User.UserName, value).then(data => {
                    if(data===undefined)
                        browserHistory.goBack();

                    this.setState({
                        'loading': false,
                        'error': data
                    })
                })
                    .catch(error => {
                        console.log(error);
                        this.setState({
                            'loading': false
                        })
                    });
            }
            )
            .catch(error => {
                console.log(error);
                this.setState({
                    'loading': false
                })
            });
    }

    render() {
        let spinwheel = null;
        let errorMessage = null;
        let loading = this.state.loading;
        let error = this.state.error;
        if (loading)
            spinwheel = <div id="loading">
                <div id="spinner"></div>
            </div>;
        if (error) {
            console.log(error);
            errorMessage = <p id="errorMessage">Please use valid flora credentials</p>;
        }

        return (   
            <div className="container logincontainer">
                <div className="wrapper">
                    <div className="login">
                        <div id="heading">
                            <h1>Elektra</h1>
                        </div>

                        <form action="airporttransfer" name="Login_Form" onSubmit={this.login} >
                            <div name="Login_Form"  className="form-signin" id="loginId">
                                <div className="form-signin-heading">
                                    <h2>Hello! </h2>
                                    <span>Please use your flora credentials to login to the site</span>
                                    {errorMessage}
                                </div>
                                <TextInput name="Username" placeholder="Username" onChange={this.userNameChange} required="" type="text" />
                                <TextInput name="Password" placeholder="Password" onChange={this.passwordChange} required="" type="password" />
                                <button className="btn btn-lg btn-primary btn-block" type="submit" name="Submit" ><span>LOGIN</span></button>
                            </div>
                        </form>
                    </div>
                </div>
                {spinwheel}
                <footer>
                    <img src={require("../images/eflogo.svg")} />
                </footer>
            </div>
        );
    }

}
LoginContainer.propTypes = {
    loginActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        loginActions: bindActionCreators(loginActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer);