import '../App.css'

function Login({elements}) {

    return (
        <div style={{
            backgroundColor : '#e30505',
            height : '100vh'
        }}>
            <div className="d-flex justify-content-center" style={{
                padding : '40px'
            }}>
                <img src="/images/votemap.png" width='300' />    
            </div> 
            <div className='d-flex justify-content-center'>
                {elements}
            </div>
        </div>
    )
}
export default Login;