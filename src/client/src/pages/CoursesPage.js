import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/loader";
import {CoursesList} from "../components/CoursesList";
import {AuthContext} from "../context/AuthContext";

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
    }, [token, request]);

    function removeCourse(id) {
        setCourses(courses.filter(course => course._id !== id));
    }

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses]);


    if (loading) {
        return <Loader/>
    }

    if (!courses.length) {
        return (
            <p className="center">Курсов пока нет!!! </p>
        )
    }

    return (
        <div>
            <h1>Все курсы</h1>
            <div className="row">
                {courses.map(course => {
                     return (
                         <CoursesList key={course._id} removeCourse={removeCourse} course={course} />
                         )
                    })}
            </div>
        </div>
    );
}







