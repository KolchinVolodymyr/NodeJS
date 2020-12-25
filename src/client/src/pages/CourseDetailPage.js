import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {useParams} from 'react-router-dom'
import {Loader} from "../components/loader";
import {CourseCard} from "../components/CourseCard";

export const CourseDetailPage = () => {
    const {token} = useContext(AuthContext);
    const {request, loading} = useHttp();
    const [course, setCourse] = useState(null);
    const courseId = useParams().id;

    const getCourse = useCallback(async () => {
        try {
            const fetched = await request(`/courses/${courseId}`, 'GET', null,{
                Authorization: `Bearer ${token}`
            });
            setCourse(fetched);
        } catch (e) {
            console.log(e);
        }
    }, [token, courseId, request]);

    useEffect(()=>{
        getCourse();
    }, [getCourse]);

    if (loading) {
        return <Loader />
    }

    return (
        <div>
           { !loading && course && <CourseCard course={course} /> }
        </div>
    );
}








