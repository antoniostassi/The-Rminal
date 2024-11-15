

const { createApp } = Vue;

const appCreation = createApp({
    data() {
        return {
        character: {
            lastLogin: "",
            userName: "antoniostassi",
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
                function:"printSomething('JS Developer: https://github.com/antoniostassi')",
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
                description:"Syntax 'cd <foldername>' navigate inside a folder/directory, 'cd ..' to go back."
            },
            {
                trigger:"dir",
                function:"printSomething(this.currentDir);",
                description:"Print your current directory"
            },
            {
                trigger:"mkdir",
                function:"mkdir(this.textInput.trim())",
                description:"Syntax 'mkdir <foldername>' creates a folder"
            },
            {
                trigger:"clearcache",
                function:"clearCache()",
                description:"It will remove all datas you created, deleting your localStorage item."
            }
        ],
        directoryContents: {
            "C:/": {
                contents:"Applications  Music  Downloads  Documents"
            },
            "C:/applications/": {
                contents: "Github-Desktop.exe  VisualStudioCode.exe  DonkeyKong.exe"
            },
            "C:/music/": {
                contents: ""
            },
            "C:/downloads/": {
                contents: " "
            },
            "C:/documents/": {
                contents: "null"
            },

        }
        ,
        currentDir: "C:/",
        commandFound: false
        }
    },
    methods: {
        tryCmd() {
            this.historyChat.push(this.terminal + " ~ % " + this.textInput);
            
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
            this.textInput = '';
        },
        createTerminal() {
            this.terminal = (this.character.lastLogin)+" "+this.character.userName+"@"+this.character.machineName;
        },
        printSomething(arg) {
            this.historyChat.push(arg);
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
            console.log(this.directoryContents);
        },
        cd(directory){
            this.textInput = '';
            const newDir = directory.match(/\w+/g)[1]; // Selezione la prima parola subito dopo il "cd";
            const actualDir = this.directoryContents[this.currentDir].contents.toLowerCase(); // Variabile contentente i contents della directory attuale
            if (directory.trim() == "cd .." && this.currentDir != "C:/") {

                this.currentDir = this.currentDir.slice(0, -1); // Rimuove l'ultimo " / "
                const slashes = (this.currentDir.split("/").length - 1); //3

                const previousDir = []; // Array per salvare ogni singola cartella del percorso
                for(let i=0; i<slashes; i++){
                    previousDir[i] = this.currentDir.trim().split('/')[i]; // Prendi ad uno ad uno le cartelle prima di ogni " / "
                }

                this.currentDir = ""; // Reinizializza la directory
                previousDir.forEach(value => { // Per ogni cartella delle cartelle della directory
                    this.currentDir += value + "/"; // Inseriscile ad 1 ad 1 nella current Directory
                }); // Fino a formare la directory giusta

                this.historyChat.push("Current Directory: "+ this.currentDir);
            }
            else if(this.isMatch(actualDir, newDir.toLowerCase()) && (!directory.trim().includes(".exe"))) {
                this.currentDir += "/"+newDir.toLowerCase()+"/";
                this.currentDir = this.currentDir.replace("//", "/");
                this.historyChat.push("Current Directory: "+ this.currentDir);
            } else {
                const errorString = directory.replace("cd ", "");
                this.historyChat.push("Directory: "+ this.currentDir + errorString + " does not exists or is not a directory!");
                this.textInput = '';
            };
        },
        mkdir(directory){
            const folderName = directory.match(/\w+/g)[1]; // Selezione la prima parola subito dopo il "cd";
            const directoryNewFolder = this.currentDir+"/"+folderName.toLowerCase();
            const objectIndex = directoryNewFolder.replace("//","/");
            this.directoryContents[this.currentDir].contents += "  "+folderName; // Aggiunge la cartella tra i contents della directory corrente.
            this.directoryContents[objectIndex+"/"] = {contents: " "}; // Aggiunge l'object che ha come index il percorso per la cartella corretto.
            localStorage.setItem("directoryContents", this.directoryContents);
            this.updateCache();
        },
        isMatch(searchOnString, searchText) { // Funzione per checkare l'esistenza dell'intera parola all'interno di una stringa
            searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return searchOnString.match(new RegExp("\\b"+searchText+"\\b", "i")) != null;
        },
        updateCache(){
            localStorage.setItem("directoryContents", JSON.stringify(this.directoryContents));
            console.log("Updated");
        },
        clearCache() {
            localStorage.removeItem('directoryContents');
            console.log("Cache cleaned successfully");
            location.reload(); // Refresh the page.
            this.historyChat.push('Cache cleaned successfully');
        }
    },
    mounted() {
        if (localStorage.getItem("directoryContents") != null) { // Se lo storage "directoryContents" esiste, aggiorna "this.directoryContents"
            this.directoryContents = JSON.parse(localStorage.getItem("directoryContents"));
        } else { // Altrimenti
            localStorage.setItem("directoryContents", JSON.stringify(this.directoryContents)); // Crea lo storage "directoryContents" attribuendogli il valore JSON stringato di this.directoryContents
        }
        this.createTerminal();
    },
    
}).mount('#TheRminal')


