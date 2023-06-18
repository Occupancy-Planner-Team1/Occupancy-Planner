import { useSearchParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from "../components/shared/AuthContext";
import axios from 'axios';
//Assets
import logo from '../assets/Logo-IT-Designers.svg';

const SuggestedReservation = () => {
  // variables & functions
  const [searchParams, setSearchParams] = useSearchParams();
  const [generatedts, setGeneratedTs] = useState({}); // Generated Timeslots: 11:00-11:15, 11:15-11:30, ...
  const [currentts, setCurrentTimeslot] = useState(-1); // Selected Timeslot 0-11
  const [dailydata, setDailyData] = useState([]); // The daily raw Data which is updated every 2 seconds
  const [currentduration, setCurrentDuration] = useState(1); //
  const { token, user } = useContext(AuthContext); 
  let keywords =[]; // 
  let requestedData = new Object();


  async function currentDailyData(date){
    await axios.get('/api/auth/res-day/'+ date, { headers: { Authorization: 'Bearer ' + token } }).then((result) => {
        //rawDataDaily = result.data;
        document.getElementById("body")?.classList.remove("disabled_map");
        setDailyData(result.data);
    });

    //specifiedData("bookingTimeslot=1", "reservationId,chairUserId,chairId");
    //getReservedSeatsInTimeslots(3,2);

  }

  function getDataInTimeslots(timeslot, duration){
    let dataForTimeslot = [];
    for(let n=1; n <= duration; n++){
      let bookingIdArray = specifiedData(`bookingTimeslot=${timeslot}`,"bookingId");
      for (let i in bookingIdArray[0]){
        //dataForTimeslot.push(bookingIdArray[0][i]);
        dataForTimeslot.push(specifiedData(`bookingId=${bookingIdArray[0][i]}`,"reservationId,chairUserId,chairId"));
      }
      timeslot = timeslot + 1;
    }
    return dataForTimeslot;
  }

  // timeslot: 0-12; 0 is the first timeslot and 12 the last one
  // duration: 1-4; how many timeslots are put together to get one big timelot
  // return: all used chairs in the given timelots
  function getReservedSeatsInTimeslots(timeslot, duration){
      let reservedSeats = [];
      let bookingIdArray = [];
      let tmpArray = [];
      for(let n=1; n <= duration; n++){
          bookingIdArray = specifiedData(`bookingTimeslot=${timeslot}`,"bookingId");
          for (let i in bookingIdArray[0]){
          tmpArray.push(specifiedData(`bookingId=${bookingIdArray[0][i]}`,"chairId"));
          }
          timeslot = timeslot + 1;
      }

      // sum up all chairs to one array
      for(let a in tmpArray){
          for(let b in tmpArray[a]){
          for(let c in tmpArray[a][b]){
              reservedSeats.push(tmpArray[a][b][c]);
          }
          }
      }
      // delete the duplicates
      let uniqueReservedSeats = reservedSeats.filter((c, index) => { 
          return reservedSeats.indexOf(c) === index;
      });

      //console.log(uniqueReservedSeats);
      return reservedSeats;
  }  

  // Give a keyword=data touple as a condition and a keyword to specify the result.
  // The keywords have to be one of the following strings: "bookingId", "bookingTimeslot"(0-11), "bookerId", "reservationId", "reservationUserId", "chairUserId", "chairId", "chair_table", "positionX", "positionY"
  // For multiple conditions put the keyword=data condition touple in a string  separated by commas.
  // For multiple results put the keywords in a string seperated by a commas.
  // For example: dataInTimeslot("bookingTimeslot=1,bookerId=...", "bookingid,reservationId,chairId");
  // Important! Please use right now only level 1 keywords for the filter and level 2 and 3 keywords to specify the result data
  function specifiedData(keywordStringcondition, keywordStringResult) {
      let conditionKeyword; // holds the keyword to filter the raw data
      let conditionData;  // holds the data to be filtered after
      let resultKeyword;  // holds the keyword to specify the result set
      let levelString;

      let workedDataDaily = dailydata;
      let specifiedWorkedDataDaily = [];


      // If a name changed in the datamodell, this map has to be changed to !!
      // The map maps the keywords on to the names used in the datamodell
      const nameAssignment = new Map([ ["bookingId", "id"], ["bookingTimeslot", "timeslot"], ["bookerId", "bucher"], ["reservationId", "id"], ["chairUserId", "stuhlsitzer"], ["chairId", "chairName"], ["chair_table", "tisch"], ["positionX", "posx"], ["positionY", "posy"]  ]);

      // To find the data in the mutlidimesnional Datastructure, we establish three drifferent level where the data could be:
      // 1. In the booking array; 2. In the reservation array in the booking array; 3. In the chair object in the reservation array 
      const level = new Map([ ["bookingId", "level_1"], ["bookingTimeslot", "level_1"], ["bookerId", "level_1"], ["reservationId", "level_2"], ["chairUserId", "level_2"], ["chairId", "level_3"], ["chair_table", "level_3"], ["positionX", "level_3"], ["positionY", "level_3"] ]);


      // get the keyword=data touple out of the string
      for(let condition of keywordStringcondition.split(",")) {
          let tempArray = condition.split("=");
          // Change the keyword to fit the datamodell
          conditionKeyword = nameAssignment.get(tempArray[0]);
          conditionData = tempArray[1];
          levelString = level.get(tempArray[0]);
          
          // call the filter function
          workedDataDaily = filterData(workedDataDaily,conditionKeyword, conditionData,levelString);
      }
      //console.log(workedDataDaily);

      // Get the keywords for specifing the result out of the string
      for(let keyword of keywordStringResult.split(",")) {
          // Change the keyword to fit the datamodell
          resultKeyword = nameAssignment.get(keyword);
          levelString = level.get(keyword);
          // call the function to specify the data
          specifiedWorkedDataDaily.push(specifyData(workedDataDaily,resultKeyword,levelString,nameAssignment)); 
      }
      //console.log(specifiedWorkedDataDaily);
      return specifiedWorkedDataDaily;
  }

  function filterData(data, conditionKeyword,conditionData, levelString) {
      let command; // build a command to execute with the changing keyword=data touple
      let workedDataDaily = [];

      command = `workedDataDaily = data.filter(workedDataDaily => workedDataDaily.${conditionKeyword} == "${conditionData}");`;
      eval(command);

      if(workedDataDaily.length == 0) console.debug("WARNING: keyword=data touple does not exist!");
      return workedDataDaily;
  }

  // Filter for the specif result data the user wants to see
  function specifyData(workedDataDaily,resultKeyword,levelString,nameAssignment) {
      let command; // build a command to execute with the changing keyword=data touple
      let specifiedWorkedDataDaily = [];

      for(let i in workedDataDaily) {
          if(levelString == "level_1") {
          // build a command to create a new array with specified data only
          command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].${resultKeyword});`
          // execute the command
          eval(command);
          }
          else if(levelString == "level_2" || levelString == "level_3"){
          for(let n in workedDataDaily[i].reservations) {
              let command = `workedDataDaily[${i}].reservations[${n}].${nameAssignment.get("chairUserId")}`
              if(eval(command)){
                if(levelString == "level_2") { 
                    command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].reservations[${n}].${resultKeyword});` 
                }
                if(levelString == "level_3") { 
                    command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].reservations[${n}].chair.${resultKeyword});` 
                    //console.log(specifiedWorkedDataDaily.push(workedDataDaily[i].reservations[n].chair.chairName));
                }
              }
              // execute the command
              eval(command);
            }
        } 
    }

    return specifiedWorkedDataDaily;
  }

  /*
        let command; // build a command to execute with the changing keyword=data touple 

        if(level.get(tempArray[0]) == "level_1"){
          command = `workedDataDaily = workedDataDaily.filter(workedDataDaily => workedDataDaily.${conditionKeyword} == "${conditionData}");`;
        }

        if(level.get(tempArray[0]) == "level_2") {
          //console.log(workedDataDaily[1].reservations);   
          for(let i in rawDataDaily) {
            workedDataDaily = rawDataDaily[i].reservations;
            command = `workedDataDaily = workedDataDaily.filter(workedDataDaily => workedDataDaily.${conditionKeyword} == "${conditionData}");`;
            console.log(workedDataDaily);
          }
          
          
          
          /*tmpArray = workedDataDaily[1].reservations;
          command = `tmpArray = tmpArray.filter(tmpArray => tmpArray.${conditionKeyword} == "${conditionData}");`;

          /*for(let i in workedDataDaily) {
            console.log("start");
            //console.log(workedDataDaily[i].reservations);
            tmpArray = workedDataDaily[i].reservations;
            //console.log(tmpArray = tmpArray.filter(tmpArray => tmpArray.id == 453));
            command = `tmpArray = tmpArray.filter(tmpArray => tmpArray.${conditionKeyword} == "${conditionData}");`;
            //command = `workedDataDaily = workedDataDaily.filter(workedDataDaily => workedDataDaily[${i}].reservations.${conditionKeyword} == "${conditionData}");`;
          }
        }
        // execute the command
        eval(command);
        if(workedDataDaily.length == 0) { console.log("WARNING: keyword=data touple does not exist!"); }
      


      // Filter for the specif data the user wants
      // Get the keywords out of the string
      for(let keyword of keywordStringResult.split(",")) {
        // Change the keyword to fit the datamodell
        let newKeyword = nameAssignment.get(keyword);

        // Iterate over the array on the top level
        for(let i in workedDataDaily) {
          if(level.get(keyword) == "level_1") {
            // build a command to create a new array with specified data only
            let command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].${newKeyword});`
            // execute the command
            eval(command);
          }

          else if(level.get(keyword) == "level_2" || level.get(keyword) == "level_3"){
            for(let n in workedDataDaily[i].reservations) {
              let tmpKeyword = nameAssignment.get("chairUserId");
              let command = `workedDataDaily[${i}].reservations[${n}].${tmpKeyword}`
              if(eval(command)){
                if(level.get(keyword) == "level_2") { 
                  command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].reservations[${n}].${newKeyword});` 
                }
                if(level.get(keyword) == "level_3") { 
                  command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].reservations[${n}].chair.${newKeyword});` 
                }
              }
              // execute the command
              eval(command);
            }
          }
        }
      }
      //console.log(workedDataDaily);
      //console.log(workedDataDaily);
      console.log(specifiedWorkedDataDaily);
      return specifiedWorkedDataDaily;
    }
      
      
      
      // Iterate over the array on the top level
        for(let i in workedDataDaily) {
          if(level.get(keyword) == "level_1") {
            // build a command to create a new array with specified data only
            let command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].${newKeyword});`
            // execute the command
            eval(command);
          }

          else if(level.get(keyword) == "level_2" || level.get(keyword) == "level_3"){
            for(let n in workedDataDaily[i].reservations) {
              let tmpKeyword = nameAssignment.get("chairUserId");
              let command = `workedDataDaily[${i}].reservations[${n}].${tmpKeyword}`
              if(eval(command)){
                if(level.get(keyword) == "level_2") { 
                  command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].reservations[${n}].${newKeyword});` 
                }
                if(level.get(keyword) == "level_3") { 
                  command = `specifiedWorkedDataDaily.push(workedDataDaily[${i}].reservations[${n}].chair.${newKeyword});` 
                }
              }
              // execute the command
              eval(command);
            }
          }
        }
      
      //console.log(workedDataDaily);
      //console.log(workedDataDaily);
      console.log(specifiedWorkedDataDaily);
      return specifiedWorkedDataDaily;
    }*/

  // Create JSON Reservation
  function createReservation(sid, cid, cname) {
    let reservation = {"id": null, "stuhlsitzer": sid, "chair": {"id": cid, "chairName" : cname, "tisch": null, "posx": null,"posy": null}};
    return reservation;
  }

  //Click function on Chair
  async function clickChair(e) {
    if (currentts!==(-1)) {
      if (!e.target.parentElement.classList.contains("reserved_reserved")) {
          document.getElementById("body")?.classList.add("disabled_map");
          // Get Id of clicked chair
          //Array own BookingId`s 1-4 Entries (ts, date, userid)
          //axios.delete('/api/auth/res/del-booking/{bookingid}', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem('kc_token') } }).then((result) => {
          //  console.log(result.status);
          //});
          
          //Res Put changed chairs
          for (let index = 0; index < currentduration; index++) {
            let data = {
              "id": 0,
              "datum": document.getElementById("696969").value,
              "timeslot": currentts+index,
              "bucher": userid,
              "reservations": [
                createReservation(userid, Number(e.target.parentElement.id.split("_")[1]), `chair_${Number(e.target.parentElement.id.split("_")[1])}`)
              ]
            };
            await axios({ method: 'put', url: '/api/auth/res/', data: data, headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('kc_token') } });
          }
          
      }
      if (!e.target.parentElement.classList.contains("reserved_reserved") && e.target.parentElement.classList.contains("reserved_me")) {
        // only delete Reservation
        //axios.delete('/api/auth/res/del-booking/{bookingid}', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem('kc_token') } }).then((result) => {
        //  console.log(result.status);
        //});
        // delete Reservation with mulitple reservations -> clear seat in json
      }
    }
  }  

  // After Website finish loading
  useEffect(() => {
    let query = searchParams.get("restime")!=null? searchParams.get("restime") : 15;
    document.getElementById(query+"min").checked = true;
    const date = new Date();
    document.getElementById("696969").value = date.getFullYear()+'-'+('0' + (date.getMonth()+1)).slice(-2)+'-'+('0' + date.getDate()).slice(-2);
    //Initial Values
    //setCurrentDuration(0);
    //setCurrentTimeslot(0);
    // Silas: ---------------------------------------------------
    // Load the data from the day picked in the Calendar
    currentDailyData(document.getElementById("696969").value); 
    let lastChange = 0;
    // Check every 2 secons if the data has changed
    const interval = setInterval(() => {
      axios.get('/api/auth/last-change', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem('kc_token') } }).then((result) => {
        if(lastChange && result.data != lastChange) { 
          // If the data has changed => reload
          console.log("RELOAD DATA");
          currentDailyData(document.getElementById("696969").value);
        }
        lastChange = result.data;
      });
    }, 2000);
  }, []);
  
  // Render chairs
  useEffect(()=>{
    //Create Timeslot objects
    function generatedtserator(minutes) {
      let ts = new Object(), st = new Date(0,0,0,11,0,0), et = new Date(0,0,0,11,minutes,0);
      let id = 0;
      for (let index = 0; index < 12/(minutes/15); index++) {
        let inner = new Object();
        inner.slot = st.getHours()+":"+(st.getMinutes() < 10 ? '0' : '') + st.getMinutes()+" - "+et.getHours()+":"+(et.getMinutes() < 10 ? '0' : '') + et.getMinutes();
        inner.id = id;
        ts[index] = inner;
        st = et;
        et = new Date(et.getTime() + minutes*60000);
        id+=currentduration;
      }
      setGeneratedTs(ts);
    }
    // Clear Reservations
    document.getElementById("sitzplan")?.querySelectorAll(`g`).forEach((element)=>{
      element?.getAttribute('class');
      element?.removeAttribute('class');
    });
    let ts = specifiedData(`bookingTimeslot=${currentts}`, "chairUserId,reservationId,chairId", dailydata);
    let chairs = getReservedSeatsInTimeslots(currentts, currentduration);
    generatedtserator(currentduration*15);
    //console.log(getDataInTimeslots(currentts, currentduration));
    if (currentts!==(-1)) {
      try {
        for (const key in chairs) {
          if (ts[0][key]===userid) {
            document.getElementById(chairs[key]).setAttribute('class', 'reserved_me');
          } else {
            document.getElementById(chairs[key]).setAttribute('class', 'reserved_reserved');
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentts, dailydata, currentduration]);


  //change minutes from slot
  const changeTime = (e) => {
    if (currentts!==(-1)) {
      setCurrentDuration((e.target.value/15));
    }
  };
  // UserInfo
  const shortname = user.given_name.substring(0, 1)+''+user.family_name.substring(0, 1);
  const longname = user.name;
  const userid = user.sub;

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
          <input type="date" className="btn border custom-input" id="696969"/>
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
            Object.keys(generatedts).map((key, i) => (
              <div className="col-12 col-sm-6 col-md-3 mb-2" key={key}>
                <input type="radio" className="btn-check" name="time_slot" id={generatedts[i].id} value={i} onChange={(e)=>{setCurrentTimeslot(parseInt(e.target.id))}} defaultChecked={ key==0 ? true : false}/>
                <label className={`btn recommended_time_slot w-100${generatedts[i].data!==undefined ? ' reservation_status'+(generatedts[i].capacity===1.0 ? "10" : generatedts[i].capacity*10) : ''} border`} htmlFor={generatedts[i].id}>{generatedts[i].slot}</label>
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
              <g id="chair_1" data-name="chair" onClick={clickChair}>
                <path d="M1208.88,113.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S1198,102.31,1208.88,113.24Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1199.73,105.42a.93.93,0,0,1-1,.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0l-4.28-4.28c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_2" data-name="chair" onClick={clickChair}>
                <path d="M1166.52,256.84l12-12L1221,287.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S1155.59,267.77,1166.52,256.84Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1158.7,266a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_3" data-name="chair" onClick={clickChair}>
                <path d="M1310.12,298.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S1321.05,309.69,1310.12,298.76Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1319.27,306.58a.93.93,0,0,1,1-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_4" data-name="chair" onClick={clickChair}>
                <path d="M1352,155.16l-12,12-42.42-42.42,12-12c10.93-10.93,29.29-10.3,41,1.41S1363,144.23,1352,155.16Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1359.86,146a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L1361.2,146a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
            </g>
            <g id="section-2" data-name="section">
              <circle cx="654.07" cy="257.5" r="64" fill="#003a70"/>
              <g id="chair_5" data-name="chair" onClick={clickChair}>
                <path d="M963.88,224.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S953,213.31,963.88,224.24Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M954.73,216.42a.93.93,0,0,1-1.05.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0L908,253.23c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_6" data-name="chair" onClick={clickChair}>
                <path d="M921.52,367.84l12-12L976,398.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S910.59,378.77,921.52,367.84Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M913.7,377a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_7" data-name="chair" onClick={clickChair}>
                <path d="M1065.12,409.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S1076.05,420.69,1065.12,409.76Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1074.27,417.58a.93.93,0,0,1,1-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_8" data-name="chair" onClick={clickChair}>
                <path d="M1107,266.16l-12,12-42.42-42.42,12-12c10.93-10.93,29.29-10.3,41,1.41S1118,255.23,1107,266.16Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1114.86,257a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L1116.2,257a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
            </g>
            <g id="section-3" data-name="section">
              <circle cx="388.07" cy="114.5" r="64" fill=" #003a70"/>
              <g id="chair_9" data-name="chair" onClick={clickChair}>
                <path d="M697.88,81.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S687,70.31,697.88,81.24Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M688.73,73.42a.93.93,0,0,1-1.05.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0L642,110.23c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_10" data-name="chair" onClick={clickChair}>
                <path d="M655.52,224.84l12-12L710,255.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S644.59,235.77,655.52,224.84Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M647.7,234a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_11" data-name="chair" onClick={clickChair}>
                <path d="M799.12,266.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S810.05,277.69,799.12,266.76Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M808.27,274.58a.93.93,0,0,1,1.05-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_12" data-name="chair" onClick={clickChair}>
                <path d="M841,123.16l-12,12L786.6,92.76l12-12c10.93-10.93,29.29-10.3,41,1.41S852,112.23,841,123.16Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M848.86,114a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1.05-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L850.2,114a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
            </g>
            <g id="section-4" data-name="section">
              <circle cx="114.07" cy="257.5" r="64" fill=" #003a70"/>
              <g id="chair_13" data-name="chair" onClick={clickChair}>
                <path d="M423.88,224.24l12,12-42.42,42.43-12-12c-10.93-10.93-10.3-29.29,1.42-41S413,213.31,423.88,224.24Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M414.73,216.42a.93.93,0,0,1-1.05.19c-10.55-4.62-23.78-2.23-32.93,6.92s-11.55,22.38-6.92,32.94a1,1,0,0,1-.19,1h0a1,1,0,0,1-1.34,0L368,253.23c-10.93-10.93-10.3-29.3,1.41-41s30.08-12.35,41-1.42l4.28,4.29a.94.94,0,0,1,0,1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_14" data-name="chair" onClick={clickChair}>
                <path d="M381.52,367.84l12-12L436,398.24l-12,12c-10.93,10.93-29.3,10.3-41-1.41S370.59,378.77,381.52,367.84Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M373.7,377a.92.92,0,0,1,.19,1c-4.62,10.56-2.23,23.78,6.92,32.94s22.38,11.54,32.94,6.92a.91.91,0,0,1,1,.19h0a1,1,0,0,1,0,1.34l-4.28,4.28c-10.93,10.93-29.29,10.3-41-1.42s-12.35-30.08-1.41-41l4.28-4.28a.94.94,0,0,1,1.33,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_15" data-name="chair" onClick={clickChair}>
                <path d="M525.12,409.76l-12-12,42.42-42.43,12,12c10.93,10.93,10.3,29.29-1.42,41S536.05,420.69,525.12,409.76Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M534.27,417.58a.93.93,0,0,1,1.05-.19c10.55,4.62,23.78,2.23,32.93-6.92s11.55-22.38,6.92-32.94a1,1,0,0,1,.19-1h0a1,1,0,0,1,1.34,0l4.28,4.28c10.93,10.93,10.3,29.3-1.41,41s-30.08,12.35-41,1.42l-4.28-4.29a.94.94,0,0,1,0-1.33Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_16" data-name="chair" onClick={clickChair}>
                <path d="M567,266.16l-12,12L512.6,235.76l12-12c10.93-10.93,29.29-10.3,41,1.41S578,255.23,567,266.16Z" transform="translate(-360.22 -59.5)" fill=" #003a70"/>
                <path d="M574.86,257a1,1,0,0,1-.19-1c4.63-10.56,2.24-23.78-6.92-32.94s-22.38-11.54-32.93-6.92a.93.93,0,0,1-1.05-.19h0a1,1,0,0,1,0-1.34l4.28-4.28c10.94-10.93,29.3-10.3,41,1.42s12.34,30.08,1.41,41L576.2,257a1,1,0,0,1-1.34,0Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
            </g>
            <g id="big_section">
              <g id="chair_17" data-name="chair" onClick={clickChair}>
                <path d="M986.89,567.67v17h-60v-17c0-15.46,13.43-28,30-28S986.89,552.21,986.89,567.67Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M985.94,555.67a1,1,0,0,1-.87-.61c-4.19-10.73-15.23-18.39-28.18-18.39s-24,7.66-28.18,18.39a1,1,0,0,1-.88.61h0a1,1,0,0,1-.94-.95v-6.05c0-15.46,13.43-28,30-28s30,12.54,30,28v6.05a1,1,0,0,1-.95.95Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_18" data-name="chair" onClick={clickChair}>
                <path d="M925.83,880.17v-17h60v17c0,15.46-13.43,28-30,28S925.83,895.63,925.83,880.17Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M926.78,892.17a.93.93,0,0,1,.87.6c4.19,10.74,15.24,18.4,28.18,18.4s24-7.66,28.19-18.4a.93.93,0,0,1,.87-.6h0a.94.94,0,0,1,.94.94v6.06c0,15.46-13.43,28-30,28s-30-12.54-30-28v-6.06a1,1,0,0,1,.95-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_19" data-name="chair" onClick={clickChair}>
                <path d="M857,612h17v60H857c-15.46,0-28-13.43-28-30S841.54,612,857,612Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M845,612.94a.94.94,0,0,1-.6.88C833.66,618,826,629.05,826,642s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94H838c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_20" data-name="chair" onClick={clickChair}>
                <path d="M857,694.5h17v60H857c-15.46,0-28-13.43-28-30S841.54,694.5,857,694.5Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M845,695.44a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94H838c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_21" data-name="chair" onClick={clickChair}>
                <path d="M856,777h17v60H856c-15.46,0-28-13.43-28-30S840.54,777,856,777Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M844,777.94a.94.94,0,0,1-.6.88C832.66,783,825,794.05,825,807s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94H837c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_22" data-name="chair" onClick={clickChair}>
                <path d="M1058.61,837.5h-17v-60h17c15.46,0,28,13.43,28,30S1074.07,837.5,1058.61,837.5Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1070.61,836.56a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a.94.94,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a.94.94,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_23" data-name="chair" onClick={clickChair}>
                <path d="M1058.61,755h-17V695h17c15.46,0,28,13.43,28,30S1074.07,755,1058.61,755Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1070.61,754.06a.94.94,0,0,1,.61-.88C1082,749,1089.61,738,1089.61,725s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a.94.94,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a.94.94,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <g id="chair_24" data-name="chair" onClick={clickChair}>
                <path d="M1059.61,672.5h-17v-60h17c15.46,0,28,13.43,28,30S1075.07,672.5,1059.61,672.5Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1071.61,671.56a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a.94.94,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a.94.94,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill=" #7d9bc1"/>
              </g>
              <path d="M1006.72,846H910.34c-13-75-14.54-152.89,0-234h96.38C1020.59,689.66,1020.4,767.71,1006.72,846Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
            </g>
            <g id="big_section-2" data-name="big_section">
              <g id="chair_25" data-name="chair" onClick={clickChair}>
                <path d="M1356.75,567.42v17h-60v-17c0-15.46,13.43-28,30-28S1356.75,552,1356.75,567.42Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1355.81,555.42a1,1,0,0,1-.88-.61c-4.19-10.73-15.23-18.39-28.18-18.39s-24,7.66-28.18,18.39a1,1,0,0,1-.88.61h0a1,1,0,0,1-.94-.95v-6.05c0-15.46,13.43-28,30-28s30,12.54,30,28v6.05a1,1,0,0,1-.94.95Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_26" data-name="chair" onClick={clickChair}>
                <path d="M1295.69,879.92v-17h60v17c0,15.46-13.43,28-30,28S1295.69,895.38,1295.69,879.92Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1296.64,891.92a.93.93,0,0,1,.87.6c4.2,10.74,15.24,18.4,28.18,18.4s24-7.66,28.19-18.4a.93.93,0,0,1,.87-.6h0a.94.94,0,0,1,.94.94v6.06c0,15.46-13.43,28-30,28s-30-12.54-30-28v-6.06a1,1,0,0,1,1-.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_27" data-name="chair" onClick={clickChair}>
                <path d="M1226.86,611.75h17v60h-17c-15.46,0-28-13.43-28-30S1211.4,611.75,1226.86,611.75Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1214.86,612.69a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94h-6.06c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_28" data-name="chair" onClick={clickChair}>
                <path d="M1226.86,694.25h17v60h-17c-15.46,0-28-13.43-28-30S1211.4,694.25,1226.86,694.25Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1214.86,695.19a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94h-6.06c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_29" data-name="chair" onClick={clickChair}>
                <path d="M1225.86,776.75h17v60h-17c-15.46,0-28-13.43-28-30S1210.4,776.75,1225.86,776.75Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1213.86,777.69a.94.94,0,0,1-.6.88c-10.74,4.19-18.4,15.23-18.4,28.18s7.66,24,18.4,28.18a.94.94,0,0,1,.6.88h0a.94.94,0,0,1-.94.94h-6.06c-15.46,0-28-13.43-28-30s12.54-30,28-30h6.06a.94.94,0,0,1,.94.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_30" data-name="chair" onClick={clickChair}>
                <path d="M1428.47,837.25h-17v-60h17c15.46,0,28,13.43,28,30S1443.93,837.25,1428.47,837.25Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1440.47,836.31a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a1,1,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a1,1,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_31" data-name="chair" onClick={clickChair}>
                <path d="M1428.47,754.75h-17v-60h17c15.46,0,28,13.43,28,30S1443.93,754.75,1428.47,754.75Z" transform="translate(-360.22 -59.5)" fill="#003a70"/>
                <path d="M1440.47,753.81a.94.94,0,0,1,.61-.88c10.73-4.19,18.39-15.23,18.39-28.18s-7.66-24-18.39-28.18a.94.94,0,0,1-.61-.88h0a1,1,0,0,1,1-.94h6c15.46,0,28,13.43,28,30s-12.54,30-28,30h-6a1,1,0,0,1-1-.94Z" transform="translate(-360.22 -59.5)" fill="#7d9bc1"/>
              </g>
              <g id="chair_32" data-name="chair" onClick={clickChair}>
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

export default SuggestedReservation;