import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';
import DOMPurify from 'dompurify';

const Signin = () => {
    const navigate = useNavigate();
    const [ getSeePassword, setSeePassword ] = useState(false);
    const [ getMessage, setMessage ] = useState('');

    const [ getOptionKelas, setOptionKelas ] = useState('<option>PLEASE REFRESH PAGE!</option>');
    const [ getOptionNis, setOptionNis ] = useState('<option>--- Silahkan Pilih Kelas ---</option>');

    const [ getNis, setNis ] = useState('');
    const [ getKelas, setKelas ] = useState('');
    const [ getPassword, setPassword ] = useState('');

    const submitSignIn = (e) => {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${env.API_URL}/api/signin`,
            data: {
                'nis': getNis,
                'password': getPassword
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == 'incomplete data!') return setMessage('* Enter the data completely!');
            if (data.message == 'nis not registered!') return setMessage('* Account is not registered, please signup first')
            if (data.message == 'password does not match!') return setMessage('* Password does not match!');
            if (data.message == 'successfully!') {
                localStorage.setItem('token', data.token);
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
                if (data.message == 'successfully!') return navigate('/home');
                if (data.message == 'nis not registered!') return localStorage.removeItem('token');
            }).catch(() => {
                navigate('/error');
            });
        }
        ApiCheckKelas();
    }, []);

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
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="kelas">KELAS : </label>
                                    <select className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" id="kelas" name="type" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getOptionKelas) }} onChange={(event) => setKelas(event.target.value)}></select>
                                </div>

                                <div className="w-full flex flex-col">
                                    <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="nis">NIS : </label>
                                    <select className="py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" id="nis" name="type" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getOptionNis) }} onChange={(event) => setNis(event.target.value)}></select>
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
                                    <a className="text-xs text-[#3A56E7]" href="/forgot">LUPA PASSWORD?</a>
                                </div>
    
                                <div className="flex items-center justify-between mt-5">
                                    <div className="text-[#3A56E7]">
                                        <a href="/signup">BELUM PUNYA AKUN?</a>
                                    </div>
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