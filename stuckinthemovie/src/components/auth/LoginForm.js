import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./LoginForm.module.css";

function LoginForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    const currentEmail = emailInputRef.current.value;
    const currentPassword = passwordInputRef.current.value;

    setIsLoading(true);

    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

    const apiKey = process.env.REACT_APP_FIREBASE_PROJECTKEY;

    fetch(`${url}${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        email: currentEmail,
        password: currentPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          // console.log("sucess");
          return res.json();
        } else {
          return res.json().then((data) => {
            // console.log(data);
            let errorMessage = "Authentication Failed";

            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>LOGIN</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Login</button>}
          {isLoading && <p> Loading.... </p>}
        </div>
      </form>
    </section>
  );
}

export default LoginForm;
