import React, { useState, useEffect } from "react";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.min.css";
import { Line } from "react-chartjs-2";
//Google API Key = AIzaSyDXND7Uhs4Qp33isz2lC4x4KHRkJfMz4qc
const Home = () => {
  const [weather, setWeathers] = useState([]);
  const [times, setTimes] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestion, setSuggestions] = useState([]);

  const getSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    console.log(suggestion);
    const access_token =
      "pk.eyJ1IjoiaGVudGV2YWFuIiwiYSI6ImNrYjR5aXM3azBrZHgyc21pY29qbjF6NTUifQ.AWYDEh1RmY9Jmr-fTsA0TA";

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=${access_token}&autocomplete=true&types=country%2Cregion%2Cdistrict`;

    try {
      const { features } = await fetch(url).then((response) => response.json());

      const suggestions = [];

      const locations = features.map((feature) => feature.text);

      locations.forEach(async (location) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=1283bed00690efb2fd36748386cd65ea`;

        const weather = await fetch(url).then((response) => response.json());

        if (weather.cod == 200) {
          // suggestions.push({
          //   name: weather.name,
          //   feels_like: weather.main.feels_like,
          //   icon: weather.weather[0].icon,
          //   main: weather.weather[0].main,
          // });
          setSuggestions((suggestion) => [
            ...suggestion,
            {
              name: weather.name,
              feels_like: weather.main.feels_like,
              icon: weather.weather[0].icon,
              main: weather.weather[0].main,
            },
          ]);
        }
        // setSuggestions(suggestions);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSuggestions(search);
  }, [search]);

  const callWeather = (e) => {
    e.preventDefault();
    // console.log(search);
    const url =
      "https://api.openweathermap.org/data/2.5/forecast" +
      `?q=${search}&units=metric` +
      "&appid=1283bed00690efb2fd36748386cd65ea";
    getWeather(url);
    // setSuggestions([]);
    setSearch("");
  };
  async function getWeather(url) {
    let lastDay;

    const days = [];
    let count = -1;

    const times = [];

    const data = await fetch(url).then((response) => response.json());
    console.log(data);
    const weathers = data.list.filter((item) => {
      const today = item.dt_txt.split(" ")[0];

      const unique = today !== lastDay;

      if (!unique) days[count].push(item);
      else {
        days.push([]);
        count++;
        days[count].push(item);
      }

      lastDay = today;

      return unique;
    });

    days.forEach((day) => {
      const labels = day.map((times) => times.dt_txt.split(" ")[1].slice(0, 5));
      const datasets = [
        {
          label: day[0].weather[0].main,
          fill: false,
          lineTension: 0.5,
          backgroundColor: "#ffffff",
          borderColor: "#87ceeb",
          borderWidth: 2,
          pointRadius: 4,
          data: day.map((times) => times.main.temp),
        },
      ];

      times.push({ labels, datasets });
    });

    setTimes(times);
    setWeathers(weathers);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const url =
          "https://api.openweathermap.org/data/2.5/forecast" +
          `?lat=${latitude}&lon=${longitude}&units=metric` +
          "&appid=1283bed00690efb2fd36748386cd65ea";
        getWeather(url);
      });
    }
  }, []);

  const [mainCard, getmainCard] = useState(null);
  const [smallCard, getsmallCard] = useState(null);
  const smallCardParams = {
    containerClass: "thumb",
    wrapperClass: "wrapper",
    slideClass: "box",
    getSwiper: getsmallCard,
    spaceBetween: 4,
    centeredSlides: true,
    slidesPerView: "auto",
    touchRatio: 0.2,
    slideToClickedSlide: true,
    // watchSlidesProgress: true,
    // watchSlidesVisibility: true,
    // freeMode: true,
    // freeModeSticky: false,
    breakpoints: {
      800: {
        containerClass: "thumb",
        wrapperClass: "wrapper",
        slideClass: "box",
        getSwiper: getsmallCard,
        spaceBetween: 1,
        centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 0.2,
        slideToClickedSlide: true,
      },
    },
  };
  const mainCardParams = {
    centeredSlides: true,
    getSwiper: getmainCard,
    spaceBetween: 10,
    freeModeSticky: true,
  };
  useEffect(() => {
    if (
      mainCard !== null &&
      mainCard.controller &&
      smallCard !== null &&
      smallCard.controller
    ) {
      mainCard.controller.control = smallCard;
      smallCard.controller.control = mainCard;
    }
  }, [mainCard, smallCard]);

  const [show, setShow] = useState(false);

  const reveal = () => {
    setShow(true);
  };
  const close = () => {
    setShow(false);
  };
  // const ad = new Date()
  if (weather.length !== 0) {
    return (
      <div className='Home'>
        <form className='inputWithIcon' onSubmit={callWeather}>
          <input
            type='text'
            placeholder='Enter the city'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // onFocus={reveal}
            // onBlur={close}
          />
          <i className='fa fa-map-marker-alt ' aria-hidden='true'></i>
          <button>
            <i className='fa fa-search ' aria-hidden='true'></i>
          </button>
          {suggestion.length > 0 && (
            <ul className='dropdown'>
              {suggestion.map((sos) => (
                <li
                  className='dropdown-item'
                  key={sos.name}
                  onClick={() => setSearch(sos.name)}
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
          )}
        </form>
        <Swiper {...smallCardParams}>
          {weather.map((single) => (
            <div>
              <h3>{new Date(single.dt_txt).toDateString().split(" ")[0]}</h3>
              <h4>
                <span>{Math.floor(single.main.feels_like)}&#176;</span>&nbsp;
                <span>{Math.floor(single.main.temp_min)}&#176;</span>
              </h4>
              <img src={`/icons/${single.weather[0].icon}.png`} alt='pic' />
              <h4>{single.weather[0].main}</h4>
            </div>
          ))}
        </Swiper>
        <Swiper {...mainCardParams}>
          {weather.map((single, index) => (
            <div>
              <div className='slider'>
                <div className='left'>
                  <div className='row'>
                    <h2>{Math.floor(single.main.feels_like)} &#176;C</h2>
                    <img src={`/icons/${single.weather[0].icon}.png`} alt='' />
                  </div>
                  <Line
                    className='chart'
                    data={times[index]}
                    options={{
                      scales: {
                        yAxes: [
                          {
                            gridLines: {
                              display: false,
                            },
                            ticks: {
                              display: false,
                            },
                          },
                        ],
                      },
                      pan: {
                        enabled: true,
                        mode: "x",
                        speed: 10,
                      },
                      title: {
                        display: false,
                      },
                      legend: {
                        display: false,
                      },
                    }}
                  />
                </div>

                <div className='right-col'>
                  <div className='second-row'>
                    <div className='pressure boxes'>
                      <h4>Pressure</h4>
                      <p>{single.main.pressure} hpa</p>
                    </div>
                    <div className='humidity boxes'>
                      {" "}
                      <h4>Humidity</h4>
                      <p>{single.main.humidity} %</p>
                    </div>
                  </div>
                  <div className='third-row'>HEY</div>
                </div>
              </div>{" "}
            </div>
          ))}
        </Swiper>
      </div>
    );
  } else {
    return (
      <div className='Loader'>
        <div className='warn'>Make sure the device location is on</div>
        <div className='load'></div>
        <div className='tell'>Please Wait</div>
      </div>
    );
  }
};

export default Home;
