import React, {useContext, useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import {Loader} from "./loader";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {AddCourseBtn} from "./AddCourseBtn";


export const CoursesList = ({ courses }) => {
    const {token} = useContext(AuthContext);
    const isAuthenticated = !!token;
    const {loading, clearError, error, request} = useHttp();
    const message = useMessage();

    /**/
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError]);

    if (loading) {
        return <Loader/>
    }
    if (!courses.length) {
        return <p className="center">Курсов пока нет!!! </p>
    }

    return (
        <div>
            {courses.map(course => {
                return (
                    <div className="row" key={course._id}>

                        <div className="col s6 offset-s3">
                            <div className="card" >
                                <div className="card-image">
                                    <img src={course.img} alt={course.title}/>
                                </div>
                                <div className="card-content">
                                    <span className="card-title">{course.title}</span>
                                    <p className="price">{course.price}</p>
                                </div>
                                <div className="card-action action">
                                    <Link to={`/courses/${course._id}`}>Открыть</Link>
                                    { isAuthenticated && <Link to={`/courses/${course._id}/edit`}>Редактировать</Link> }
                                    <AddCourseBtn course={course} />
                                </div>
                            </div>
                        </div>
                    </div>
                        )
                })
            }
        </div>
    )
}

