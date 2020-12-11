import React from 'react';

export const OrderCourseItem = ({index}) => {

    return (
            <li>
                {index.course.title} (x <strong>{index.count}</strong>)
            </li>
    );
}








