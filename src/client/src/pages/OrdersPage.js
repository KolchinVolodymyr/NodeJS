import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/loader";
import {OrderList} from "../components/OrderList";

export const OrderPage = () => {
    const [order, setOrder] = useState([]);
    const {loading, request, clearError, error} = useHttp();
    const message = useMessage();
    const {token} = useContext(AuthContext);

    const fetchOrder = useCallback(async () => {
        try {
            const fetched = await request('/orders', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setOrder(fetched.orders);
        } catch (e) {
            console.log(e);
        }
    }, [token, request]);

    useEffect(()=>{
        fetchOrder()
    }, [fetchOrder]);
    /**/
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError]);


    if (loading) {
        return <Loader/>
    }
    if(order.length===0) {
        return <h2>No orders</h2>
    }
    return (
        <div>
            <h1>
                Your orders
            </h1>
            <div className="row">
                <div className="col s6 offset-s3">
                    {order.map(item => {
                        return (
                            <OrderList key={item._id} item={item}/>
                        )})
                    }
                </div>
            </div>
        </div>
    );
}








