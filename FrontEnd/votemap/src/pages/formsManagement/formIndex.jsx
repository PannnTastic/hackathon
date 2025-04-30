import PageAddAdminKab from "../forms/formkab"
import PageAddAdminProv from "../forms/formprov"

function FormIndex({index}) {
    
    const state = [
        <PageAddAdminProv/>,
        <PageAddAdminKab/>
    ]

    return  (
        <>
            {index != null && state[index]}
        </>
    )

}

export default FormIndex