import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";
import {useHistory} from "react-router-dom";

export const DeleteCourseBtn = (props) => {
    // const [card, setCard] = useState([]);
    // const [price, setPrice] = useState('');
    const {loading, request, error, clearError} = useHttp();
    const {token} = useContext(AuthContext);
    const message = useMessage();
    const [id, setId] = useState({
        id:''
    });
    /**/
    const history = useHistory();
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError]);

    const deleteCourse = async () => {
        try {
            const fetched = await request(`/card/remove`, 'DELETE',
                {id: props.item._id}, {
                    Authorization: `Bearer ${token}`
                });
            console.log('deleteCourse ...fetched', fetched);

            history.push(`/card`);

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <button
                className="btn btn-primary"
                disabled={loading}
                onClick={deleteCourse}
            >
                3Удалить
            </button>
        </div>
    );
}








