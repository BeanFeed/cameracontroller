// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt'],
  colorMode: {
    preference: 'dark'
  },
  ssr: false,
  imports: {
      autoImport: true,
      dirs: [
          '~/requests.js',
          '~/stores/**'
      ]
  }

})