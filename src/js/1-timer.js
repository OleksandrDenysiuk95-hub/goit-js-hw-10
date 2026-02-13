// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysVal = document.querySelector('[data-days]');
const hoursVal = document.querySelector('[data-hours]');
const minutesVal = document.querySelector('[data-minutes]');
const secondsVal = document.querySelector('[data-seconds]');

let timerId = null;
let selectedDate = null;

// Спочатку деактивуємо кнопку, поки не обрана дата
startBtn.disabled = true;

// Ініціалізація flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        if (options.defaultDate >= selectedDates[0]) {
            startBtn.disabled = true;

            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });

        } else {
            startBtn.disabled = false;

            iziToast.success({
                title: 'OK',
                message: 'You can press "Start"!',
            });
        }
    },
};


flatpickr(datetimePicker, options);

// Функція для додавання нуля (01 замість 1)
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

// Функція розрахунку часу
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Обробка натискання Start
startBtn.addEventListener('click', () => {
    // Блокуємо інтерфейс
    startBtn.disabled = true;
    datetimePicker.disabled = true;

    timerId = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = selectedDate - currentTime;

        if (deltaTime <= 0) {
            clearInterval(timerId);
            updateInterface(0, 0, 0, 0);
            datetimePicker.disabled = false; // Робимо інпут активним після завершення
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(deltaTime);
        updateInterface(days, hours, minutes, seconds);
    }, 1000);
});

function updateInterface(d, h, m, s) {
    daysVal.textContent = d; // Дні можуть бути більше 2 цифр, не форматуємо примусово до 2
    hoursVal.textContent = addLeadingZero(h);
    minutesVal.textContent = addLeadingZero(m);
    secondsVal.textContent = addLeadingZero(s);
}
