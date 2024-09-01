

const { createApp } = Vue;

const appCreation = createApp({
    data() {
        return {
        character: {
            lastLogin: "",
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
            {
                trigger:"github",
                function:"printSomething('JS Developer: https://github.com/antoniostassi','Illustrator: https://github.com/margheritamottana')",
                description:"Creators of The Rminal"
            },
            {
                trigger:"ls",
                function:"ls()",
                description:"Print list of contents of the directory"
            },
            {
                trigger:"cd",
                function:"cd(this.textInput)",
                description:"Navigate inside a folder/directory"
            },
            {
                trigger:"dir",
                function:"printSomething(this.currentDir);",
                description:"Print your current directory"
            }
        ],
        directoryContents: {
            "C:/": {
                contents:"Applications, Music, Downloads, Documents"
            },
            "C:/applications": {
                contents: "Github-Desktop.exe, VisualStudioCode.exe, DonkeyKong.exe, newfolder"
            },
            "C:/applications/newfolder": {
                contents: "Github-Desktop"
            }
        }
        ,
        currentDir: "C:/",
        commandFound: false
        }
    },
    methods: {
        tryCmd() {
            this.historyChat.push("---------------");
            this.historyChat.push(this.terminal + " ~ % " + this.textInput);
            this.historyChat.push("---------------");
            
            let firstWordCommand = this.textInput.match(/\w+/g)[0];
            this.commands.forEach(element => {
                if(this.isMatch(element.trigger, firstWordCommand)) { // Way better 
                //if (this.textInput.includes(element.trigger)) {
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
        printSomething(arg, arg2, arg3, arg4) {
            this.historyChat.push(arg);
            this.historyChat.push(arg2);
            this.historyChat.push(arg3);
            this.historyChat.push(arg4);
        },
        clearChat() {
            this.historyChat = [];
            console.log("Chat has been cleaned.");
        },
        help() {
            this.commands.forEach(element => {
                this.historyChat.push(element.trigger + " | " + element.description);
            });
        },
        ls(){
            this.historyChat.push(this.directoryContents[this.currentDir].contents);
        },
        cd(directory){
            const newDir = directory.match(/\w+/g)[1]; // Selezione la prima parola subito dopo il "cd";
            const actualDir = this.directoryContents[this.currentDir].contents.toLowerCase(); // Variabile contentente i contents della directory attuale
            if (directory.trim() == "cd ..") {
                const slashes = (this.currentDir.split("/").length - 1); //3

                const previousDir = []; // Array per salvare ogni singola cartella del percorso
                for(let i=0; i<slashes; i++){
                    previousDir[i] = this.currentDir.trim().split('/')[i]; // Prendi ad uno ad uno le cartelle prima di ogni " / "
                }
                //console.table(previousDir);

                this.currentDir = ""; // Reinizializza la directory
                previousDir.forEach(value => { // Per ogni cartella delle cartelle della directory
                    this.currentDir += value + "/"; // Inseriscile ad 1 ad 1 nella current Directory
                }); // Fino a formare la directory giusta

                //console.table(previousDir);
                //console.log(this.currentDir);
                if (this.currentDir.length > 3){ // Se il percorso non è C:/
                    this.currentDir = this.currentDir.slice(0, -1); // Rimuove l'ultimo " / "
                }
                this.historyChat.push("Current Directory: "+ this.currentDir);
            }
            else if(this.isMatch(actualDir, newDir.toLowerCase())) {
                this.currentDir += "/"+newDir.toLowerCase();
                this.currentDir = this.currentDir.replace("C://", "C:/");
                this.historyChat.push("Current Directory: "+ this.currentDir);
            } else {
                this.historyChat.push("Directory: "+ this.currentDir + newDir + " does not exists!");
                this.textInput = '';
            };
        },
        isMatch(searchOnString, searchText) { // Funzione per checkare l'esistenza dell'intera parola all'interno di una stringa
            searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return searchOnString.match(new RegExp("\\b"+searchText+"\\b", "i")) != null;
        }
    },
    mounted() {
        this.createTerminal();
    }
}).mount('#TheRminal')

