import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/loader";
import {CoursesList} from "../components/CoursesList";

export const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const fetchCourses = useCallback(async () => {
        try {
            const fetched = await request('/courses', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setCourses(fetched)
        } catch (e) {}
    }, [token, request])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses]);


    if (loading) {
        return <Loader/>
    }

    return (
        <div>
           <h1>Courses Page</h1>

            {!loading && <CoursesList courses={courses} />}
        </div>
    );
}








