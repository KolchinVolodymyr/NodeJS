import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {useHistory} from 'react-router-dom';
import {useMessage} from "../hooks/message.hook";

export const AddCoursePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [course_add, setCourse_add] = useState({
        title: '', price:'', img:''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])


    const changeHandler = event => {
        setCourse_add({...course_add, [event.target.name]: event.target.value});
    }

    const pressHandler = async ()  => {
        try {
            const data = await request('/add-course', 'POST', {...course_add}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message);
            history.push(`/`);
        } catch (e) {console.log(e)}
    }

    return (
        <div>
           <h1>
               Add course
           </h1>
            <div>
                <div className="input-field">
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="validate"
                        onChange={changeHandler}
                        required
                    />
                        <label htmlFor="title">Course name</label>
                        <span className="helper-text" data-error="Enter the title"/>
                </div>
                <div className="input-field">
                    <input
                        id="price"
                        name="price"
                        type="number"
                        className="validate"
                        onChange={changeHandler}
                        required
                    />
                        <label htmlFor="price">Course price</label>
                        <span className="helper-text" data-error="Enter the price"/>
                </div>
                <div className="input-field">
                    <input
                        id="img"
                        name="img"
                        type="text"
                        className="validate"
                        onChange={changeHandler}
                        required
                    />
                        <label htmlFor="img">Image URL</label>
                        <span className="helper-text" data-error="Enter the URL of the image"/>
                </div>

                <button
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={pressHandler}
                >
                    Add to
                </button>
            </div>
        </div>
    );
}








