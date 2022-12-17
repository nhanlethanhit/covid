import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
const URL_API = "https://api.covid19api.com/summary";
function App() {
  const [countries, setCountries] = useState([]);
  const [global, setGlobal] = useState({});
  const [sortBy, setSortBy] = useState(1);
  const [country, setCountry] = useState();
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL_API);
      const data = res.data;
      setGlobal(data.Global);
      if (data.Countries && data.Countries.length > 0) {
        const newData = data.Countries.sort(
          (a, b) => b.TotalConfirmed - a.TotalConfirmed
        );
        setCountries(newData);
      }
    } catch (error) {
      console.log("🚀 ~ file: App.js:11 ~ fetchData ~ error", error);
    }
    setLoading(false)
  };
  const getCountries = async (code) => {
    setLoadingCountries(true);
    try {
      const url = `https://restcountries.com/v3.1/alpha?codes=${code}`;
      const res = await axios.get(url);
      const data = res.data;
      console.log(data);
      const _data = {
        name: data[0].name.common,
        flag: data[0].flags.png,
        population: data[0].population,
        capital: data[0].capital,
        region: data[0].region,
        subregion: data[0].subregion,
      };
      setCountry(_data);
    } catch (error) {
      console.log(error);
    }
    setLoadingCountries(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleSort = (e) => {
    const value = +e.target.value;
    setSortBy(value);
    setCountries(
      countries.sort((a, b) => {
        if (value === 1) {
          return b.TotalConfirmed - a.TotalConfirmed;
        }
        if (value === 2) {
          return b.TotalDeaths - a.TotalDeaths;
        }
        if (value === 3) {
          return b.TotalRecovered - a.TotalRecovered;
        }
      })
    );
  };
  const handleClickCountries = (country) => {
    console.log(country);
    getCountries(country.CountryCode);
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="container p-2">
        <h2 className="h2 text-center">
          List of countries most affected by Covid-19
        </h2>
        <div className="d-flex justify-content-between">
          <h2 className="h2"></h2>
          <div className="d-flex justify-content-center mb-2">
            <p className="mx-2 my-0 align-self-center">Sort By</p>
            <select onChange={handleSort} className='p-1 rounded-1'>
              <option value={1}>Total Confirmed</option>
              <option value={2}>Total Deaths</option>
              <option value={3}>Total Recovered</option>
            </select>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col"  className="table-title">#</th>
              <th scope="col" className="table-title">
                <span >Countries</span>
              </th>
              <th scope="col"  className="table-title">Total Confirmed</th>
              <th scope="col"  className="table-title">Total Deaths</th>
              <th scope="col"  className="table-title">Total Recovered</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr style={{ border: "transparent" }}>
                <td colSpan="5" className="">
                  <div class="text-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : countries && countries.length > 0 ? (
              countries.map((country, idx) => {
                return (
                  <tr
                    key={idx}
                    data-bs-toggle="modal"
                    data-bs-target="#Modal"
                    onClick={() => handleClickCountries(country)}
                    style={{ cursor: "pointer" }}
                  >
                    <th scope="row" className="p-0">{idx + 1}</th>
                    <td  className="p-auto">{country.Country}</td>
                    <td  className="p-0">{country.TotalConfirmed}</td>
                    <td  className="p-0">{country.TotalDeaths}</td>
                    <td  className="p-0">{country.TotalRecovered}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="table-active text-center">
                  Caching in progress
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="modal"
        id="Modal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="ModalLabel">
                Country's information
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body placeholder-glow">
              {loadingCountries || !country ? (
                <>
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-7"></span>
                </>
              ) : (
                <>
                  <div class="row pb-2">
                    <div class="col-4 fw-bold">Name:</div>
                    <div class="col-8">{country.name}</div>
                  </div>
                  <div class="row pb-2">
                    <div class="col-4 fw-bold">Flag:</div>
                    <div class="col-8">
                      <img src={country.flag} width={320} height={200} style={{ maxWidth: '100%'}} className='rounded-2 image-custom'/>
                    </div>
                  </div>
                  <div class="row pb-2">
                    <div class="col-4 fw-bold">Population:</div>
                    <div class="col-8">{country.population}</div>
                  </div>
                  <div class="row pb-2">
                    <div class="col-4 fw-bold">Capital:</div>
                    <div class="col-8">{country.capital}</div>
                  </div>
                  <div class="row pb-2">
                    <div class="col-4 fw-bold">Region:</div>
                    <div class="col-8">{country.region}</div>
                  </div>
                  <div class="row pb-2">
                    <div class="col-4 fw-bold">Subregion:</div>
                    <div class="col-8">{country.subregion}</div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
