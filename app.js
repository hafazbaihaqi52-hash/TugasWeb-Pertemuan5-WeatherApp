const API_KEY = "95edf89900e58d0da7dfbd344bc1018f";

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherResult = document.getElementById("weatherResult");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherDetails = document.getElementById("weatherDetails");


// ================================
// Menampilkan Loading
// ================================
const showLoading = () => {
    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    weatherResult.classList.add("hidden");
};


// ================================
// Menyembunyikan Loading
// ================================
const hideLoading = () => {
    loading.classList.add("hidden");
};


// ================================
// Menampilkan Error
// ================================
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    weatherResult.classList.add("hidden");
};


// ================================
// Menampilkan Data Cuaca
// ================================
const displayWeather = (data) => {

    cityName.textContent = data.name;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        data.weather[0].description;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;


    // Array untuk detail cuaca
    const details = [
        {
            label: "Kelembaban",
            value: `${data.main.humidity}%`
        },
        {
            label: "Terasa Seperti",
            value: `${Math.round(data.main.feels_like)}°C`
        },
        {
            label: "Tekanan",
            value: `${data.main.pressure} hPa`
        },
        {
            label: "Kecepatan Angin",
            value: `${data.wind.speed} m/s`
        }
    ];


    // Menggunakan map()
    weatherDetails.innerHTML = details
        .map(detail => `
            <div class="detail-item">
                <strong>${detail.label}</strong>
                <span>${detail.value}</span>
            </div>
        `)
        .join("");


    weatherResult.classList.remove("hidden");
};


// ================================
// Mengambil Data Cuaca
// ================================
const getWeather = async (city) => {

    showLoading();

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;

        const response = await fetch(url);


        // Kota tidak ditemukan
        if (response.status === 404) {
            throw new Error("Kota tidak ditemukan.");
        }


        // API Key salah / masalah API lainnya
        if (response.status === 401) {
            throw new Error(
                "API Key tidak valid atau belum aktif."
            );
        }


        // Error lainnya dari server
        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.message || "Gagal mengambil data cuaca."
            );
        }


        // Mengubah response menjadi JSON
        const data = await response.json();


        // Menampilkan hasil
        displayWeather(data);


    } catch (error) {

        console.error("Error:", error);


        // Error koneksi internet
        if (error instanceof TypeError) {

            showError(
                "Terjadi kesalahan jaringan. Periksa koneksi internet kamu."
            );

        } else {

            showError(error.message);

        }

    } finally {

        hideLoading();

    }
};


// ================================
// Saat tombol Cari ditekan
// ================================
weatherForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const city = cityInput.value.trim();


    // Jika input kosong
    if (city === "") {

        showError(
            "Silakan masukkan nama kota."
        );

        return;
    }


    // Ambil data cuaca
    getWeather(city);

});