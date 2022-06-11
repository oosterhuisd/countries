import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

// Fixes flag support for Windows, because Windows does not support flag emojis (yes omg)
// https://github.com/talkjs/country-flag-emoji-polyfill
polyfillCountryFlagEmojis();

createApp(App).mount('#app')
