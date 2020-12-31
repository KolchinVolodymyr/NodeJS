import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/loader";
import {useMessage} from "../hooks/message.hook";
import {useHistory, useParams} from "react-router-dom";

export const CourseEditPage = () => {
    const [course, setCourse] = useState({
        title:'', price:'', img:''
    });
    const {loading, request, clearError, error} = useHttp();
    const message = useMessage();
    const history = useHistory();
    const {token} = useContext(AuthContext);
    const courseId = useParams().id;

    const fetchCourse = useCallback(async () => {
        try {
            const fetched = await request(`/courses/${courseId}/edit`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setCourse(fetched);
        } catch (e) {
            console.log(e);
        }
    }, [token, request, courseId]);

    useEffect(()=>{
        fetchCourse()
    }, [fetchCourse]);

    /**/
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError]);

    const changeHandler = event => {
        setCourse({...course, [event.target.name]: event.target.value})
    }

    const pressHandler = async ()  => {
        try {
            const data = await request(`/courses/${courseId}/edit`, 'POST', {...course, id: courseId}, {
                Authorization: `Bearer ${token}`
            });
            message(data.message);
            history.push(`/courses/${courseId}`);
        } catch (e) {
            console.log(e);
        }
    }

    if (loading) {
        return <Loader/>
    }

    return (
        <div>
            <h1>
                Course editing {course.title}
            </h1>
            <div className="row">
                <div>
                    <div className="input-field">
                        <input
                            placeholder="Insert title"
                            id="title"
                            name="title"
                            type="text"
                            value={course.title}
                            onChange={changeHandler}
                        />
                        <label className="active" htmlFor="link">Enter the title</label>
                    </div>
                    <div className="input-field">
                        <input
                            id="price"
                            name="price"
                            type="number"
                            className="validate"
                            value={course.price}
                            onChange={changeHandler}
                            required
                        />
                        <label className="active" htmlFor="price">Course price</label>
                        <span className="helper-text" data-error="Enter the price"/>
                    </div>
                    <div className="input-field">
                        <input
                            id="img"
                            name="img"
                            type="text"
                            className="validate"
                            value={course.img}
                            onChange={changeHandler}
                            required
                        />
                        <label className="active" htmlFor="img">Image URL</label>
                        <span className="helper-text" data-error="Enter the URL of the image"/>
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={pressHandler}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}








