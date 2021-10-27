
import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ component: Component, ...props }) {
    console.log({ loggin: props.loggedIn })
    console.log(props.component)
    console.log('what?')
    return (
        <Route>
            {() => props.loggedIn ? <Component {...props} /> : <Redirect to="./sign-in" />}
        </Route>
    );
};

export default ProtectedRoute;