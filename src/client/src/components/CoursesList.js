import React from 'react'
import {Link} from "react-router-dom";


export const CoursesList = ({ courses }) => {

    if (!courses.length) {
        return <p className="center">Курсов пока нет!!! </p>
    }

    return (
        <div>
            {courses.map(course => {
                return (
                    <div className="row">

                        <div className="col s6 offset-s3">
                            <div className="card" >
                                <div className="card-image">
                                    <img src={course.img} alt={course.title}/>
                                </div>
                                <div className="card-content">
                                    <span className="card-title">{course.title}</span>
                                    <p className="price">{course.price}</p>
                                </div>
                                <div className="card-action action">
                                    <Link to={`/courses/${course._id}`}>Открыть</Link>
                                    {/*<a href="/courses/{id}">Открыть курс</a>*/}
                                    <a href="/courses/{id}/edit?allow=true">Редактировать</a>
                                    {/*<form action="/card/add" method="POST" className="form__buy">*/}
                                    {/*    <input type="hidden" name="id" value="{id}">*/}
                                    {/*        <button type="submit" className="btn btn-primary">Купить</button>*/}
                                    {/*</form>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                        )
                })
            }
        </div>
    )
}

