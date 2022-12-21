import { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Layout from "./components/layout/Layout";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <h1>HOMEPAGE</h1>
        </Route>

        {!authCtx.isLoggedIn && (
          <Route path="/auth">
            <h1>LOGIN</h1>
          </Route>
        )}

        {authCtx.isLoggedIn && (
          <Route path="/profile">
            <h1>LOGIN</h1>
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
