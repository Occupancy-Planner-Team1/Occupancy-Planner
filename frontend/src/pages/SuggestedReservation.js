import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../assets/Logo-IT-Designers.svg';
import AuthContext from "../components/shared/AuthContext";
import axios from 'axios';

const SuggestedReservation = () => {
  const date = new Date();
  const [currentdate, setCurrentDate] = useState(date.getFullYear()+'-'+('0' + (date.getMonth()+1)).slice(-2)+'-'+('0' + date.getDate()).slice(-2)); // Selected Timeslot 0-11
  const [currentduration, setCurrentDuration] = useState(1); // Available Times to book 1-4
  let [reservation_time, setReservationTime] = useState(15);
  const [recommendedSlot, setRecommendedSlot] = useState("11:00-11:15");
  const [recommendedDuration, setRecommendedDuration] = useState(0);
  const navigate = useNavigate();
  const { allinfo } = useContext(AuthContext);

  const changeTime = (e) => {
    setReservationTime(e.target.value);
  };
  const changeTimeSlot = (e) => {
    navigate(`./all?timeslot=${e.target.value}&ts=${reservation_time}&date=${currentdate}`);
  };
  const redirect_to_all = (e) => {
    navigate(`./all?restime=${reservation_time}&ts=${recommendedDuration}&date=${currentdate}`);
  };
  // UserInfo
  const shortname = allinfo && allinfo.user ? allinfo.user.given_name.substring(0, 1) + allinfo.user.family_name.substring(0, 1) : '';
  const longname = allinfo && allinfo.user ? allinfo.user.name : '';
  const userid = allinfo && allinfo.user ? allinfo.user.sub : '';

  async function getRecommendedTimeslot() {
    var timeslots = [];
    await axios.get("/api/auth/res-all/user/" + userid, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem('kc_token') } }).then(response => {timeslots = response.data.map(obj => obj.timeslot);});
    const frequency = {}; // Object to store element frequencies

    // Count the frequency of each element in the array
    timeslots.forEach(element => {
      if (element in frequency) {
        frequency[element] += 1;
      } else {
        frequency[element] = 1;
      }
    });

    // Find the element with the maximum frequency
    let mostCommonElement = null;
    let maxFrequency = 0;
    for (const [element, count] of Object.entries(frequency)) {
      if (count > maxFrequency) {
        mostCommonElement = element;
        maxFrequency = count;
      }
    }
    const timeSlots = timeslotGenerator(currentduration*15);
    setRecommendedDuration(mostCommonElement);
    setRecommendedSlot(timeSlots[mostCommonElement].slot);
  }

  function timeslotGenerator() {
    let ts = new Object(), st = new Date(0, 0, 0, 11, 0, 0), et = new Date(0, 0, 0, 11, 15, 0);
    for (let index = 0; index < 12 / (15 / 15); index++) {
      let inner = new Object();
      inner.slot = st.getHours() + ":" + (st.getMinutes() < 10 ? '0' : '') + st.getMinutes() + " - " + et.getHours() + ":" + (et.getMinutes() < 10 ? '0' : '') + et.getMinutes();
      ts[index] = inner;
      st = et;
      et = new Date(et.getTime() + 15 * 60000);
    }
    return ts;
  }
  useEffect(() => {
    getRecommendedTimeslot();
  }, [allinfo && allinfo.user]);

  // Graphic 
  return (
    <div className="App">
      <header className="container reservation-form d-flex justify-content-between">
        <h2>Reservierung</h2>
        <img src={logo} alt="Logo" />
      </header>
      <div className='container h-fill reservation-form'>
        <div className='d-flex justify-content-between'>
          <h3>Reservierungszeiten in Minuten</h3>
          <h4 data-tooltip={longname} data-flow="right">{shortname}</h4>
        </div>
        <div className='mb-3 d-flex justify-content-between'>
          <div>
            <input type="radio" className="btn-check" name="reservation_time" id="15min" value="15" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot me-3" htmlFor="15min">15</label>
            <input type="radio" className="btn-check" name="reservation_time" id="30min" value="30" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot me-3" htmlFor="30min">30</label>
            <input type="radio" className="btn-check" name="reservation_time" id="45min" value="45" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot me-3" htmlFor="45min">45</label>
            <input type="radio" className="btn-check" name="reservation_time" id="60min" value="60" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot" htmlFor="60min">60</label>
          </div>
          <input type="date" className="btn border custom-input" id="datepicker" value={currentdate} onChange={(e)=>{setCurrentDate(e.target.value)}}/>
        </div>
        <div className='d-flex justify-content-between'>
          <h3>Freie Reservierungsslots</h3>
          <div>
            <p className="d-inline-block me-5">Auslastung</p>
            <div className="d-inline-block bg-status position-relative">
              <p className="d-inline-block me-4">0%</p>
              <p className="d-inline-block">100%</p>
            </div>
          </div>
        </div>
        <div className="row">
          <input type="radio" className="d-none" name="time_slot" id="2" value="2" onChange={changeTimeSlot}/>
          <label className="btn border w-100 recommended_time_slot reservation_status1 border" htmlFor="2">{recommendedSlot}</label>
        </div>
          <div className='d-flex justify-content-center mt-3'>
            <a className='btn text-center mt-3' onClick={redirect_to_all} href=''>Alle Anzeigen</a>
          </div>
      </div>
    </div>
  );
};

export default SuggestedReservation;