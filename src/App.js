import "./App.css";
import Inputs from "./components/InputsField";
import TimeAndLocation from "./components/locationTimeDetails";
import TemperatureAndDetails from "./components/TemperatureDetails";
import Forecast from "./components/ForecastDetails";
import getFormattedWeatherData from "./fetch/getweatherData";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import React from "react";
function App() {
  const [query, setQuery] = useState({ q: "Jharkhand" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location.";

      toast.info("loading weather for " + message);

      await getFormattedWeatherData({ ...query, units }).then((data) => {
        toast.success(
          `Successfully loaded weather for ${data.name}, ${data.country}.`
        );
        setWeather(data);
      });
    };

    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather)
      return "https://getwallpapers.com/wallpaper/full/0/a/7/1172834-cold-weather-wallpaper-1920x1080-pc.jpg";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold)
      return "https://getwallpapers.com/wallpaper/full/0/a/7/1172834-cold-weather-wallpaper-1920x1080-pc.jpg";

    return "https://th.bing.com/th/id/R.81520428813e8ed349d9f52bb1a641eb?rik=7gaulZf%2fJ5DjMw&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f8%2f4%2fd%2f924696-large-sunny-day-background-1920x1080-for-4k-monitor.jpg&ehk=T2sWWp7YSJi%2fb7KKj1HYc18mL8PAZn20y0Fi6PJcBRA%3d&risl=&pid=ImgRaw&r=0";
  };
  const customStyles = {
    content: { 
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "50%",
      marginRight: "-50%",
      background: "black",
      transform: "translate(-50%, -50%)",
    },
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpen2, setIsOpen2] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function openModal2() {
    setIsOpen2(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  function closeModal2() {
    setIsOpen2(false);
  }
  return (
    <div
      style={{
        padding: "3rem",
        background: `url(${formatBackground()})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.582)", padding: "3rem" }}>
        <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

        {weather && (
          <div>
            <TemperatureAndDetails weather={weather} />
            <div>
              <div style={{ textAlign: "center" }}>
                <button
                  className="bg-grey-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={openModal}
                >
                  View hourly forecast
                </button>
                <button
                  className="bg-grey-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={openModal2}
                >
                  View 7 day forecast
                </button>
              </div>
              <TimeAndLocation weather={weather} />

              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <Forecast title="hourly forecast" items={weather.hourly} />
              </Modal>
              <Modal
                isOpen={modalIsOpen2}
                onRequestClose={closeModal2}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <Forecast title="daily forecast" items={weather.daily} />
              </Modal>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
