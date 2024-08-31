

const { createApp } = Vue;

const appCreation = createApp({
    data() {
        return {
        message: 'Hello Vue!',
        elements: []
        }
    },
    methods: {

    }
}).mount('#app')

