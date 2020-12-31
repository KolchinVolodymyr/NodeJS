import React, {useContext, useEffect} from 'react'
import {Link} from "react-router-dom";
import {Loader} from "./loader";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {AddCourseBtn} from "./AddCourseBtn";
import {DeleteCourseBtn} from "./DeleteCourseBtn";

export const CoursesList = ({ course, removeCourse }) => {
    const {userId} = useContext(AuthContext);
    const {loading, clearError, error} = useHttp();
    const message = useMessage();

    /**/
    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    if (loading) {
        return <Loader/>
    }

    return (
        <div className="col s4 ">
            <div className="card" >
                <div className="card-image">
                    <img src={course.img} alt={course.title}/>
                </div>
                <div className="card-content">
                    <span className="card-title">{course.title}</span>
                    <p className="price">{course.price}</p>
                </div>
                <div className="card-action action">
                    <div className="row">
                        <Link to={`/courses/${course._id}`}>Open</Link>
                        { course.userId===userId && <Link to={`/courses/${course._id}/edit`}>Edit</Link> }
                    </div>
                    <div className="row">
                        <AddCourseBtn course={course} />
                        { course.userId===userId && <DeleteCourseBtn removeCourse={removeCourse} course={course}/>}
                    </div>
                   </div>
            </div>
        </div>
    )
}

