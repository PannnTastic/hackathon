import ModalShow from '../../components/modal'
import { useEffect, useState } from "react";

function PageAddAdminProv() {

    const [dataAmdmin, setDataAdmin] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function getCookieValue(name) {
        const value = document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="));
        return value ? value.split("=")[1] : null;
    }

    useEffect(() => {
        let token = getCookieValue("token")
        fetch("https://m9crmwsq-8000.asse.devtunnels.ms/admin", {
            headers : {
                Authorization : `beare ${token}`
            }
        }).then(res => res.json())
        .then(data => {
            const filteredData = data
            .filter(item => item.role === 'province')
            .map(item => ({
                idUser : item.idUser,
                nama : item.name,
                email : item.email,
                region : item.region_name
            }));
        setDataAdmin(filteredData);
        })
    }, [])

    return (
        <>
            <h3 className="text-center mt-4 istok-web-bold">Manajemen Akun Admin Provinsi</h3>

            <div className="d-flex justify-content-around align-items-center">

                <div className="mb-3 p-4 d-flex gap-3">
                    <div>
                    <label htmlFor="exampleInputEmail1" className="form-label mb-1">Cari Akun</label>
                    <input type="text" placeholder="Ketikkan Nama/Username/Provinsi..." className="form-control mr-2" id="exampleInputEmail1" aria-describedby="emailHelp" style={{
                        width : '320px',
                        backgroundColor : '#F1EFEF',
                        border : '1px solid #CBCBCB'
                    }}/>
                    </div>
                    <button style={{
                            color : 'white',
                            backgroundColor : '#E30505',
                            border : '1px solid #890000',
                            borderRadius : '5px',
                            width : '131px',
                            height : "37px",
                            fontSize : '12px'
                        }} className='istok-web-bold align-self-end'>Cari</button>
                </div>
                <button style={{
                            color : 'white',
                            backgroundColor : '#463DFF',
                            border : '2px solid #0C049A',
                            borderRadius : '5px',
                            width : '131px',
                            height : "37px",
                            fontSize : '12px'
                        }} className='istok-web-bold mt-3'>Tambah Akun</button>
            </div>
            <div className="px-4">
            <table className="table table-striped">
                <thead>
                    <tr className="text-center">
                        <th>
                            ID
                        </th>
                        <th>
                            Nama
                        </th>
                        <th>
                            Username
                        </th>
                        <th>
                            Provinsi
                        </th>
                        <th>
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dataAmdmin.map((item, index) => {
                        return <tr className="text-center" key={index}>
                        <td>
                            {item.idUser}
                        </td>
                        <td>
                            {item.nama}
                        </td>
                        <td>
                            {item.email}
                        </td>
                        <td>
                            {item.region}
                        </td>
                        <td>
                            <div className="d-flex gap-2 justify-content-center">

                                <button style={{
                                    color : 'white',
                                    backgroundColor : '#FFE100',
                                    border : '2px solid #BFA900',
                                    borderRadius : '5px',
                                    width : '100px',
                                    height : "37px",
                                    fontSize : '12px'
                                }} className='istok-web-bold' onClick={handleShow}>Edit</button>

                                <button style={{
                                    color : 'white',
                                    backgroundColor : '#E30505',
                                    border : '1px solid #890000',
                                    borderRadius : '5px',
                                    width : '100px',
                                    height : "37px",
                                    fontSize : '12px'
                                }} className='istok-web-bold'>Hapus</button>
                            </div>
                        </td>
                    </tr>
                    })}
                </tbody>
            </table>
            </div>
            <ModalShow handleClose={handleClose} show={show} title="Isikan Data Admin" message="lorem ipsum dolor sit amet adalah bahasa templating" />
        </>
    )

}

export default PageAddAdminProv;