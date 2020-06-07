import React from "react";

const Search = () => {
  return (
    <>
      <form className='inputWithIcon' onSubmit={callWeather}>
        <input
          type='text'
          placeholder='Enter the city'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={reveal}
          onBlur={close}
        />
        <i className='fa fa-map-marker-alt ' aria-hidden='true'></i>
        <button>
          <i className='fa fa-search ' aria-hidden='true'></i>
        </button>
        <ul className={show ? "dropdown" : "dropdown-hide"}>
          {suggestion.map((sos) => (
            <li
              className='dropdown-item'
              key={sos.name}
              onClick={() => {
                console.log("oioioioi");
              }}
            >
              <p>{sos.name}</p>
              <div className='right'>
                <div className='temp'>
                  <p>{Math.floor(sos.feels_like)}&#176; C</p>
                  <p>{sos.main}</p>
                </div>
                <img src={`/icons/${sos.icon}.png`} alt='ico' />
              </div>
            </li>
          ))}
        </ul>
      </form>
    </>
  );
};

export default Search;
