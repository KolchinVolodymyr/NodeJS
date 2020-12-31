import React from 'react'


export const CourseCard = ({ course }) => {

    return (
        <div>
            <div className="course">
                <h1>{course.title}</h1>

                <img src={course.img} alt={course.title}/>
                <p className="price big">{course.price}</p>
            </div>
        </div>
    )
}
