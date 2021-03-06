import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import * as ROUTES from '../../constants/routes';
import { connect } from 'react-redux'
import { withAuthentication } from '../Session';



class App extends React.Component {



  render() {
    return (
      <Router>
        <Navigation props={this.props.user} />
        <hr />
        <div>
          <Route exact path={ROUTES.DEFAULT} component={HomePage} />
          <Route path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  currentPosition: state.position.currentPosition,
  currentCategory: state.position.currentCategory,
});

const app = withAuthentication(App)

export default connect(mapStateToProps)(app)
