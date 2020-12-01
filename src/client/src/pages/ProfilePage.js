import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/loader";
import {useMessage} from "../hooks/message.hook";
import {useHistory} from "react-router-dom";


export const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name:'', email:''
    });
    const [avatar, setAvatar] = useState('');
    const {loading, request, clearError, error} = useHttp();
    const message = useMessage();
    const history = useHistory();
    const {token} = useContext(AuthContext);
    console.log('profile', profile);
    const fetchProfile = useCallback(async () => {
       try {
           const fetched = await request('/profile', 'GET', null, {
               Authorization: `Bearer ${token}`
           });
           setProfile(fetched);
       } catch (e) {
           console.log(e);
       }
    }, [token, request]);

    useEffect(()=>{
        fetchProfile()
    }, [fetchProfile]);

    /**/
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setProfile({...profile, [event.target.name]: event.target.value})
    }

    const fetchAvatarProfile = async ()  => {
        try {
            const data = await request('/profile', 'POST', {...profile}, {
                Authorization: `Bearer ${token}`
            })
            setAvatar(data);
            message(data.message);
            history.push(`/profile`);
        } catch (e) {
            console.log(e);
        }
    }

    if (loading) {
        return <Loader/>
    }

    return (
        <div>
            <h1>
                Страница профиля
            </h1>
            <div className="row">
                <div className="col s6">
                    <img className="avatar" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"  alt="avatar"/>
                </div>
                <div className="col s6">
                    <p>Email <strong>  {profile.email}  </strong></p>
                    <p>Имя <strong>  {profile.name} </strong></p>
                    <div>
                        <div className="input-field">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="validate"
                                value={profile.email}
                                onChange={changeHandler}
                                required
                            />
                            <label className='active' htmlFor="email">Введите новый Email</label>
                            <span className="helper-text" data-error="Введите email"/>
                        </div>
                        <div className="input-field">
                            <input id="name"
                                   name="name"
                                   type="text"
                                   className="validate"
                                   value={profile.name}
                                   onChange={changeHandler}
                                   required
                            />
                                <label className="active" htmlFor="name">Введите новое имя</label>
                                <span className="helper-text" data-error="Введите имя"/>
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            onClick={fetchAvatarProfile}
                        >Изменить</button>
                    </div>
                </div>
            </div>
        </div>
    );
}








