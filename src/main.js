import { createApp } from 'vue'
import App from './App.vue'
import lastfmService from './services/lastfm-service'

const app = createApp(App);

app.config.globalProperties.$lastfmService = lastfmService;

app.mount('#app');
