import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/loader";
import {useMessage} from "../hooks/message.hook";
import {UploadImg} from "../components/UploadImg";


export const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name:'', email:''
    });
    const {loading, request, clearError, error} = useHttp();
    const message = useMessage();
    const {token} = useContext(AuthContext);

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
            });
            message(data.message);
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
                Profile page
            </h1>
            <div className="row">
                <div className="col s6">
                    <UploadImg profile={profile}/>
                </div>
                <div className="col s6">
                    <p>Email <strong>  {profile.email}  </strong></p>
                    <p>Name <strong>  {profile.name} </strong></p>
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
                            <label className='active' htmlFor="email">Enter new Email</label>
                            <span className="helper-text" data-error="Enter your email"/>
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
                                <label className="active" htmlFor="name">Enter a new name</label>
                                <span className="helper-text" data-error="Enter your name"/>
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            onClick={fetchAvatarProfile}
                        > Save </button>
                    </div>
                </div>
            </div>

        </div>
    );
}








