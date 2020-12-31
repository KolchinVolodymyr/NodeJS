import React, {useContext, useEffect} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";

export const DeleteCourseBtn = ({course, removeCourse}) => {
    const {request, error, clearError} = useHttp();
    const {token} = useContext(AuthContext);
    const message = useMessage();

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const deleteCourse = async ()  => {
        try {
            const data = await request(`/courses/remove`, 'POST', {id: course._id}, {
                Authorization: `Bearer ${token}`
            });
            removeCourse(course._id);
            message(data.message);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="margin-btn">
            <button type="submit" className="btn btn-primary red" onClick={deleteCourse}>Delete</button>
        </div>
    );
}








