import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';

const Home = () => {
    const navigate = useNavigate();
    const [ getDataUser, setDataUser ] = useState({});
    const [ getInformation, setInformation ] = useState({});

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
        if (getDataUser.information) return setInformation(getDataUser.information);
    }, [ getDataUser ]);

    return (
        <>
            <div className="bg-[#3A56E7] rounded-b-3xl">
                <div className="flex justify-center py-8">
                    <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                </div>

                <div className="flex flex-col items-center justify-center pb-32">
                    <div className="flex">
                        <div className="rounded-full bg-white border-4">
                            <img className="w-20 h-20 rounded-full border-[3px] border-[#3A56E7]" src={ getDataUser.photo } alt="profile" />
                        </div>
                    </div>

                    <div className="text-center text-white py-2">
                        <h4 className="text-lg">{ getDataUser.nama }</h4>
                        <p className="text-sm">{ getDataUser.kelas }</p>
                    </div>
                </div>
            </div>

            <div className="w-[350px] bg-[#EFEFEF] rounded-xl absolute top-[280px] left-[50%] translate-x-[-50%]">
                <div className="text-center py-8">
                    <h2 className="text-xl font-bold text-[#3A56E7]">KETERANGAN { getDataUser.type }</h2>
                    <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg m-auto"></div>
                </div>
                <div className="flex justify-evenly items-center pb-10">
                    <div className="flex items-center justify-center flex-col">
                        <h4 className="text-sm font-semibold text-[#3A56E7]">HADIR</h4>
                        <h1 className="text-4xl font-bold text-[#9498AD]">{ getInformation.hadir }</h1>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <h4 className="text-sm font-semibold text-[#3A56E7]">IZIN</h4>
                        <h1 className="text-4xl font-bold text-[#9498AD]">{ getInformation.izin }</h1>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <h4 className="text-sm font-semibold text-[#3A56E7]">ALPHA</h4>
                        <h1 className="text-4xl font-bold text-[#9498AD]">{ getInformation.alpha }</h1>
                    </div>
                </div>
            </div>

            <div className="w-[350px] bg-[#EFEFEF] rounded-xl absolute top-[480px] left-[50%] translate-x-[-50%]">
                <div className="flex justify-evenly items-center py-10">
                    <div className="flex items-center justify-center flex-col">
                        <h4 className="text-sm font-semibold text-[#3A56E7]">TOTAL</h4>
                        <h1 className="text-4xl font-bold text-[#9498AD]">{ getInformation.hadir + getInformation.izin + getInformation.alpha || 0 }</h1>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <h4 className="text-sm font-semibold text-[#3A56E7]">PERSENTASE</h4>
                        <h1 className="text-4xl font-bold text-[#9498AD]">{ isNaN((getInformation.hadir / (getInformation.hadir + getInformation.izin + getInformation.alpha) * 100)) ? '0' : parseInt((getInformation.hadir / (getInformation.hadir + getInformation.izin + getInformation.alpha) * 100)) }%</h1>
                    </div>
                </div>
            </div>

            <div className="bg-[#3A56E7] flex fixed bottom-0 w-full justify-evenly">
                <a className="w-full flex justify-center items-center" href="/home">
                    <div className="text-[#3A56E7] bg-white p-2 flex flex-col justify-center items-center rounded-full w-[75px] absolute top-[-30px] border-4 border-[#3A56E7]">
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
                
                <a className="w-full" href="/profile">
                    <div className="text-white p-2 flex flex-col justify-center items-center">
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

export default Home;