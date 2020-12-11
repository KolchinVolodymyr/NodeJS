import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/loader";

export const CardPage = () => {
    const [card, setCard] = useState([]);
    const [price, setPrice] = useState('');
    const {loading, request, clearError, error} = useHttp();
    const message = useMessage();
    const {token} = useContext(AuthContext);

    const fetchCard = useCallback(async () => {
        try {
            const fetched = await request('/card', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setPrice(fetched.price);
            setCard(fetched.courses);
        } catch (e) {
            console.log(e);
        }
    }, [token, request])

    useEffect(()=>{
        fetchCard()
    }, [fetchCard]);
    /**/
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError]);


    const cardRemove = async (id) => {
        const fetched = await request(`/card/remove`, 'DELETE', {id: id}, {
            Authorization: `Bearer ${token}`
        });
        setPrice(fetched.price);
        setCard(fetched.courses);
    };

    const pressHandler = async ()  => {
        try {
            const data = await request('/orders', 'POST', {}, {
                Authorization: `Bearer ${token}`
            });
            setCard([]);
            message(data.message);

        } catch (e) {
            console.log(e);
        }
    }

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
                            return (
                                <tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td>{item.count}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => cardRemove(item._id)}
                                        >
                                            Удалить-
                                        </button>
                                    </td>
                                </tr>
                                )
                            })}
                    </tbody>
                </table>
                <p><strong>Цена:</strong> <span className="price">{price}</span></p>
            </div>
            <button
                type="submit"
                className="btn"
                disabled={loading}
                onClick={pressHandler}
            >
                Сделать заказ
            </button>
        </div>
    )
}









