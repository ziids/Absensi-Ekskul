import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import env from '../../vite.env.development';

const AccordionItem = (props) => {
    const contentEl = useRef();
    const { handleToggle, active, items } = props;
    const { photo, nama, kelas, nis, information } = items;
    const { hadir, izin, alpha } = information;

    const total = hadir + izin + alpha;
    const persentase = (hadir / total) * 100;

    return(
        <div className="my-4 bg-[#EFEFEF] p-4 rounded-xl drop-shadow-lg">
            <button className="flex justify-between items-center w-full" onClick={() => handleToggle(nis)}>
                <div className="flex justify-start">
                    <div className="h-14 w-14 flex justify-center items-center">
                        <img className="rounded-full border-4 border-[#3A56E7] h-12 w-12" src={`${photo}`} alt="profile" />
                    </div>
                    <div className="flex justify-center  flex-col px-3">
                        <div className="text-lg text-[#3A56E7] font-bold text-left">
                            <h3>{ nama }</h3>
                        </div>
                        <div className="text-xs text-[#9498AD] font-bold text-left">
                            <p>{ nis } <span>•</span> { kelas }</p>
                        </div>
                    </div>
                </div>
                <div className="w-12 h-12 text-[#3A56E7] flex items-center justify-center">
                    <i className={`text-3xl icon ${ active == nis ? 'ion-md-arrow-dropup' : 'ion-md-arrow-dropdown'}`}></i>
                </div>
            </button>
            <div ref={contentEl} className={`text-[#9498AD] pt-4 text-lg ${active === nis ? 'block' : 'hidden'}`}>
                <p><i className="text-[#3A56E7] icon ion-md-return-right mr-2"></i> Hadir: <span className="font-bold">{ hadir }</span></p>
                <p><i className="text-[#3A56E7] icon ion-md-return-right mr-2"></i> Izin: <span className="font-bold">{ izin }</span></p>
                <p><i className="text-[#3A56E7] icon ion-md-return-right mr-2"></i> Alpha: <span className="font-bold">{ alpha }</span></p>
                <p><i className="text-[#3A56E7] icon ion-md-return-right mr-2"></i> Total: <span className="font-bold">{ total }</span></p>
                <p><i className="text-[#3A56E7] icon ion-md-return-right mr-2"></i> Persentase: <span className="font-bold">{ parseInt(isNaN(persentase) ? '0' : persentase) }%</span></p>
            </div>
        </div>
    )
}

const User = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(0);
    const [getSearch, setSearch] = useState("");
    const [getDataSearch, setDataSearch] = useState([]);

    const handleToggle = (nis) => {
        if (active === nis) {
            setActive(null);
        } else {
            setActive(nis);
        }
    }

    useEffect(() => {
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/user`,
            data: {
                'token': localStorage.getItem("token"),
                'search': getSearch
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == 'incomplete data!') return;
            if (data.message == "you're not an admin!") {
                localStorage.removeItem('token');
                return navigate('/');
            }
            return setDataSearch(data);
        }).catch(() => {
            navigate('/error');
        });
    }, [ getSearch ]);

    return(
        <>
            <div className="bg-[#3A56E7] rounded-b-3xl">
                <div className="p-8 text-center">
                    <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                </div>
                <div className="flex flex-col px-10 pb-10 pt-2">
                    <label htmlFor="search" className="text-white font-bold mt-3 pb-2">CARI NAMA MURID :</label>
                    <input className="flex-2 rounded-lg p-4 border-2 border-[#3A56E7] drop-shadow-lg" type="text" name="search" id="search" placeholder="NIS, NAMA, KELAS" onChange={(event) => setSearch(event.target.value) } />
                </div>
            </div>

            <div className="px-6 pt-6 pb-24">
                {getDataSearch.map((items, index) => {
                    return ( <AccordionItem key={items.nis} active={active} handleToggle={() => handleToggle(items.nis)} items={items} /> )
                })}
            </div>

            <div className="bg-[#3A56E7] flex fixed bottom-0 w-full justify-evenly">
                <a className="w-full flex justify-center items-center" href="/user">
                    <div className="text-[#3A56E7] bg-white p-2 flex flex-col justify-center items-center rounded-full w-[75px] absolute top-[-30px] border-4 border-[#3A56E7]">
                        <div className="text-lg">
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
                
                <a className="w-full" href="/settings">
                    <div className="text-white p-2 flex flex-col justify-center items-center">
                        <div>
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

export default User;