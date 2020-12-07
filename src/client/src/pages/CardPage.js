import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/loader";
import {useHistory, useParams} from "react-router-dom";
import {DeleteCourseBtn} from "../components/DeleteCourseBtn";


export const CardPage = () => {
    const [card, setCard] = useState([]);
    const [price, setPrice] = useState('');
    const [state, setState] = useState({
         id:''
     });
    const {loading, request, clearError, error} = useHttp();
    const message = useMessage();
    const {token} = useContext(AuthContext);


    const fetchCard = useCallback(async () => {
        try {
            const fetched = await request('/card', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            console.log('fetched', fetched);
            setPrice(fetched.price);
            setCard(fetched.courses);
        } catch (e) {
            console.log(e);
        }
    }, [token, request]);

    useEffect(()=>{
        fetchCard()
    }, [fetchCard]);
    /**/
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError]);

    const changeHandler = event => {
        setState({'id': event.target.value});
    };

    const deleteCourse  = async () => {
        try {
            const fetched = await request(`/card/remove`, 'DELETE',
                {id: state}, {
                    Authorization: `Bearer ${token}`
                });
            setPrice(fetched.price);
            setCard(fetched.courses);
        } catch (e) {
            console.log(e);
        }
    };

    const onAdd = async (product) => {

        const fetched = await request(`/card/remove`, 'DELETE',
            {id: product}, {
                Authorization: `Bearer ${token}`
            });
        setPrice(fetched.price);
        setCard(fetched.courses);

    };

    if (loading) {
        return <Loader/>
    }
    if(card.length===0) {
        return <h2>Корзина пустая</h2>
    }
    return (
        <div>
            <h1>Корзина</h1>
            <div id="card">
                <table>
                    <thead>
                    <tr>
                        <th>Названые</th>
                        <th>Количество</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {card.map(item => {
                        return (<tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td>{item.count}</td>
                                    <td>
                                        {/*<DeleteCourseBtn item={item} deleteCourse={deleteCourse}/>*/}
                                        {/*<button onClick={() => onRemove(item)} className="remove">*/}
                                        {/*    -*/}
                                        {/*</button>{' '}*/}
                                        <button onClick={() => onAdd(item._id)} className="add">
                                            Удалить--
                                        </button>
                                        {/*<div>*/}
                                        {/*    <input*/}
                                        {/*        type="text"*/}
                                        {/*        name="id"*/}
                                        {/*        onChange={(e) => setState(e.target.value)}*/}
                                        {/*        value={state}*/}
                                        {/*    />*/}
                                        {/*    <input*/}
                                        {/*        id={item._id}*/}
                                        {/*        name="id"*/}
                                        {/*        onChange={changeHandler}*/}
                                        {/*        value={item._id}*/}
                                        {/*    />*/}
                                        {/*    <button*/}
                                        {/*        type="submit"*/}
                                        {/*        className="btn"*/}
                                        {/*        disabled={loading}*/}
                                        {/*        onClick={deleteCourse}*/}
                                        {/*    >*/}
                                        {/*        Удалить*/}
                                        {/*    </button>*/}
                                        {/*</div>*/}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <p><strong>Цена:</strong> <span className="price">{price}</span></p>
            </div>
        </div>

        )


}









