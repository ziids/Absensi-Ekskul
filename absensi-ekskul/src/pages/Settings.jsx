import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';

const Settings = () => {
    const navigate = useNavigate();

    const [ getCondition, setCondition ] = useState(false);
    const [ getToken, setToken ] = useState("");

    const [ countdown, setCountdown ] = useState(null);
    const targetTime = new Date();

    targetTime.setHours(24);
    targetTime.setMinutes(0);
    targetTime.setSeconds(0);

    const timeDifference = targetTime - new Date();

    useEffect(() => {
        if (timeDifference > 0) {
            const interval = setInterval(() => {
                setCountdown(targetTime - new Date());
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        } else {
            setCountdown(0);
        }
    }, [ timeDifference ]);

    const absenAktif = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/absen/on`,
            data: {
                'token': localStorage.token,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == "you're not an admin!") return localStorage.clear();
            if (data.message == "today's attendance has been made!") return;
            if (data.message == 'successfully!') return setCondition(true);
        }).catch(() => {
            navigate('/error');
        });
    }

    const absenNonaktif = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/absen/off`,
            data: {
                'token': localStorage.token,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == "you're not an admin!") return localStorage.clear();
            if (data.message == "attendance has been deactivated!") return;
            if (data.message == 'successfully!') return setCondition(false);
        }).catch(() => {
            navigate('/error');
        });
    }

    const resetToken = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/absen/reset`,
            data: {
                'token': localStorage.token,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == "you're not an admin!") return localStorage.clear();
            if (data.message == 'successfully!') return;
        }).catch(() => {
            navigate('/error');
        });
    }

    const signOut = () => {
        localStorage.clear();
        navigate('/signin');
    }

    const hours = Math.floor((countdown / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((countdown / (1000 * 60)) % 60);
    const seconds = Math.floor((countdown / 1000) % 60);

    useEffect(() => {
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/absen/check`,
            data: {
                'token': localStorage.token,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == "you're not an admin!") return localStorage.clear();
            if (data.message == 'attendance is not available!') return setCondition(false);
            if (data.message == 'successfully!') {
                setToken(data.token);
                return setCondition(true);
            } 
        }).catch(() => {
            navigate('/error');
        });
    });


    return(
        <>
            <div className="bg-[#3A56E7] rounded-b-3xl h-[50vh]">
                <div className="py-20 text-center">
                    <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                </div>
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">

                    <div className={`bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg ${ getCondition ? 'hidden' : '' }`}>
                        <div className="flex flex-col justify-center items-center py-2">
                            <h2 className="text-xl font-bold text-[#3A56E7]">SETTINGS</h2>
                            <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                        </div>

                        <div className="mt-6 flex">
                            <div className="w-full flex flex-col">
                                <h3 className="text-[#3A56E7] font-bold" htmlFor="kelas">SESI ABSEN</h3>
                                <p className="text-[#9498AD] text-xs">UNTUK HARI INI</p>
                            </div>
                            <div className="flex justify-center items-center">
                                <button className="bg-[#3A56E7] text-white px-2 py-1 rounded-lg" onClick={ absenAktif }>NYALAKAN</button>
                            </div>
                        </div>
                    </div>

                    <div className={`bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg ${ getCondition ? '' : 'hidden' }`}>
                        <div className="flex flex-col justify-center items-center py-2">
                            <h2 className="text-xl font-bold text-[#3A56E7]">SETTINGS</h2>
                            <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                        </div>

                        <div className="mt-6 text-center">
                            <div className="w-full flex flex-col">
                                <h3 className="text-[#3A56E7] font-bold" htmlFor="kelas">TOKEN ABSENSI</h3>
                                <h1 className="text-[#9498AD] font-bold text-4xl">{ getToken.split("").join("  ") }</h1>
                            </div>
                            <div className="w-full flex flex-col mt-3">
                                <h3 className="text-[#3A56E7] font-bold" htmlFor="kelas">MASA AKTIF</h3>
                                <h1 className="text-[#9498AD] font-bold text-4xl">{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</h1>
                            </div>
                            <div className="mt-6">
                                <button className="bg-[#3A56E7] text-white px-2 py-1 rounded-lg mx-2" onClick={ resetToken }>RESET TOKEN</button>
                                <button className="bg-[#3A56E7] text-white px-2 py-1 rounded-lg mx-2" onClick={ absenNonaktif }>MATIKAN</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center py-6">
                        <button className="bg-[#3A56E7] text-white px-2 py-1 rounded-lg mx-2" onClick={ signOut }>SIGN OUT</button>
                    </div>
                </div>
            </div>

            <div className="bg-[#3A56E7] flex fixed bottom-0 w-full justify-evenly">
                <a className="w-full" href="/user">
                    <div className="text-white p-2 flex flex-col justify-center items-center">
                        <div>
                            <i className="text-2xl icon ion-md-contact"></i>
                        </div>
                        <div className="text-sm">
                            <span>USER</span>
                        </div>
                    </div>
                </a>
                
                <a className="w-full" href="/date">
                    <div className="text-white p-2 flex flex-col justify-center items-center">
                        <div>
                            <i className="text-2xl icon ion-md-calendar"></i>
                        </div>
                        <div className="text-sm">
                            <span>DATE</span>
                        </div>
                    </div>
                </a>

                <a className="w-full flex justify-center items-center" href="/settings">
                    <div className="text-[#3A56E7] bg-white p-2 flex flex-col justify-center items-center rounded-full w-[75px] absolute top-[-30px] border-4 border-[#3A56E7]">
                        <div className="text-lg">
                            <i className="text-2xl icon ion-md-settings"></i>
                        </div>
                        <div className="text-sm">
                            <span>SETTINGS</span>
                        </div>
                    </div>
                </a>
            </div>
        </>
    )
}

export default Settings;