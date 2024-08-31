

const { createApp } = Vue;

const appCreation = createApp({
    data() {
        return {
        historyChat: [
            ""
        ],
        textInput: "",
        character: {
            userName: "antoniostassi",
            machineName: "TheRminal"
        },
        idling: true 
        }
    },
    methods: {
        tryCmd() {
            if( this.textInput == 'clear' ) { // Se il comando eseguito è "clear"
                this.historyChat = ""; // Pulisci la chat
            } else {
                this.sendCmd(this.textInput);
            }
            this.textInput = "";
        },
        sendCmd(input) {
            this.historyChat.push(input);
        }
    }
}).mount('#TheRminal')

