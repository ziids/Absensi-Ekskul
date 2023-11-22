import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [ getEmail, setEmail ] = useState("");
    const [ getNewPassword, setNewPassword ] = useState("");
    const [ getConfirmPassword, setConfirmPassword ] = useState("");
    const [ getTokenReset, setTokenReset ] = useState("");

    const [ getMessage, setMessage ] = useState("");
    const [ getFixEmail, setFixEmail ] = useState("");
    const [ getFixToken, setFixToken ] = useState("");
    const [ getSeeNewPassword, setSeeNewPassword ] = useState("");
    const [ getSeeConfirmPassword, setSeeConfirmPassword ] = useState("");

    const submitToToken = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/password/send`,
            data: {
                'email': getEmail,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == 'incomplete data!') return setMessage('* Enter the data completely!');
            if (data.message == 'email not registered!') return setMessage('* Email is not Registered!');
            if (data.message == 'successfully!') {
                setMessage("* Send Email Successfully");
                return setFixEmail(getEmail);
            }
        }).catch((err) => {
            navigate('/error');
        });
    }

    const submitToReset = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/password/token`,
            data: {
                'email': getFixEmail,
                'token': getTokenReset
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            console.log(data)
            if (data.message == 'incomplete data!') return setMessage('* Enter the data completely!');
            if (data.message == 'token not found!') return setMessage('* Incorrect Token!');
            if (data.message == 'successfully!') {
                setMessage("");
                return setFixToken(getTokenReset);
            }
        }).catch((err) => {
            navigate('/error');
        });
    }

    const submitReset = (e) => {
        e.preventDefault();
        if (!(getNewPassword === getConfirmPassword)) return setMessage("* Password doesn't match");
        axios({
            method: "POST",
            url: `${env.API_URL}/api/password/reset`,
            data: {
                'email': getFixEmail,
                'tokenReset': getFixToken,
                'newPassword': getNewPassword
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            console.log(data)
            if (data.message == 'incomplete data!') return setMessage('* Enter the data completely!');
            if (data.message == 'email not registered!') return setMessage('* Email is not Registered!');
            if (data.message == 'token not found!') return setMessage('* Incorrect Token!');
            if (data.message == 'successfully!') return navigate('/signin');
        }).catch((err) => {
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
    
                    <div className={`bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg ${ getFixEmail ? 'hidden' : '' }`}>
                        <form action="/forgot" method="POST">
                            <div className="flex flex-col justify-center items-center py-2">
                                <h2 className="text-xl font-bold text-[#3A56E7]">GANTI PASSWORD</h2>
                                <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                            </div>
    
                            <div className="mt-3">
                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="email">EMAIL YANG TERDAFTAR : </label>
                                    <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type="email" name="email" id="email" placeholder="user@gmail.com" autoComplete="off" required onChange={(event) => setEmail(event.target.value)} />
                                </div>
    
                                <div className="flex flex-col">
                                    <span className={`text-red-600 ${getMessage ? '' : 'hidden'}`}>{ getMessage }</span>
                                </div>
    
                                <div className="flex items-center justify-center mt-5">
                                    <div className="text-white">
                                        <button className="bg-[#3A56E7] py-2 px-4 rounded-lg" type="submit" onClick={ submitToToken }>NEXT</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className={`bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg ${ getFixEmail || getFixToken ? '' : 'hidden' } ${getFixEmail && getFixToken ? 'hidden' : '' }`}>
                        <form action="/forgot" method="POST">
                            <div className="flex flex-col justify-center items-center py-2">
                                <h2 className="text-xl font-bold text-[#3A56E7]">GANTI PASSWORD</h2>
                                <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                            </div>
    
                            <div className="mt-3">
                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="token">TOKEN : </label>
                                    <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type="text" name="token" id="token" placeholder="XXXXXX" required onChange={(event) => setTokenReset(event.target.value)} />
                                </div>
    
                                <div className="flex flex-col">
                                    <span className="text-[#9498AD]">*Cek folder sampah jika kode verifikasi tidak ditemukan atau bisa kirim ulang kode verisifikasi dengan memencet tombol “Kirim Ulang”</span>
                                    <span className={`text-red-600 ${getMessage ? '' : 'hidden'}`}>{ getMessage }</span>
                                </div>
    
                                <div className="flex items-center justify-between mt-5">
                                    <div>
                                        <button className="text-[#3A56E7] py-2 px-4" type="submit" onClick={ submitToToken }>KIRIM ULANG</button>
                                    </div>
                                    <div className="text-white">
                                        <button className="bg-[#3A56E7] py-2 px-4 rounded-lg" type="submit" onClick={ submitToReset }>NEXT</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className={`bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg ${ getFixEmail && getFixToken ? '' : 'hidden' }`}>
                        <form action="/forgot" method="POST">
                            <div className="flex flex-col justify-center items-center py-2">
                                <h2 className="text-xl font-bold text-[#3A56E7]">GANTI PASSWORD</h2>
                                <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                            </div>
    
                            <div className="mt-3">
                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="newpassword">NEW PASSWORD : </label>
                                    <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type={ getSeeNewPassword ? 'text' : 'password' } name="newpassword" id="newpassword" placeholder="••••••••" onChange={(event) => setNewPassword(event.target.value)} required />
                                    <div className="relative top-[-38px]">
                                        <button className={`text-[#9498AD] absolute right-4 ${getSeeNewPassword ? 'hidden' : ''}`} onClick={() => setSeeNewPassword(true)} type="button"><i className="text-2xl icon ion-md-eye"></i></button>
                                        <button className={`text-[#9498AD] absolute right-4 ${getSeeNewPassword ? '' : 'hidden'}`} onClick={() => setSeeNewPassword(false)} type="button"><i className="text-2xl icon ion-md-eye-off"></i></button>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="confirmpassword">CONFIRM PASSWORD : </label>
                                    <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type={ getSeeConfirmPassword ? 'text' : 'password' } name="confirmpassword" id="confirmpassword" placeholder="••••••••" onChange={(event) => setConfirmPassword(event.target.value)} required />
                                    <div className="relative top-[-38px]">
                                        <button className={`text-[#9498AD] absolute right-4 ${getSeeConfirmPassword ? 'hidden' : ''}`} onClick={() => setSeeConfirmPassword(true)} type="button"><i className="text-2xl icon ion-md-eye"></i></button>
                                        <button className={`text-[#9498AD] absolute right-4 ${getSeeConfirmPassword ? '' : 'hidden'}`} onClick={() => setSeeConfirmPassword(false)} type="button"><i className="text-2xl icon ion-md-eye-off"></i></button>
                                    </div>
                                </div>
    
                                <div className="flex flex-col">
                                    <span className={`text-red-600 ${getMessage ? '' : 'hidden'}`}>{ getMessage }</span>
                                </div>
    
                                <div className="flex items-center justify-center mt-5">
                                    <div className="text-white">
                                        <button className="bg-[#3A56E7] py-2 px-4 rounded-lg" type="submit" onClick={ submitReset }>SUBMIT</button>
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

export default ResetPassword;