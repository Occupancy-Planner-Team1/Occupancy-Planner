const ReservationPage = () => {
  return (
    <div className="App">
      <header className="reservation_header">
        <img src="https://it-designers-gruppe.de/storage/2020/10/logo.jpg" alt="Logo" />
      </header>
      <div className='container h-fill reservation-form'>
        <h2>Reservierung</h2>
        <p>Reservierungszeiten in Minuten</p>
        <p>Freie Reservierungsslots</p>
        <p>Anzahl Personen</p>
      </div>
    </div>
  );
};

export default ReservationPage;