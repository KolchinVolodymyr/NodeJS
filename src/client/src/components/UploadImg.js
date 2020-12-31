import React, {useContext, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "./loader";

export const UploadImg = ({profile}) => {
    const [image, setImage] = useState('');
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const uploadImage = async e  => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'darwin');

        const res = await fetch(' https://api.cloudinary.com/v1_1/dlcnvczyh/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await res.json();
        setImage(file.secure_url);
    }

    const fetchAvatarProfile = async ()  => {
        try {
            await request('/profile', 'POST', {avatarUrl: image}, {
                Authorization: `Bearer ${token}`
            });
        } catch (e) {
            console.log(e);
        }
    }

    if (loading) {
        return <Loader/>
    }

    return (
        <div>
            <input
                type="file"
                name="file"
                placeholder="Upload an image"
                onChange={uploadImage}
            />
            <button
                type="submit"
                className="btn green avatar__btn"
                onClick={fetchAvatarProfile}
            > Сохранить аватар</button>

            {image ? (
                <img className="avatar" src={image} alt='avatar'/>
            ) : (
                <img className="avatar" src={profile.avatarUrl} alt='avatar'/>
            )}
        </div>
    )
}


