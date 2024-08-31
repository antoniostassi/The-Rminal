

const { createApp } = Vue;

const appCreation = createApp({
    data() {
        return {
        historyChat: [
            ""
        ],
        textInput: "",
        character: {
            lastLogin: "Sat Aug 31 12:31:09",
            userName: "antoniostassi",
            machineName: "apple-m3"
        },
        idling: true,
        terminal: ""
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
        },
        createTerminal() {
            this.terminal = "Last login: "+(this.character.lastLogin)+" "+this.character.userName+"@"+this.character.machineName;
        }
    },
    mounted() {
        this.createTerminal();
    }
}).mount('#TheRminal')

