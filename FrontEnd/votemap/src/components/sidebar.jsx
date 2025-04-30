import { useState } from 'react';
import '../App.css'

function Sidebar({setIndex, role}) {

    const [clicked, setClicked] = useState(0)

    const menuItems = [
        "Manajemen Akun Admin Provinsi",
        "Manajemen Akun Admin Kabupaten",
        "Manajemen Akun Admin Kecamatan",
        "Manajemen Akun Admin Kelurahan",
        "Manajemen Akun Petugas",
        "Manajemen Data TPS",
        "Manajemen Data DPT",
        "Rekapitulasi Suara Masuk",
      ];

    return (
        <div className='sidebar' style={{width : '20vw'}}>
            <ul className="sidebar-menu">
                {menuItems.map((item, index) => {
                    if (role == "national") {
                        
                    return <li className={clicked == index? "sidebar-item active" : "sidebar-item"} key={index} onClick={() => {
                        setClicked(index);
                        setIndex(index);
                    }}>
                                {item}
                           </li>
                    } else if(role == "province" && index !== 0) {

                    return <li className={clicked == index? "sidebar-item active" : "sidebar-item"} key={index} onClick={() => {
                        setClicked(index);
                        setIndex(index);
                    }}>
                                {item}
                           </li>

                    }
                })}
            </ul>
        </div>
    )
}

export default Sidebar;