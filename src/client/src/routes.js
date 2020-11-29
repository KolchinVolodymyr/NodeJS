import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import {AuthPage} from './pages/AuthPage'
import {CoursesPage} from "./pages/CoursesPage";
import {HomePage} from "./pages/HomePage";
import {AddCourse} from "./pages/AddCourse";
import {ProfilePage} from "./pages/ProfilePage";
import {CardPage} from "./pages/CardPage";
import {OrderPage} from "./pages/OrdersPage";
import {CourseDetailPage} from "./pages/CourseDetailPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <HomePage />
                </Route>
                <Route path="/courses" exact>
                    <CoursesPage />
                </Route>
                <Route path="/courses/:id">
                    <CourseDetailPage />
                </Route>
                <Route path="/add-course" exact>
                    <AddCourse />
                </Route>
                <Route path="/profile" exact>
                    <ProfilePage />
                </Route>
                <Route path="/card" exact>
                    <CardPage />
                </Route>
                <Route path="/order" exact>
                    <OrderPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <HomePage />
            </Route>
            <Route path="/courses" exact>
                <CoursesPage />
            </Route>
            <Route path="/courses/:id">
                <CourseDetailPage />
            </Route>
            <Route path="/login" exact>
                <AuthPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}
