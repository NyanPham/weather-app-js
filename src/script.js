import css from './style.css'

const API_KEY = process.env.WEATHER_APP_API_KEY
const API_LINK = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Ho%20Chi%20Minh&days=7&aqi=no&alerts=no`

console.log(API_KEY)

// for styling the arrow button and animation 
const forecastToggleBtn = document.querySelector('.forecast-weather-toggle')
const forecastWeatherContainer = document.querySelector('.forecast-weather')
const forecastDays = document.querySelectorAll('.forecast-day')


forecastToggleBtn.addEventListener('click', () => {
    forecastWeatherContainer.classList.toggle('visible')
})

// main fetching
const locationElement = document.querySelector('[data-location]')
const dateElement = document.querySelector('[data-date]')
const averageTempElement = document.querySelector('[data-current-avg-temp]')
const descriptionElement = document.querySelector('[data-description]')
const currentHighTempElement = document.querySelector('[data-high-temp]')
const currentLowTempElement = document.querySelector('[data-low-temp]')
const windElement = document.querySelector('[data-wind]')
const rainChanceElement = document.querySelector('[data-rain-chance]')
const unitToggleBtn = document.querySelector('[data-unit-toggle]')
const metricInput = document.getElementById('cel')
const imperialInput = document.getElementById('fah')
const tempUnits = document.querySelectorAll('[data-temp-unit]')
const speedUnits = document.querySelectorAll('[data-speed-unit]')
const forecastTemplate = document.getElementById('forecast-day-template')
const forecastDaysContainer = document.querySelector('[data-forecast-days-container]')
const icons = document.querySelectorAll('.weather-icon')

const WEATHER_ICON_MAP = [
    {
        description: ['Sunny', 'Clear'],
        iconName: 'sun'
    },
    {
        description: ['Partly cloudy', 'Cloudy'],
        iconName: 'sun-cloud'
    },
    {
        description: ['Patchy rain possible', 'Light drizzle', 'Light rain'],
        iconName: 'sun-cloud-rain'
    },
    {
        description: ['Light rain shower', 'Moderate rain'],
        iconName: 'rain'
    },
    {
        description: 'Overcast',
        iconName: 'smog'
    },
    
]

let currentLocation
let weathers
let selectedDayIndex = 0




unitToggleBtn.addEventListener('click', () => {
    const isMetricUnit = isMetric()
    metricInput.checked = !isMetricUnit
    imperialInput.checked = isMetricUnit

    showSelectedDayWeather(selectedDayIndex)
    showForecastDays()
    setUnits()
})


getWeather().then(({ weatherList, location }) => {
    weathers = weatherList
    currentLocation = location
    showSelectedDayWeather(selectedDayIndex)
    showForecastDays()
})

setUnits()

async function getWeather() {
    return await fetch(API_LINK)
            .then(res => res.json())
            .then(data => {
                const weatherList = data.forecast.forecastday.map(day => {
                    return {
                        date: day.date,
                        averageTempC: day.day.avgtemp_c,
                        averageTempF: day.day.avgtemp_f,
                        description: day.day.condition.text,
                        chanceOfRain: day.day.daily_chance_of_rain,
                        maxTempC: day.day.maxtemp_c,
                        maxTempF: day.day.maxtemp_f,
                        minTempC: day.day.mintemp_c,
                        minTempF: day.day.mintemp_f,
                        windSpeedKph: day.day.maxwind_kph,
                        windSpeedMph: day.day.maxwind_mph,
                    }
                })
                weatherList[0] = {
                    ...weatherList[0],
                    averageTempC: data.current.feelslike_c,
                    averageTempF: data.current.feelslike_f,
                    description: data.current.condition.text,
                    windSpeedKph: data.current.wind_kph,
                    windSpeedMph: data.current.wind_mph,
                }
                return {
                    weatherList,
                    location: `${data.location.name}, ${data.location.country}`
                }
            })
}


function showSelectedDayWeather(dayIndex) {
    const weather = weathers[dayIndex]
    locationElement.innerText = currentLocation
    dateElement.innerText = formatDate(weather.date)
    averageTempElement.innerText = formatTemp(weather.averageTempC, weather.averageTempF)
    descriptionElement.innerText = weather.description
    currentHighTempElement.innerText = formatTemp(weather.maxTempC, weather.maxTempF)
    currentLowTempElement.innerText = formatTemp(weather.minTempC, weather.minTempF)
    windElement.innerText = formatSpeed(weather.windSpeedKph, weather.windSpeedMph)
    rainChanceElement.innerText = weather.chanceOfRain
    getCurrentIcon(weather.description)
}

function showForecastDays() {
    clearElementChildren(forecastDaysContainer)
    weathers.forEach((day, index) => {
        const forecastDayElement = forecastTemplate.content.cloneNode(true)
        forecastDayElement.querySelector('[data-forecast-date]').innerText = formatDate(day.date)
        forecastDayElement.querySelector('[data-forecast-high-temp]').innerText = formatTemp(day.maxTempC, day.maxTempF)
        forecastDayElement.querySelector('[data-forecast-low-temp]').innerText = formatTemp(day.minTempC, day.minTempF)
        forecastDayElement.querySelectorAll('[data-temp-unit]').forEach(unit => {
            unit.innerText = isMetric() ? 'C' : 'F'
        })
        forecastDayElement.querySelector('[data-read-more-button]').addEventListener('click', () => {
            selectedDayIndex = index
            showSelectedDayWeather(selectedDayIndex)
        })
        forecastDaysContainer.appendChild(forecastDayElement)
    })
}

function formatTemp(tempC, tempF) {
    if (isMetric()) return Math.floor(tempC)
    return Math.floor(tempF)
}

function formatSpeed(speedKph, speedMph) {
    if (isMetric()) return Math.floor(speedKph)
    return Math.floor(speedMph)
}

function formatDate(date) {
    return new Date(date).toLocaleDateString(
        undefined,
        {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
} 

function isMetric() {
    return metricInput.checked
}

function setUnits() {
    tempUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'C' : 'F'
    })

    speedUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'kph' : 'mph'
    })
}

function clearElementChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function getCurrentIcon(description) {
    const currentWeather = WEATHER_ICON_MAP.find(weather =>( weather.description === description || weather.description.includes(description)))
    icons.forEach(icon => {
        icon.classList.remove('visible')
    })

    document.getElementById(`${currentWeather.iconName}`).classList.add('visible')

}