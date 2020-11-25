import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {HomePage} from "./pages/HomePage";
import {CoursesPage} from "./pages/CoursesPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/links" exact>
                    <HomePage />
                </Route>
                <Route path="/create" exact>
                    <CoursesPage />
                </Route>
                <Redirect to="/links" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/login" exact>
                <AuthPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}
