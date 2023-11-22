import axios, { Axios } from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';
import DOMPurify from 'dompurify';

const Signup = () => {
    const navigate = useNavigate();
    const [ getSeePassword, setSeePassword ] = useState(false);

    const [ getMessage, setMessage ] = useState('');

    const [ getNis, setNis ] = useState('');
    const [ getNama, setNama ] = useState('');
    const [ getKelas, setKelas ] = useState('');
    const [ getEmail, setEmail ] = useState('');
    const [ getPassword, setPassword ] = useState('');
    const [ getType, setType ] = useState('');

    const [ getOptionKelas, setOptionKelas ] = useState('<option>PLEASE REFRESH PAGE!</option>');
    const [ getOptionNis, setOptionNis ] = useState('<option>--- Silahkan Pilih Kelas ---</option>');

    useEffect(() => {
        if (localStorage.hasOwnProperty('token')) {
            axios({
                method: "POST",
                url: `${env.API_URL}/api/token`,
                data: { 'token': localStorage.getItem('token') },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(({ data }) => {
                if (data.message == 'successfully!') return navigate('/home');
                if (data.message == 'nis not registered!') return localStorage.removeItem('token');
            }).catch(() => {
                navigate('/error');
            });
        }
        ApiCheckKelas();
    }, []);

    const submitSignUp = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/signup`,
            data: {
                'nis': getNis,
                'nama': getNama,
                'kelas': getKelas,
                'email': getEmail,
                'password': getPassword,
                'type': getType
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == 'incomplete data!') return setMessage('* Enter the data completely!');
            if (data.message == 'email or nis already registered!') return setMessage('* Email or NIS Already Registered!');
            if (data.message == 'successfully!') return navigate('/signin');
        }).catch((err) => {
            navigate('/error');
        });
    }

    const ApiCheckKelas = () => {
        axios.get(`${env.API_URL}/api/kelas`).then((response) => {
            return setOptionKelas(response.data);
        }).catch((e) => {
            return setOptionKelas("<option>--- ERROR ---</option>");
        });
    }

    useEffect(() => {
        axios.get(`${env.API_URL}/api/nis?kelas=${getKelas}`).then((response) => {
            return setOptionNis(response.data);
        }).catch((e) => {
            return setOptionNis("<option>--- ERROR ---</option>");
        });
    }, [ getKelas ]);

    useEffect(() => {
        axios.get(`${env.API_URL}/api/nama?nis=${getNis}`).then((response) => {
            return setNama(response.data);
        }).catch((e) => {
            return setNama("<option>--- ERROR ---</option>");
        });
    }, [ getNis ]);

    return (
        <>
            <div className="h-[50vh] bg-[#3A56E7] rounded-b-3xl flex flex-col items-center">

                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <div className="py-5 text-center">
                        <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                    </div>

                    <div className="bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg">
                    
                        <div className="flex flex-col justify-center items-center py-2">
                            <h2 className="text-xl font-bold text-[#3A56E7]">SIGN UP</h2>
                            <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg"></div>
                        </div>

                        <div className="mt-3">

                            <div className="w-full flex flex-col">
                                <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="type">TYPE : </label>
                                <select defaultValue="" className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" id="type" name="type" onChange={(event) => setType(event.target.value)}>
                                    <option value="" disabled>--- Silahkan Pilih ---</option>
                                    <option value="SISWA">SISWA</option>
                                    <option value="PENGAJAR">PENGAJAR</option>
                                </select>
                            </div>

                            <div className="w-full flex flex-col">
                                <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="kelas">KELAS : </label>
                                <select className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" id="kelas" name="kelas" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getOptionKelas) }} onChange={(event) => setKelas(event.target.value)}></select>
                            </div>

                            <div className="w-full flex flex-col">
                                <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="nis">NIS : </label>
                                <select className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" id="nis" name="nis" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getOptionNis) }} onChange={(event) => setNis(event.target.value)}></select>
                            </div>

                            <div className="w-full flex flex-col">
                                <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="nama">NAMA : </label>
                                <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD] bg-white" id="nama" type="text" name="nama" value={ getNama ? getNama : '--- Silahkan Pilih NIS ---'} disabled />
                            </div>

                            <div className="w-full flex flex-col">
                                <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="email">EMAIL : </label>
                                <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type="email" name="email" id="email" placeholder="user@gmail.com" autoComplete='false' onChange={(event) => setEmail(event.target.value)} required />
                            </div>

                            <div className="w-full flex flex-col">
                                <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="password">PASSWORD : </label>
                                <input className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" type={ getSeePassword ? 'text' : 'password' } name="password" id="password" placeholder="••••••••" onChange={(event) => setPassword(event.target.value)} required />
                                <div className="relative top-[-38px]">
                                <button className={`text-[#9498AD] absolute right-4 ${getSeePassword ? 'hidden' : ''}`} onClick={() => setSeePassword(true)} id="see" type="button"><i className="text-2xl icon ion-md-eye"></i></button>
                                    <button className={`text-[#9498AD] absolute right-4 ${getSeePassword ? '' : 'hidden'}`} onClick={() => setSeePassword(false)} id="unsee" type="button"><i className="text-2xl icon ion-md-eye-off"></i></button>
                                </div>
                            </div>

                            <span className={`text-red-600 ${getMessage ? '' : 'hidden'}`}>{ getMessage }</span>

                            <div className="flex items-center justify-between mt-5">
                                <div className="text-[#3A56E7]">
                                    <a href="/signin">SUDAH PUNYA AKUN?</a>
                                </div>
                                <div className="text-white">
                                    <button className="bg-[#3A56E7] py-2 px-4 rounded-lg" type="submit" onClick={ submitSignUp }>SUBMIT</button>
                                </div>
                            </div>
                        </div>
                    
                    </div>

                </div>
            </div>
        </>
    )
}

export default Signup;