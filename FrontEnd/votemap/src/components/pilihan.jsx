import { useState, useEffect } from "react";
import axios from "axios";

function Filter() {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [tps, setTps] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
  const [selectedTps, setSelectedTps] = useState("");
  const [idSub, setIdSub] = useState(0);

  // Fetch provinces initially
  useEffect(() => {
    axios
      .get("https://r18tprb3-8000.asse.devtunnels.ms/getregion/province")
      .then((res) => {
        setProvinces(res.data);
      });
  }, []);

  // Fetch cities when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://r18tprb3-8000.asse.devtunnels.ms/getregion/city?idprovince=${selectedProvince}`)
        .then((res) => {
          setCities(res.data);
          setSelectedCity("");
          setDistricts([]);
          setSubdistricts([]);
          setTps([]);
        });
    } else {
      setCities([]);
      setSelectedCity("");
      setDistricts([]);
      setSubdistricts([]);
      setTps([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      axios
        .get(`https://r18tprb3-8000.asse.devtunnels.ms/getregion/district?idcity=${selectedCity}`)
        .then((res) => {
          setDistricts(res.data);
          setSelectedDistrict("");
          setSubdistricts([]);
          setTps([]);
        });
    } else {
      setDistricts([]);
      setSelectedDistrict("");
      setSubdistricts([]);
      setTps([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://r18tprb3-8000.asse.devtunnels.ms/getregion/subdistrict?iddistrict=${selectedDistrict}`)
        .then((res) => {
          setSubdistricts(res.data);
          setSelectedSubdistrict("");
          setTps([]);
        });
    } else {
      setSubdistricts([]);
      setSelectedSubdistrict("");
      setTps([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSubdistrict) {
      // Cek apakah idSub sudah di-update
      const selectedSub = subdistricts.find((sub) => sub.idSubdistrict === selectedSubdistrict);
      if (selectedSub) {
        setIdSub(selectedSub.idSubdistrict);
      }
    } else {
      setIdSub(0);
    }
  }, [selectedSubdistrict, subdistricts]);

  useEffect(() => {
    console.log(selectedProvince)
    if (selectedSubdistrict) {
      axios
        .get(`https://r18tprb3-8000.asse.devtunnels.ms/getregion/tps?idsubdistrict=${selectedSubdistrict}&iddistrict=${selectedDistrict}`)
        .then((res) => {
                setTps(res.data);
        });
    } else {
      setTps([]);
    }
  }, [selectedSubdistrict]);

  return (
    <div className="p-3 shadow-sm">
      <h1 className="font-bolder fs-3 text-center">Filter Data</h1>
      <div className="d-flex gap-3 justify-content-center my-2">
        <div>
          <select
            id="province"
            className="col"
            style={{ padding: "10px", borderRadius: "10px" }}
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">- Select Province -</option>
            {provinces.map((item) => (
              <option value={item.idProvince} key={item.idProvince}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div>
          <select
            id="city"
            className="col"
            style={{ padding: "10px", borderRadius: "10px" }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedProvince}
          >
            <option value="">- Select City -</option>
            {cities.map((item) => (
              <option value={item.idCity} key={item.idCity}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex gap-3 justify-content-center my-2">
        {/* District Dropdown */}
        <div>
          <select
            id="district"
            style={{ padding: "10px", borderRadius: "10px" }}
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedCity}
          >
            <option value="">- Select District -</option>
            {districts.map((item) => (
              <option value={item.idDistrict} key={item.idDistrict}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subdistrict Dropdown */}
        <div>
          <select
            id="subdistrict"
            style={{ padding: "10px", borderRadius: "10px" }}
            value={selectedSubdistrict}
            onChange={(e) => setSelectedSubdistrict(e.target.value)}
            disabled={!selectedDistrict}
          >
            <option value="">- Select Subdistrict -</option>
            {subdistricts.map((item) => (
              <option value={item.idSubdistrict} key={item.idSubdistrict}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TPS Dropdown */}
      <div className="d-flex gap-3 justify-content-center my-2">
        <div>
          <select
            id="tps"
            style={{ padding: "10px", borderRadius: "10px" }}
            value={selectedTps}
            onChange={(e) => setSelectedTps(e.target.value)}
            disabled={!selectedSubdistrict}
          >
            <option value="">- Select TPS -</option>
            {tps.map((item) => (
              <option value={item.idTps} key={item.idTps}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filter;
