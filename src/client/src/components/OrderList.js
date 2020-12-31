import React from 'react';
import {OrderCourseItem} from "./OrderCourseItem";

export const OrderList = ({item}) => {

    return (
        <div>
            <div className="card">
                <div className="card-content">
                    <span className="card-title">
                        Order <small>{item._id}</small>
                    </span>
                    <p>
                        {item.date}
                    </p>
                    <p><em>{item.user.userId.name}</em>{item.user.userId.email}</p>
                    <ol>
                        {item.courses.map( index =>{
                            return (
                                <OrderCourseItem key={index._id} index={index}/>
                            )
                        })}
                    </ol>
                    <p>Price:<span className="price">{item.price}</span></p>
                </div>
            </div>
        </div>
    );
}








