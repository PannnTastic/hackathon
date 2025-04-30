import '../App.css'

function Navbar() {

    return(
        <>
            <nav style={{
                backgroundColor : "#E30505",
                display : 'flex', 
                justifyContent : 'space-between',
                alignItems : 'center'
             }} className='p-3 px-4 div1'>
                <div>
                    <img src="/images/votemap.png" style={{width : '115px',}} alt="" />
                </div>
                <div>
                    <button style={{
                        color : '#E30505',
                        backgroundColor : 'white',
                        border : '1px solid #B0ACAC',
                        borderRadius : '5px',
                        width : '131px',
                        height : "30px",
                        fontSize : '12px'
                    }} className='istok-web-bold'
                    onClick={() => {
                        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                        window.location.href = "/login";
                    }}
                    >Logout</button>
                </div>
            </nav>
        </>
    )

}

export default Navbar;