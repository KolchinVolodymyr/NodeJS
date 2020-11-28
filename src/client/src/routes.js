import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import {AuthPage} from './pages/AuthPage'
import {CoursesPage} from "./pages/CoursesPage";
import {HomePage} from "./pages/HomePage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/links">
                    <HomePage />
                </Route>
                <Route path="/create">
                    <CoursesPage />
                </Route>
                <Redirect to="/links" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/">
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
