import React, {useContext, useEffect} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";

export const AddCourseBtn = ({course}) => {
    const {request, error, clearError} = useHttp();
    const {token, userId} = useContext(AuthContext);
    const message = useMessage();
    /**/

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const fetchAddCourse = async ()  => {
        try {
            const data = await request(`/card/add`, 'POST', {id: course._id, userId: userId}, {
                Authorization: `Bearer ${token}`
            });
            message(data.message);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="add-btn">
            <button type="submit" className="btn btn-primary" onClick={fetchAddCourse}>Buy</button>
        </div>
    );
}








