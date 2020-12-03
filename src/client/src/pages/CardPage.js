import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/loader";


export const CardPage = () => {
    const [card, setCard] = useState('');
    const {loading, request, clearError, error} = useHttp();
    const message = useMessage();
    const {token} = useContext(AuthContext);

    const fetchCard = useCallback(async () => {
        try {
            const fetched = await request('/card', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            console.log('fetched',fetched)
            setCard(fetched);
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
    }, [error, message, clearError])




    if (loading) {
        return <Loader/>
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
                    {/*{courses.map(course => {*/}
                    {/*    return course.count*/}
                    {/*})}*/}
                        <tr>
                            <td>{card.count}</td>
                            <td>{card.price}</td>
                            <td>
                                <button className="btn btn-small js-remove" data-id="{{id}}">Удалить</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

        )


}









