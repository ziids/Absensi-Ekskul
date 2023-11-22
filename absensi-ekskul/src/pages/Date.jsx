import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; 
import axios from 'axios';
import env from '../../vite.env.development';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { tab, tabsHeader } from "@material-tailwind/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Date = () => {
    const [ getSearch, setSearch ] = useState("");
    const [ getDataSearch, setDataSearch ] = useState([]);

    const [ getChart, setChart ] = useState({
        labels: [],
        datasets: [],
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart Kehadiran',
            },
        },
    };

    useEffect(() => {
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/date`,
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

    useEffect(() => {
        axios({
            method: "POST",
            url: `${env.API_URL}/api/admin/absen/chart`,
            data: {
                'token': localStorage.getItem("token"),
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            if (data.message == 'incomplete data!') return;
            if (data.message == "you're not an admin!") {
                localStorage.removeItem('token');
                return navigate('/');
            }

            const chartData = {
                labels: data.dates, // 'dates' from your API response
                datasets: [
                    {
                        label: 'Hadir',
                        backgroundColor: 'green',
                        data: data.data.map((entry) => entry.absen),
                    },
                    {
                        label: 'Izin',
                        backgroundColor: 'blue',
                        data: data.data.map((entry) => entry.izin),
                    },
                    {
                        label: 'Alpha',
                        backgroundColor: 'red',
                        data: data.data.map((entry) => entry.alpha),
                    },
                ],
            };

            return setChart(chartData);
        }).catch(() => {
            navigate('/error');
        });
    }, []);



    return(
        <>
            <div className="bg-[#3A56E7] rounded-b-3xl">
                <div className="p-8 text-center">
                    <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                </div>
                <div className="flex flex-col px-10 pb-10 pt-2">
                    <label htmlFor="search" className="text-white font-bold mt-3 pb-2">CARI TANGGAL :</label>
                    <input className="flex-2 rounded-lg p-4 border-2 border-[#3A56E7] drop-shadow-lg" type="text" name="search" id="search" placeholder="TANGGAL, BULAN, TAHUN" onChange={(event) => setSearch(event.target.value) } />
                </div>
            </div>

            <div className="px-6 pt-6 pb-24">
                <div className="bg-[#EFEFEF] flex p-4 rounded-xl drop-shadow-lg justify-between items-center my-4">
                    <Bar className="w-[100%]" options={ options } data={ getChart } />
                </div>

                {
                    getDataSearch.map((items, index) => {
                        // let data = items.absen.length == 0 ? [{ "no": "1", "nis": "", "nama": "", "kelas": "", "type": "" }] : items.absen.map(({ _id, ...rest }, index) => ({ no: (index + 1).toString(), ...rest }));
                        let data = [{'nis': '118103383', 'nama': 'Jessica Jones', 'kelas': 'X', 'type': 'siswa', '_id': '41'}, {'nis': '641553688', 'nama': 'Jane Doe', 'kelas': 'XII', 'type': 'siswa', '_id': '45'}, {'nis': '816526199', 'nama': 'John Doe', 'kelas': 'XI', 'type': 'guru', '_id': '23'}, {'nis': '947185299', 'nama': 'John Doe', 'kelas': 'XII', 'type': 'guru', '_id': '27'}, {'nis': '246786391', 'nama': 'Zachariah Smith', 'kelas': 'XII', 'type': 'guru', '_id': '7'}, {'nis': '918565775', 'nama': 'Peter Parker', 'kelas': 'XI', 'type': 'guru', '_id': '27'}, {'nis': '644013241', 'nama': 'Jane Doe', 'kelas': 'X', 'type': 'siswa', '_id': '13'}, {'nis': '140809515', 'nama': 'Jessica Jones', 'kelas': 'X', 'type': 'guru', '_id': '40'}, {'nis': '912343087', 'nama': 'Jane Doe', 'kelas': 'XII', 'type': 'siswa', '_id': '35'}, {'nis': '478890732', 'nama': 'Zachariah Smith', 'kelas': 'X', 'type': 'guru', '_id': '10'}, {'nis': '718345520', 'nama': 'John Doe', 'kelas': 'X', 'type': 'guru', '_id': '24'}, {'nis': '619730850', 'nama': 'John Doe', 'kelas': 'X', 'type': 'siswa', '_id': '25'}, {'nis': '258245674', 'nama': 'Jessica Jones', 'kelas': 'XII', 'type': 'guru', '_id': '44'}, {'nis': '333839942', 'nama': 'John Doe', 'kelas': 'XII', 'type': 'guru', '_id': '33'}, {'nis': '879013917', 'nama': 'Zachariah Smith', 'kelas': 'X', 'type': 'siswa', '_id': '43'}, {'nis': '190088356', 'nama': 'Jane Doe', 'kelas': 'X', 'type': 'siswa', '_id': '49'}, {'nis': '160707243', 'nama': 'Peter Parker', 'kelas': 'XII', 'type': 'siswa', '_id': '5'}, {'nis': '425528827', 'nama': 'Jane Doe', 'kelas': 'XII', 'type': 'siswa', '_id': '5'}, {'nis': '572358209', 'nama': 'Zachariah Smith', 'kelas': 'XII', 'type': 'guru', '_id': '31'}, {'nis': '710647324', 'nama': 'John Doe', 'kelas': 'XII', 'type': 'siswa', '_id': '19'}, {'nis': '777048338', 'nama': 'John Doe', 'kelas': 'XII', 'type': 'guru', '_id': '25'}, {'nis': '391271102', 'nama': 'John Doe', 'kelas': 'XI', 'type': 'guru', '_id': '28'}, {'nis': '764624705', 'nama': 'Peter Parker', 'kelas': 'X', 'type': 'guru', '_id': '29'}, {'nis': '212951501', 'nama': 'Peter Parker', 'kelas': 'X', 'type': 'siswa', '_id': '47'}, {'nis': '111213970', 'nama': 'Jessica Jones', 'kelas': 'XI', 'type': 'guru', '_id': '4'}, {'nis': '935235447', 'nama': 'Jessica Jones', 'kelas': 'XI', 'type': 'guru', '_id': '14'}, {'nis': '174654849', 'nama': 'Jane Doe', 'kelas': 'XI', 'type': 'siswa', '_id': '16'}, {'nis': '343920741', 'nama': 'Peter Parker', 'kelas': 'XI', 'type': 'siswa', '_id': '14'}, {'nis': '516950043', 'nama': 'Peter Parker', 'kelas': 'X', 'type': 'siswa', '_id': '48'}, {'nis': '685643382', 'nama': 'Peter Parker', 'kelas': 'X', 'type': 'guru', '_id': '40'}, {'nis': '529765012', 'nama': 'John Doe', 'kelas': 'XI', 'type': 'siswa', '_id': '4'}, {'nis': '737049980', 'nama': 'John Doe', 'kelas': 'X', 'type': 'siswa', '_id': '27'}, {'nis': '961681899', 'nama': 'Peter Parker', 'kelas': 'XII', 'type': 'siswa', '_id': '18'}, {'nis': '664761558', 'nama': 'Zachariah Smith', 'kelas': 'XII', 'type': 'siswa', '_id': '28'}, {'nis': '161909514', 'nama': 'Jessica Jones', 'kelas': 'XI', 'type': 'siswa', '_id': '50'}, {'nis': '915282617', 'nama': 'Peter Parker', 'kelas': 'XI', 'type': 'guru', '_id': '14'}, {'nis': '753833950', 'nama': 'John Doe', 'kelas': 'XII', 'type': 'siswa', '_id': '42'}, {'nis': '413686019', 'nama': 'Peter Parker', 'kelas': 'XI', 'type': 'guru', '_id': '16'}, {'nis': '619689986', 'nama': 'John Doe', 'kelas': 'X', 'type': 'guru', '_id': '21'}, {'nis': '113245077', 'nama': 'John Doe', 'kelas': 'XII', 'type': 'guru', '_id': '17'}, {'nis': '553977613', 'nama': 'Jessica Jones', 'kelas': 'X', 'type': 'guru', '_id': '6'}, {'nis': '408440834', 'nama': 'Peter Parker', 'kelas': 'XII', 'type': 'siswa', '_id': '15'}, {'nis': '684841783', 'nama': 'Jane Doe', 'kelas': 'X', 'type': 'guru', '_id': '34'}, {'nis': '346738111', 'nama': 'Zachariah Smith', 'kelas': 'XI', 'type': 'guru', '_id': '1'}, {'nis': '141012630', 'nama': 'Zachariah Smith', 'kelas': 'XII', 'type': 'guru', '_id': '5'}, {'nis': '540287043', 'nama': 'Zachariah Smith', 'kelas': 'XI', 'type': 'siswa', '_id': '33'}, {'nis': '324944806', 'nama': 'Jane Doe', 'kelas': 'XII', 'type': 'siswa', '_id': '28'}, {'nis': '732741762', 'nama': 'Jessica Jones', 'kelas': 'XI', 'type': 'guru', '_id': '4'}, {'nis': '247757350', 'nama': 'Peter Parker', 'kelas': 'XI', 'type': 'guru', '_id': '44'}, {'nis': '106382260', 'nama': 'Zachariah Smith', 'kelas': 'XI', 'type': 'guru', '_id': '3'}]

                        let json = data;

                        var fields = Object.keys(json[0]);
                        var replacer = function(key, value) { return value === null ? '' : value } 
                        var csv = json.map(function(row){
                            return fields.map(function(fieldName) {
                                return JSON.stringify(row[fieldName], replacer);
                            }).join(',');
                        })
                        csv.unshift(fields.join(','))
                        csv = csv.join('\r\n');
                        const file = new Blob([csv], { type: 'text/plain' });

                        const generatePDF = () => {
                            const doc = new jsPDF();
                            
                            const columns = Object.keys(json[0]);
                            const item = json.map((row) => Object.values(row));

                            const width = doc.internal.pageSize.getWidth();

                            doc.setLineWidth(2);
                            doc.setDrawColor(58, 86, 231);

                            function addHeader() {
                                doc.addImage('https://cdn.discordapp.com/attachments/858321432178196490/1171836262408278056/absensi-ekskul.png', 'PNG', 8, 3, 25, 25).setFontSize(15);
                                doc.text("WEB ABSENSI", 33, 12).setFontSize(12);
                                doc.text('"Modernisasi dalam bidang pendidikan"', 33, 18).setFontSize(10);
                                doc.text('Email : my.absensiekskul@gmail.com | Github : https://github.com/DrelezTM/WebAbsensi', 33, 23);
                                doc.line(12, 28, width - 12, 28);
                            }

                            function addFooter(number) {
                                doc.line(12, 270, width - 12, 270);
                                doc.text(number.toString(), width-25, 285);
                                doc.text(`${(items.getDate).padStart(2, '0')}/${(items.getMonthInt).padStart(2, '0')}/${(items.getYear).padStart(4, '0')}`, 25, 285);
                            }
                            
                            addHeader();
                            addFooter(1);

                            let hadirYPos = 34;
                            doc.setFontSize(10);
                            doc.text(`DAFTAR KEHADIRAN SISWA ${(env.NAMA_EKSKUL).toUpperCase()}`, width / 2, 37, { align: 'center' });

                            doc.autoTable({
                              head: [ columns ],
                              body: item,
                              margin: { top: 42, bottom: 34 },
                              didParseCell: function (data) {
                                if (data.section === 'head') {
                                    data.cell.styles.fillColor = [58, 86, 231];
                                    data.cell.styles.textColor = [255, 255, 255];
                                    data.cell.styles.halign = 'center';
                                    data.cell.text[0] = data.cell.text[0].toUpperCase();
                                } else if (data.section === 'body' && data.column.index === 0 && !isNaN(data.cell.raw)) {
                                    data.cell.styles.halign = 'center';
                                }
                                data.cell.styles.lineWidth = 0.5;
                              },
                              didDrawPage: function (data) {
                                hadirYPos = data.cursor.y + 10;
                              }
                            });

                            doc.text("Mengetahui,", width-55, hadirYPos + 5);
                            doc.text("Guru Presensi", width-55, hadirYPos + 10);
                            doc.text("(......................)", width-55, hadirYPos + 35);
                            
                            for (let i = 1; i < doc.getNumberOfPages(); i++) {
                                addFooter((i+1).toString());
                                doc.setPage(i+1);
                                addHeader();
                            }

                            doc.save(items.date.split("/").join("-") + ".pdf");
                        };

                        return (
                            <div className="bg-[#EFEFEF] flex p-4 rounded-xl drop-shadow-lg justify-between items-center my-4" key={ index }>
                                <div className="flex justify-start">
                                    <div className="w-14 text-[#9498AD] flex justify-center items-center">
                                        <i className="text-5xl icon ion-md-document"></i>
                                    </div>
                                    <div className="flex justify-center  flex-col px-3">
                                        <div className="text-lg text-[#3A56E7] font-bold">
                                            <h3>{ (items.getMonthStr).toUpperCase() }</h3>
                                        </div>
                                        <div className="text-xs text-[#9498AD] font-bold">
                                            <p>{ (items.getDay).toUpperCase() }, { items.getDate }/{ items.getMonthInt }/{ items.getYear }</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center justify-center">
                                    <a className="w-12 h-12 text-[#3A56E7] flex flex-col justify-center items-center cursor-pointer" rel="noreferrer" onClick={ generatePDF }>
                                        <i className="text-3xl icon ion-md-download"></i>
                                        <p className="text-xs">PDF</p>
                                    </a>
                                    <a className="w-12 h-12 text-[#3A56E7] flex flex-col justify-center items-center cursor-pointer" download={ items.date.split("/").join("-") + ".csv" } rel="noreferrer" href={  URL.createObjectURL(file) }>
                                        <i className="text-3xl icon ion-md-download"></i>
                                        <p className="text-xs">CSV</p>
                                    </a>
                                </div>
                            </div>
                        )
                    })
                } 
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
                
                <a className="w-full flex justify-center items-center" href="/date">
                    <div className="text-[#3A56E7] bg-white p-2 flex flex-col justify-center items-center rounded-full w-[75px] absolute top-[-30px] border-4 border-[#3A56E7]">
                        <div className="text-lg">
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

export default Date;