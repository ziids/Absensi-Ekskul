import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import env from '../../vite.env.development';

const Form = () => {
    const navigate = useNavigate();
    const [ getDataUser, setDataUser ] = useState({});
    const [ getKehadiran, setKehadiran ] = useState("");
    const [ getTokenKehadiran, setTokenKehadiran ] = useState(["", "", "", "", ""]);
    const [ getMessage, setMessage ] = useState("");

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };
    
    const toToken = (e) => {
        let value = e.target.value;
        let index = parseInt(e.target.attributes.number.value);

        const update = [...getTokenKehadiran];
        update[index] = value;
        setTokenKehadiran(update);
    }

    const handleKeyDown = (e) => {
        e.preventDefault();
        const key = e.key;
        const index = parseInt(e.target.attributes.number.value);
        
        if (key == "Backspace") {
            document.querySelector(`input[number="${index}"]`).value = "";
            const update = [...getTokenKehadiran];
            update[index] = document.querySelector(`input[number="${index}"]`).value;
            setTokenKehadiran(update);

            index == 0 ? "" : document.querySelector(`input[number="${index - 1}"]`).focus();
        } else if (/^[a-zA-Z0-9]$/.test(key)) {
            document.querySelector(`input[number="${index}"]`).value = key.toUpperCase();
            const update = [...getTokenKehadiran];
            update[index] = document.querySelector(`input[number="${index}"]`).value;
            setTokenKehadiran(update);

            index == 4 ? "" : document.querySelector(`input[number="${index + 1}"]`).focus();
        }
    }

    console.log(getTokenKehadiran)

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

    const submitAbsen = () => {
        axios({
            method: "POST",
            url: `${env.API_URL}/api/token`,
            data: { 'token': localStorage.getItem('token') },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.absensi == true) return setMessage('* You Have Taken Attendance!');
            if (getKehadiran === "hadir") {
                const isAllFilled = getTokenKehadiran.every(element => element !== "");
                if (isAllFilled) {
                    const sentence = getTokenKehadiran.join("");
                    axios({
                        method: "POST",
                        url: `${env.API_URL}/api/absen/user`,
                        data: { 'tokenId': localStorage.getItem('token'), 'tokenAbsen': sentence, 'keterangan': "hadir" },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).then(({ data }) => {
                        if (data.message == 'successfully!') return navigate('/home');
                        if (data.message == 'invalid attendance token!') return setMessage('* Invalid Token');
                        if (data.message == 'attendance is not available!') return setMessage('* Attendance session not available!');
                        if (data.message == "You've taken attendance!") return setMessage("* You've taken attendance!")
                        if (data.message == 'nis not registered!') {
                            localStorage.removeItem('token');
                            return navigate('/signup');
                        }
                    }).catch((err) => {
                        navigate('/error');
                    });
                } else {
                    setMessage("* Fill the token first!");
                }
            } else if (getKehadiran === "izin") {
                axios({
                    method: "POST",
                    url: `${env.API_URL}/api/absen/user`,
                    data: { 'tokenId': localStorage.getItem('token'), 'keterangan': "izin" },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(({ data }) => {
                    if (data.message == 'successfully!') return navigate('/home');
                    if (data.message == 'invalid attendance token!') return setMessage('* Invalid Token');
                    if (data.message == "You've taken attendance!") return setMessage("* You've taken attendance!");
                    if (data.message == "attendance is not available!") return setMessage('* Attendance session not available!');
                    if (data.message == 'nis not registered!') {
                        localStorage.removeItem('token');
                        return navigate('/signup');
                    }
                }).catch((err) => {
                    navigate('/error');
                });
            } else {
                setMessage('* Please Choose First')
            }
        }).catch((err) => {
            navigate('/error');
        });
    }

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
                <div className="text-center pt-8 pb-3">
                    <h2 className="text-xl font-bold text-[#3A56E7]">FORM ABSENSI</h2>
                    <div className="w-[50px] h-1 bg-[#3A56E7] rounded-lg m-auto"></div>
                </div>
                <div className="flex justify-evenly flex-col">
                    
                    <div className="w-full flex flex-col px-7 pb-2">
                        <label className="text-[#3A56E7] font-bold mt-3 pb-2" htmlFor="keterangan">KEHADIRAN : </label>
                        <select defaultValue={"none"} className="bg-white py-2 px-3 rounded-lg border-[3px] border-[#3A56E7] text-[#9498AD]" name="keterangan" id="keterangan" onChange={(event) => setKehadiran(event.target.value)}>
                            <option disabled value="none">--- Silahkan Pilih ---</option>
                            <option value="izin">IZIN</option>
                            <option value="hadir">HADIR</option>
                        </select>
                    </div>

                    <div className={getKehadiran == 'hadir' ? '' : 'hidden'}>
                        <div className="px-7 py-2">
                            <h3 className="text-[#3A56E7] font-bold">TOKEN : </h3>
                        </div>

                        <div className="flex justify-evenly items-center px-5 w-full">
                            <input className="text-center w-[20%] h-[50px] mx-2 border-2 rounded-lg border-[#3A56E7] bg-white" type="text" placeholder="X" maxLength="1" number="0" onInput={ toInputUppercase } onChange={ toToken } onKeyDown={ handleKeyDown } />
                            <input className="text-center w-[20%] h-[50px] mx-2 border-2 rounded-lg border-[#3A56E7] bg-white" type="text" placeholder="X" maxLength="1" number="1" onInput={ toInputUppercase } onChange={ toToken } onKeyDown={ handleKeyDown } />
                            <input className="text-center w-[20%] h-[50px] mx-2 border-2 rounded-lg border-[#3A56E7] bg-white" type="text" placeholder="X" maxLength="1" number="2" onInput={ toInputUppercase } onChange={ toToken } onKeyDown={ handleKeyDown } />
                            <input className="text-center w-[20%] h-[50px] mx-2 border-2 rounded-lg border-[#3A56E7] bg-white" type="text" placeholder="X" maxLength="1" number="3" onInput={ toInputUppercase } onChange={ toToken } onKeyDown={ handleKeyDown } />
                            <input className="text-center w-[20%] h-[50px] mx-2 border-2 rounded-lg border-[#3A56E7] bg-white" type="text" placeholder="X" maxLength="1" number="4" onInput={ toInputUppercase } onChange={ toToken } onKeyDown={ handleKeyDown } />
                        </div>
                    </div>

                    <span className={`px-7 pt-2 text-red-600 ${getMessage ? '' : 'hidden'}`}>{ getMessage }</span>

                    <div className="flex items-center justify-center py-6">
                        <button className="bg-[#3A56E7] py-2 px-4 rounded-lg text-white" type="submit" onClick={ submitAbsen }>SUBMIT</button>
                    </div>
                </div>
            </div>

            <div className="bg-[#3A56E7] flex fixed bottom-0 w-full justify-evenly">
                <a className="w-full" href="/home">
                    <div className="text-white p-2 flex flex-col justify-center items-center">
                        <div>
                            <i className="text-2xl icon ion-md-home"></i>
                        </div>
                        <div className="text-sm">
                            <span>HOME</span>
                        </div>
                    </div>
                </a>

                <a className="w-full flex justify-center items-center" href="/form">
                    <div className="text-[#3A56E7] bg-white p-2 flex flex-col justify-center items-center rounded-full w-[75px] absolute top-[-30px] border-4 border-[#3A56E7]">
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

export default Form;