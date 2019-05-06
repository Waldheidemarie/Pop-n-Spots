import app from "firebase/app";
import { REACT_APP_API_KEY } from "../../secrets";
import "firebase/auth";
import 'firebase/database';

const config = {
  apiKey: REACT_APP_API_KEY,
  authDomain: "bluebubbles-998d5.firebaseapp.com",
  databaseURL: "https://bluebubbles-998d5.firebaseio.com",
  projectId: "bluebubbles-998d5",
  storageBucket: "bluebubbles-998d5.appspot.com",
  messagingSenderId: "406743690960"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');

  bars = () => {
    let ref = this.db.ref('bars');
    ref.on('value', snapshot => {
      const bars = snapshot.val();
       return bars;
      //  console.log(bars);
    });
  }
  burgers = () => {
    let ref = this.db.ref('burgers');
    ref.on('value', snapshot => {
      const burgers = snapshot.val();
      return burgers;
    });
  }
  cocktails = () => {
    let ref = this.db.ref('cocktails');
    ref.on('value', snapshot => {
      const cocktails = snapshot.val();
      console.log(cocktails);
    });
  }
  pizza = () => {
    let ref = this.db.ref('pizza');
    ref.on('value', snapshot => {
      const pizza = snapshot.val();
      console.log(pizza);
    });
  }
  tacos = () => {
    let ref = this.db.ref('tacos');
    ref.on('value', snapshot => {
      const tacos = snapshot.val();
      console.log(tacos);
    });
  }
  winebars = () => {
    let ref = this.db.ref('winebars');
    ref.on('value', snapshot => {
      const winebars = snapshot.val();
      console.log(winebars);
    });
  }
};

export default Firebase;
