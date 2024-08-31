

const { createApp } = Vue;

const appCreation = createApp({
    data() {
        return {
        character: {
            lastLogin: "Sat Aug 31 12:31:09",
            userName: "maliktm",
            machineName: "apple-m3"
        },
        historyChat: [
            ""
        ],
        textInput: "",
        idling: true,
        terminal: "",
        commands: [
            {
                trigger:"help",
                function:"help()",
                description:"Print a list of known commands"
            },
            {
                trigger:"clear",
                function:"clearChat()",
                description:"Clear the chat logs"
            },
        ],
        commandFound: false
        
        }
    },
    methods: {
        tryCmd() {
            this.commands.forEach(element => {
                if (this.textInput.includes(element.trigger)) {
                    eval("this."+element.function);
                    this.commandFound = true;
                }
            });
            if (!this.commandFound) {
                this.historyChat.push("'"+this.textInput.trim()+"' does not exists as a command. Try to write 'help'");
            }
            this.commandFound = false;
            this.textInput = "";
        },
        createTerminal() {
            this.terminal = "Last login: "+(this.character.lastLogin)+" "+this.character.userName+"@"+this.character.machineName;
        },
        clearChat() {
            this.historyChat = [];
            console.log("Chat has been cleaned.");
        },
        help() {
            this.commands.forEach(element => {
                this.historyChat.push(element.trigger + " | " + element.description);
            });
        }
    },
    mounted() {
        this.createTerminal();
    }
}).mount('#TheRminal')

