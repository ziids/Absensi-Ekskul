import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';

const Signin = () => {
    const navigate = useNavigate();
    const [ getSeePassword, setSeePassword ] = useState(false);
    const [ getMessage, setMessage ] = useState('');

    const [ getUsername, setUsername ] = useState('');
    const [ getPassword, setPassword ] = useState('');

    const submitSignIn = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/login`,
            data: {
                'username': getUsername,
                'password': getPassword
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == 'incomplete data!') return setMessage('* Enter the data completely!');
            if (data.message == 'invalid username!') return setMessage('* Invalid Username!');
            if (data.message == 'invalid password!') return setMessage('* Invalid Password!');
            if (data.message == 'successfully!') {
                localStorage.setItem('token', data.token);
                return navigate('/user');
            }
        }).catch(() => {
            navigate('/error');
        });
    }

    return (
        <>
            <div className="h-[50vh] bg-[#3A56E7] rounded-b-3xl flex flex-col items-center">
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <div className="py-5 text-center">
                        <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                    </div>
    
                    <div className="bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg">
                        <form action="/signin" method="POST">
                            <div className="flex flex-col justify-center items-center py-2">
                                <h2 className="text-xl font-bold text-[#3A56E7]">SIGN IN</h2>
                                <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                            </div>
    
                            <div className="mt-3">
                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="username">USERNAME : </label>
                                    <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" name="username" id="username" type="text" placeholder="USERNAME" onChange={(event) => setUsername(event.target.value)} required />
                                </div>
    
                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="password">PASSWORD : </label>
                                    <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type={ getSeePassword ? 'text' : 'password' } name="password" id="password" placeholder="••••••••" onChange={(event) => setPassword(event.target.value)} required />
                                    <div className="relative top-[-38px]">
                                        <button className={`text-[#9498AD] absolute right-4 ${getSeePassword ? 'hidden' : ''}`} onClick={() => setSeePassword(true)} id="see" type="button"><i className="text-2xl icon ion-md-eye"></i></button>
                                        <button className={`text-[#9498AD] absolute right-4 ${getSeePassword ? '' : 'hidden'}`} onClick={() => setSeePassword(false)} id="unsee" type="button"><i className="text-2xl icon ion-md-eye-off"></i></button>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className={`text-red-600 ${getMessage ? '' : 'hidden'}`}>{ getMessage }</span>
                                </div>
    
                                <div className="flex items-center justify-between mt-5">
                                    <div className="text-white">
                                        <button className="bg-[#3A56E7] py-2 px-4 rounded-lg" type="submit" onClick={ submitSignIn }>SUBMIT</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signin;