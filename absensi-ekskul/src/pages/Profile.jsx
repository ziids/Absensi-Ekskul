import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';

const Profile = () => {
    const navigate = useNavigate();
    const [ getEmail, setEmail ] = useState("");
    const [ getImageProfile, setImageProfile ] = useState("");

    const [ getDataUser, setDataUser ] = useState({});
    const [ getMessage, setMessage ] = useState('');

    const photoProfileRef = useRef(null);

    const changeEmail = (e) => {
        let value = e.target.value;
        setEmail(value);
    }

    const clickedPhoto = () => {
        photoProfileRef.current.click();
    }

    const changePhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        console.log(file.size)

        if (file.size > 1000000) return setMessage('* Image size is too large (max 1mb)');

        reader.onload = (e) => {
            setImageProfile(e.target.result);
        };

        reader.readAsDataURL(file);
    }
                                                                                                                                                                                                                                                
    const signOut = () => {
        localStorage.clear();
        navigate('/signin');
    }

    const clickedChange = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/profile/update`,
            data: {
                'email': getEmail ? getEmail : getDataUser.email,
                'photo': getImageProfile ? getImageProfile : getDataUser.photo,
                'token': localStorage.getItem('token')
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == 'nis not registered!') return navigate('/signup');
            if (data.message == 'password does not match!') return setMessage('* Password does not match!');
            if (data.message == 'successfully!') {
                return navigate('/home');
            }
        }).catch(() => {
            navigate('/error');
        });
    }

    useEffect(() => {
        if (localStorage.hasOwnProperty('token')) {
            axios({
                method: "POST",
                url: `${env.API_URL}/api/token`,
                data: { 'token': localStorage.getItem('token') },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(({ data }) => {
                if (data.message == 'successfully!') return setDataUser(data);
                if (data.message == 'nis not registered!') {
                    localStorage.removeItem('token');
                    return navigate('/signup');
                }
            }).catch((err) => {
                navigate('/error');
                
            });
        } else {
            return navigate('/signup');
        }
    }, []);

    useEffect(() => {
        setEmail(getDataUser.email);
    }, [ getDataUser ]);

    return(
        <>
            <div className="h-[50vh] bg-[#3A56E7] rounded-b-3xl flex flex-col items-center">
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <div className="py-5 text-center">
                        <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                    </div>
    
                    <div className="bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg">
                       
                            <div className="flex flex-col justify-center items-center pt-2 pb-6">
                                <h2 className="text-xl font-bold text-[#3A56E7]">PROFILE</h2>
                                <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                            </div>

                            <div className="flex  items-center">
                                <div className="px-2 relative cursor-pointer" onClick={ clickedPhoto }>
                                    <input ref={ photoProfileRef } className="hidden" type="file" name="photo" accept="image/*" onChange={ changePhoto } />
                                    <img className="w-24 h-24 border-4 rounded-full border-[#3A56E7]" src={ getImageProfile ? getImageProfile : getDataUser.photo } alt="profile" />
                                    <span className="bg-[#3A56E7] flex justify-center items-center w-10 h-10 rounded-full absolute bottom-0 right-0"><i className="text-2xl text-white icon ion-md-camera"></i></span>
                                </div>
                                <div className="px-4">
                                    <div className="text-lg text-[#3A56E7] font-bold">
                                        <h3>{ getDataUser.nama }</h3>
                                    </div>
                                    <div className="text-xs text-[#9498AD] font-bold">
                                        <span>{ getDataUser.nis }</span>
                                        <span className="px-1">•</span>
                                        <span>{ getDataUser.kelas }</span>
                                    </div>
                                    <span className="text-xs text-[#9498AD] font-bold">{ getDataUser.type }</span>
                                </div>
                            </div>
    
                            <div className="mt-3">
                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="email">EMAIL : </label>
                                    <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type="email" name="email" id="email" value={ getEmail || '' } onChange={ changeEmail } />
                                </div>
                                
                                <div className="flex flex-col">
                                    <span className={`text-red-600 ${getMessage ? '' : 'hidden'}`}>{ getMessage }</span>
                                    <a className="text-xs text-[#3A56E7]" href="/forgot">CHANGE PASSWORD</a>
                                </div>

                                <div className="flex items-center justify-between mt-5">
                                    <div className="text-[#3A56E7]">
                                        <button href="/signup" onClick={ signOut }>SIGN OUT</button>
                                    </div>
                                    <div className="text-white">
                                        <button className="bg-[#3A56E7] py-2 px-4 rounded-lg" type="submit" onClick={ clickedChange }>CHANGE</button>
                                    </div>
                                </div>
                            </div>
                      
                    </div>
                </div>
            </div>

            <div className="bg-[#3A56E7] flex fixed bottom-0 w-full justify-evenly">
                <a className="w-full" href="/home">
                    <div className="text-white p-2 flex flex-col justify-center items-center">

                        <div className="text-lg">
                            <i className="text-2xl icon ion-md-home"></i>
                        </div>
                        <div className="text-sm">
                            <span>HOME</span>
                        </div>
                    </div>
                </a>

                <a className="w-full" href="/form">
                    <div className="text-white p-2 flex flex-col justify-center items-center">
                        <div>
                            <i className="text-2xl icon ion-md-document"></i>
                        </div>
                        <div className="text-sm">
                            <span>FORM</span>
                        </div>
                    </div>
                </a>
                
                <a className="w-full flex justify-center items-center" href="/profile">
                    <div className="text-[#3A56E7] bg-white p-2 flex flex-col justify-center items-center rounded-full w-[75px] absolute top-[-30px] border-4 border-[#3A56E7]">
                        <div>
                            <i className="text-2xl icon ion-md-person"></i>
                        </div>
                        <div className="text-sm">
                            <span>PROFILE</span>
                        </div>
                    </div>
                </a>
            </div>
        </>
    )
}

export default Profile;