import PageAddDpt from "../forms/formdpt";
import PageAddAdminKab from "../forms/formkab";
import PageAddAdminKec from "../forms/formkec";
import PageAddAdminKel from "../forms/formkel";
import PageAddAdminTps from "../forms/formpetugas";
import PageAddAdminProv from "../forms/formprov";
import PageAddTps from "../forms/formtps";
import Rekap from "../forms/rekap";

function FormIndex({ index }) {
  const state = [
    <PageAddAdminProv />,
    <PageAddAdminKab />,
    <PageAddAdminKec />,
    <PageAddAdminKel />,
    <PageAddAdminTps />,
    <PageAddTps />,
    <Rekap />,
  ];

  return <>{index != null && state[index]}</>;
}

export default FormIndex;
