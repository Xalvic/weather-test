import React, { useState, useEffect } from "react";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.min.css";
import { Line } from "react-chartjs-2";

const Home = () => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        // const api = `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=1283bed00690efb2fd36748386cd65ea`;

        async function getSposts() {
          let lastDay;
          const data = await fetch(
            `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=1283bed00690efb2fd36748386cd65ea`
          );
          const spots = await data.json();
          const { list } = spots;
          const weathers = list.filter((item) => {
            const today = item.dt_txt.split(" ")[0];
            const unique = today !== lastDay;
            lastDay = today;
            return unique;
          });
          setWeather(weathers);
        }
        getSposts();
      });
    }
  }, []);

  console.log(weather);
  const state = {
    labels: ["9am", "10am", "11am", "12am", "1pm", "2pm"],
    datasets: [
      {
        label: "Rainfall",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "#ffffff",
        borderColor: "#87ceeb",
        borderWidth: 2,
        pointRadius: 4,
        data: [56, 60, 70, 75, 77, 74],
      },
    ],
  };

  const [mainCard, getmainCard] = useState(null);
  const [smallCard, getsmallCard] = useState(null);
  const smallCardParams = {
    containerClass: "thumb",
    wrapperClass: "wrapper",
    slideClass: "box",
    getSwiper: getsmallCard,
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: "auto",
    touchRatio: 0.2,
    slideToClickedSlide: true,
  };
  const mainCardParams = {
    getSwiper: getmainCard,
    spaceBetween: 10,
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

  // const ad = new Date()
  if (weather.length !== 0) {
    return (
      <div className='Home'>
        <form className='inputWithIcon'>
          <input type='text' placeholder='Enter the city' />
          <i className='fa fa-map-marker-alt ' aria-hidden='true'></i>
          <i className='fa fa-search ' aria-hidden='true'></i>
        </form>
        <Swiper {...smallCardParams}>
          {weather.map((single) => (
            <div>
              <h3>{new Date(single.dt_txt).toDateString().split(" ")[0]}</h3>
              <h3>{single.main.feels_like}&#176;</h3>
              <img
                src={`http://openweathermap.org/img/wn/${single.weather[0].icon}@2x.png`}
                alt='pic'
              />
              <h4>{single.weather[0].description}</h4>
            </div>
          ))}
        </Swiper>
        <Swiper {...mainCardParams}>
          {weather.map((single) => (
            <div>
              <div className='slider'>
                <div className='row'>
                  <h2>{single.main.feels_like} &#176;C</h2>
                  <img
                    src={`http://openweathermap.org/img/wn/${single.weather[0].icon}@2x.png`}
                    alt=''
                  />
                </div>
                <Line
                  data={state}
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
                    title: {
                      display: false,
                    },
                    legend: {
                      display: false,
                    },
                  }}
                />
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
              </div>{" "}
            </div>
          ))}
        </Swiper>
      </div>
    );
  } else {
    return null;
  }
};

export default Home;
