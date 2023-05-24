import { useSearchParams } from "react-router-dom";
import React, { useRef, useEffect, useState } from 'react';
import logo from '../Logo-IT-Designers.svg';
import { groupBy } from "core-js/actual/array/group-by";
import axios from 'axios';

const ReservationPage = () => {
  // variables & functions
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeslotdata, setTimeSlotData] = useState({});
  const timeslotref = useRef(null);

  //Create Timeslot objects
  function timeslotGenerator(minutes) {
    let ts = new Object(), st = new Date(0,0,0,11,0,0), et = new Date(0,0,0,11,minutes,0);
    for (let index = 0; index < 12/(minutes/15); index++) {
      let inner = new Object();
      inner.slot = st.getHours()+":"+(st.getMinutes() < 10 ? '0' : '') + st.getMinutes()+" - "+et.getHours()+":"+(et.getMinutes() < 10 ? '0' : '') + et.getMinutes();
      ts[index] = inner;
      st = et;
      et = new Date(et.getTime() + minutes*60000);
    }
    return ts;
  }
  // Get Capacity & Reserved Seats from Backend
  function getReservedSeats(query) {
    let timestamp_object = timeslotGenerator(query);
    const dt = new Date();
    axios.get('/api/auth/res-day/'+dt.getFullYear()+'-'+('0' + (dt.getMonth()+1)).slice(-2)+'-'+('0' + dt.getDate()).slice(-2), { headers: { Authorization: 'Bearer ' + localStorage.getItem('kc_token') } }).then((result) => {
      //Group Data by timeslot
      console.log(result.data);
      const data = result.data.groupBy(data => { return data.timeslot; });
      for (const key in data) {
        // Calculate capacity and round it to a fixed number
        timestamp_object[key].capacity = Number((data[key].length/32).toFixed(1));//32 -> dynamische abfrage vom Backend
        // Adding 
        timestamp_object[key].data = data[key];
      }
      console.log(timestamp_object);
      setTimeSlotData(timestamp_object);
    });
  }
  // After Website finish loading
  useEffect(() => {
    let query = searchParams.get("restime")!=null? searchParams.get("restime") : 15;
    document.getElementById(query+"min").checked = true;
    getReservedSeats(query);
  }, [timeslotref]);
  //change minutes from slot
  const changeTime = (e) => {
    console.log(timeslotGenerator(e.target.value));
    getReservedSeats(e.target.value);
  };
  // UserInfo
  let userinfo = JSON.parse(localStorage.getItem('kc_user'));
  const shortname = userinfo.given_name.substring(0, 1)+''+userinfo.family_name.substring(0, 1);
  const longname = userinfo.name;
  const userid = userinfo.sub;
  //
  const changeTimeSlot = (e) => {
    // Clear Reservations
    document.getElementById("sitzplan")?.querySelectorAll(`g`).forEach((element)=>{
      element?.getAttribute('class');
      element?.removeAttribute('class');
    });
    // Read Reservation
    if (timeslotdata[e.target.id].data) {
      // fetch reserved chairs
      timeslotdata[e.target.id].data.forEach((value)=>{
        value.reservations.forEach((el) => {
          let element = document.getElementById("chair-"+el.chair.id.toString());
          element?.setAttribute('class', 'reserved_reserved');
          /* switch (value.status) {
            case 1:
              element.setAttribute('class', 'reserved_reserved');
              break;
            case 2:
              element.setAttribute('class', 'reserved_me');
              break;
            case 3:
              element.setAttribute('class', 'reserved_guests');
              break;
            case 4:
              element.setAttribute('class', 'reserved_employees');
              break;
            default:
              break;
          }*/
        });
      });
    }
    // eventlistener on free chairs
    document.getElementById("sitzplan")?.querySelectorAll(`g[data-name="chair"]`).forEach((element)=>{
      if (!element.classList.contains("reserved_reserved")) {
        element.addEventListener("click", (e)=>{
          console.log(e.target.parentElement.id);
          let disableclick = false;
          if (disableclick===false) {
            disableclick=true;
            // Get Id of clicked chair
            //Array own BookingId`s 1-4 Entries
            axios.delete('/api/auth/res/del-booking/{bookingid}', { headers: { Authorization: 'Bearer ' + localStorage.getItem('kc_token') } }).then((result) => {
              console.log(result.status);
            });
            //Res Put changed chairs
            //Object function create returning Entry putbooking()
            axios.put('/api/auth/res/', { headers: { Authorization: 'Bearer ' + localStorage.getItem('kc_token') } }).then((result) => {
              if (result.status===200) {
                disableclick=false;                
              }
              console.log(result.status);
            });
          }
        })
      }
    });
  };
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
          <h4 title={longname}>{shortname}</h4>
        </div>
        <div className='mb-3 d-flex justify-content-between'>
          <div ref={timeslotref}>
            <input type="radio" className="btn-check" name="reservation_time" id="15min" value="15" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot me-3" htmlFor="15min">15</label>
            <input type="radio" className="btn-check" name="reservation_time" id="30min" value="30" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot me-3" htmlFor="30min">30</label>
            <input type="radio" className="btn-check" name="reservation_time" id="45min" value="45" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot me-3" htmlFor="45min">45</label>
            <input type="radio" className="btn-check" name="reservation_time" id="60min" value="60" onChange={changeTime}/>
            <label className="btn border px-4 recommended_time_slot" htmlFor="60min">60</label>
          </div>
          <input type="date" className="btn border custom-input"/>
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
          {
            Object.keys(timeslotdata).map((key, i) => (
              <div className="col-12 col-sm-6 col-md-3 mb-2" key={key}>
                <input type="radio" className="btn-check" name="time_slot" id={key} value={key+1} onChange={changeTimeSlot}/>
                <label className={`btn recommended_time_slot w-100${timeslotdata[i].data!==undefined ? ' reservation_status'+(timeslotdata[i].capacity===1.0 ? "10" : timeslotdata[i].capacity*10) : ''} border`} htmlFor={key}>{timeslotdata[i].slot}</label>
              </div>
            ))
          }
        </div>
        <h3>Anzahl Personen</h3>
        <div>
          <h3 className="text-muted d-inline-block me-5">{`Gäste`}</h3>
          <button className="btn border number-icons me-4 d-inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
          <button className="btn border number-icons d-inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
        </div>
        {
          /*<div className="d-inline-block">
          <button className="btn btn-dark-outline dropdown-toggle px-4 mb-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">Projekt auswählen</button>
          </div>*/
        }
        <div className="w-100 d-flex mt-4 justify-content-center reservation-plan">
          <svg xmlns="http://www.w3.org/2000/svg" id="sitzplan" viewBox="0 0 1116.26 867.67">
            <g id="section">
              <circle cx="899.07" cy="146.5" r="64" fill="#003a70"/>
              <g id="chair-1" data-name="chair">
                <path d="M1208.88,113.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S1198,102.31,1208.88,113.24Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1199.73,105.42a.93.93,0,0,1-1,.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0l-4.28-4.28c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-2" data-name="chair">
                <path d="M1166.52,256.84l12-12L1221,287.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S1155.59,267.77,1166.52,256.84Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1158.7,266a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-3" data-name="chair">
                <path d="M1310.12,298.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S1321.05,309.69,1310.12,298.76Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1319.27,306.58a.93.93,0,0,1,1-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-4" data-name="chair">
                <path d="M1352,155.16l-12,12-42.42-42.42,12-12c10.93-10.93,29.29-10.3,41,1.41S1363,144.23,1352,155.16Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1359.86,146a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L1361.2,146a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
            </g>
            <g id="section-2" data-name="section">
              <circle cx="654.07" cy="257.5" r="64" fill="#003a70"/>
              <g id="chair-5" data-name="chair">
                <path d="M963.88,224.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S953,213.31,963.88,224.24Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M954.73,216.42a.93.93,0,0,1-1.05.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0L908,253.23c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-6" data-name="chair">
                <path d="M921.52,367.84l12-12L976,398.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S910.59,378.77,921.52,367.84Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M913.7,377a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-7" data-name="chair">
                <path d="M1065.12,409.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S1076.05,420.69,1065.12,409.76Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1074.27,417.58a.93.93,0,0,1,1-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-8" data-name="chair">
                <path d="M1107,266.16l-12,12-42.42-42.42,12-12c10.93-10.93,29.29-10.3,41,1.41S1118,255.23,1107,266.16Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1114.86,257a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L1116.2,257a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
            </g>
            <g id="section-3" data-name="section">
              <circle cx="388.07" cy="114.5" r="64" fill=" #003a70"/>
              <g id="chair-9" data-name="chair">
                <path d="M697.88,81.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S687,70.31,697.88,81.24Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M688.73,73.42a.93.93,0,0,1-1.05.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0L642,110.23c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-10" data-name="chair">
                <path d="M655.52,224.84l12-12L710,255.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S644.59,235.77,655.52,224.84Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M647.7,234a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-11" data-name="chair">
                <path d="M799.12,266.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S810.05,277.69,799.12,266.76Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M808.27,274.58a.93.93,0,0,1,1.05-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-12" data-name="chair">
                <path d="M841,123.16l-12,12L786.6,92.76l12-12c10.93-10.93,29.29-10.3,41,1.41S852,112.23,841,123.16Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M848.86,114a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1.05-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L850.2,114a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
            </g>
            <g id="section-4" data-name="section">
              <circle cx="114.07" cy="257.5" r="64" fill=" #003a70"/>
              <g id="chair-13" data-name="chair">
                <path d="M423.88,224.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S413,213.31,423.88,224.24Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M414.73,216.42a.93.93,0,0,1-1.05.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0L368,253.23c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-14" data-name="chair">
                <path d="M381.52,367.84l12-12L436,398.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S370.59,378.77,381.52,367.84Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M373.7,377a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-15" data-name="chair">
                <path d="M525.12,409.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S536.05,420.69,525.12,409.76Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M534.27,417.58a.93.93,0,0,1,1.05-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-16" data-name="chair">
                <path d="M567,266.16l-12,12L512.6,235.76l12-12c10.93-10.93,29.29-10.3,41,1.41S578,255.23,567,266.16Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M574.86,257a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1.05-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L576.2,257a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
            </g>
            <g id="big_section">
              <g id="chair-17" data-name="chair">
                <path d="M986.89,567.67v17h-60v-17c0-15.46,13.43-28,30-28S986.89,552.21,986.89,567.67Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M985.94,555.67a1,1,0,0,1-.87-.61c-4.19-10.73-15.23-18.39-28.18-18.39s-24,7.66-28.18,18.39a1,1,0,0,1-.88.61h0a1,1,0,0,1-.94-.95v-6.05c0-15.46,13.43-28,30-28s30,12.54,30,28v6.05a1,1,0,0,1-.95.95Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-18" data-name="chair">
                <path d="M925.83,880.17v-17h60v17c0,15.46-13.43,28-30,28S925.83,895.63,925.83,880.17Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M926.78,892.17a.93.93,0,0,1,.87.6c4.19,10.74,15.24,18.4,28.18,18.4s24-7.66,28.19-18.4a.93.93,0,0,1,.87-.6h0a.94.94,0,0,1,.94.94v6.06c0,15.46-13.43,28-30,28s-30-12.54-30-28v-6.06a1,1,0,0,1,.95-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-19" data-name="chair">
                <path d="M857,612h17v60H857c-15.46,0-28-13.43-28-30S841.54,612,857,612Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M845,612.94a.94.94,0,0,1-.6.88C833.66,618,826,629.05,826,642s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94H838c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-20" data-name="chair">
                <path d="M857,694.5h17v60H857c-15.46,0-28-13.43-28-30S841.54,694.5,857,694.5Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M845,695.44a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94H838c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-21" data-name="chair">
                <path d="M856,777h17v60H856c-15.46,0-28-13.43-28-30S840.54,777,856,777Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M844,777.94a.94.94,0,0,1-.6.88C832.66,783,825,794.05,825,807s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94H837c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-22" data-name="chair">
                <path d="M1058.61,837.5h-17v-60h17c15.46,0,28,13.43,28,30S1074.07,837.5,1058.61,837.5Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1070.61,836.56a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a.94.94,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a.94.94,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-23" data-name="chair">
                <path d="M1058.61,755h-17V695h17c15.46,0,28,13.43,28,30S1074.07,755,1058.61,755Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1070.61,754.06a.94.94,0,0,1,.61-.88C1082,749,1089.61,738,1089.61,725s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a.94.94,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a.94.94,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair-24" data-name="chair">
                <path d="M1059.61,672.5h-17v-60h17c15.46,0,28,13.43,28,30S1075.07,672.5,1059.61,672.5Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1071.61,671.56a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a.94.94,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a.94.94,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <path d="M1006.72,846H910.34c-13-75-14.54-152.89,0-234h96.38C1020.59,689.66,1020.4,767.71,1006.72,846Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
            </g>
            <g id="big_section-2" data-name="big_section">
              <g id="chair-25" data-name="chair">
                <path d="M1356.75,567.42v17h-60v-17c0-15.46,13.43-28,30-28S1356.75,552,1356.75,567.42Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1355.81,555.42a1,1,0,0,1-.88-.61c-4.19-10.73-15.23-18.39-28.18-18.39s-24,7.66-28.18,18.39a1,1,0,0,1-.88.61h0a1,1,0,0,1-.94-.95v-6.05c0-15.46,13.43-28,30-28s30,12.54,30,28v6.05a1,1,0,0,1-.94.95Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-26" data-name="chair">
                <path d="M1295.69,879.92v-17h60v17c0,15.46-13.43,28-30,28S1295.69,895.38,1295.69,879.92Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1296.64,891.92a.93.93,0,0,1,.87.6c4.2,10.74,15.24,18.4,28.18,18.4s24-7.66,28.19-18.4a.93.93,0,0,1,.87-.6h0a.94.94,0,0,1,.94.94v6.06c0,15.46-13.43,28-30,28s-30-12.54-30-28v-6.06a1,1,0,0,1,1-.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-27" data-name="chair">
                <path d="M1226.86,611.75h17v60h-17c-15.46,0-28-13.43-28-30S1211.4,611.75,1226.86,611.75Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1214.86,612.69a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94h-6.06c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-28" data-name="chair">
                <path d="M1226.86,694.25h17v60h-17c-15.46,0-28-13.43-28-30S1211.4,694.25,1226.86,694.25Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1214.86,695.19a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94h-6.06c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-29" data-name="chair">
                <path d="M1225.86,776.75h17v60h-17c-15.46,0-28-13.43-28-30S1210.4,776.75,1225.86,776.75Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1213.86,777.69a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94h-6.06c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-30" data-name="chair">
                <path d="M1428.47,837.25h-17v-60h17c15.46,0,28,13.43,28,30S1443.93,837.25,1428.47,837.25Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1440.47,836.31a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a1,1,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a1,1,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-31" data-name="chair">
                <path d="M1428.47,754.75h-17v-60h17c15.46,0,28,13.43,28,30S1443.93,754.75,1428.47,754.75Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1440.47,753.81a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a1,1,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a1,1,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair-32" data-name="chair">
                <path d="M1429.47,672.25h-17v-60h17c15.46,0,28,13.43,28,30S1444.93,672.25,1429.47,672.25Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1441.47,671.31a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a1,1,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a1,1,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <path d="M1376.58,845.75H1280.2c-13-75-14.54-152.89,0-234h96.38C1390.45,689.41,1390.26,767.46,1376.58,845.75Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;