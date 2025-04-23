

const { createApp } = Vue;

const appCreation = createApp({
    data() {
        return {
        character: {
            lastLogin: "",
            userName: "malik",
            machineName: "1shot"
        },
        historyChat: [
            ""
        ],
        textInput: "",
        idling: true,
        attitudinalTest: {
            live: false,
            round: 0
        },
        firstAudio: null,
        secondAudio: null,
        terminal: "",
        bootLines: [
            "[BOOT] Initializing system modules...",
            "[ OK ] Kernel loaded successfully",
            "[ OK ] Network interface initialized",
            "[ OK ] Loading user interface modules...",
            "[WARN] BIOS settings not optimized",
            "[ OK ] Launching main interface...",
            "Welcome to eDEX-UI"
        ],
        logoScreen: document.getElementById('logo-screen'),
        bootScreen: document.getElementById('boot-screen'),
        bootLog:document.getElementById('boot-log'),
        typeCount: 0,

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
            },
            {
                trigger:"testattitudinale",
                function:"testAttitudinale()",
                description:"Fai partire il test attitudinale."
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
            if(this.attitudinalTest.live) { // Se il test è attivo

                if(this.attitudinalTest.round === 0 ) { // Se sei al round 0, dunque stai avviando adesso il test
                    if(this.textInput.trim().toLowerCase() != "sonopronto") { // Controlla se stai scrivendo "sonopronto".
                        this.historyChat.push("'"+this.textInput.trim()+"' non è un comando valido. Test Attitudinale fallito, ridigita il comando 'testattitudinale' per riavviarlo.");
                        this.textInput = "";
                        this.attitudinalTest.live = false;
                        return;
                    }
                    else {
                        this.clearChat();
                        this.textInput = "";
                        this.attitudinalTest.round = 1;
                        this.iniziaDomande(this.attitudinalTest.round);
                        return;
                    }
                }

                if (this.textInput.trim().toLowerCase() == "a" | this.textInput.trim().toLowerCase() == "b" | this.textInput.trim().toLowerCase() == "c" | this.textInput.trim().toLowerCase() == "d" ) {
                    this.clearChat();
                    if(this.attitudinalTest.round === 14) {
                        this.historyChat.push(this.terminal + " ~ % " + this.textInput);
                        this.textInput = "";
                        this.clearChat();
                        const result = Math.floor(Math.random() * (100 - 50) ) + 50;
                        this.historyChat.push("Grazie per aver partecipato al Test Attitudinale.");
                        this.historyChat.push("Il tuo punteggio è di: " + result);
                        this.historyChat.push("--");
                        this.historyChat.push("Un punteggio è considerato 'ottimo' se maggiore di 80.");
                        this.historyChat.push("--");
                        this.secondAudio.play();
                        this.attitudinalTest.live = false;
                        this.attitudinalTest.round = 0;
                        return;
                    }
                    this.historyChat.push(this.terminal + " ~ % " + this.textInput);
                    this.textInput = "";
                    this.attitudinalTest.round++;
                    this.iniziaDomande(this.attitudinalTest.round);
                } else {
                    this.clearChat();
                    this.historyChat.push("ERROR: Scegli una risposta digitando la lettera corrispondente.");
                    this.historyChat.push("Esempio: A");
                    this.textInput = "";
                    this.iniziaDomande(this.attitudinalTest.round);
                }
                return;
            }
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
            this.typeLine();
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
        },
        testAttitudinale() {
            this.attitudinalTest.live = true;
            this.historyChat.push('Benvenuto nel Test Attitudinale di ARCA2123.');
            this.historyChat.push('Di seguito ti verranno poste delle domande a risposta multipla.');
            this.historyChat.push('Cerca di rispondere nella maniera più sincera possibile.');
            this.historyChat.push('Non appena sei pronto, digita SONOPRONTO per avviare il test.');
            this.historyChat.push('Scadenza: 30 Minuti.');
        },
        iniziaDomande(round) {
            this.firstAudio.play();
            switch (key = round) {
                case key = 1:
                    this.historyChat.push('--');
                    this.historyChat.push("**Un compagno di squadra sta per commettere un errore fatale durante una riparazione critica. Cosa fai?**");
                    this.historyChat.push("A) Lo correggo subito, anche se lo umilio di fronte agli altri.");
                    this.historyChat.push("B) Aspetto che sbagli per poi intervenire e guadagnare il merito.");
                    this.historyChat.push("C) Lo aiuto discretamente, evitando che perda credibilità.");
                    this.historyChat.push("D) Lo lascio sbagliare: la selezione naturale farà il resto.");
                    this.historyChat.push('--');
                    break;

                case key = 2:
                    this.historyChat.push('--');
                    this.historyChat.push("**Se il Consiglio ti affidasse una missione rischiosa, sapendo che potresti non tornare, cosa faresti?**");
                    this.historyChat.push("A) Accetto senza esitazione: meglio morire utile che vivere senza scopo.");
                    this.historyChat.push("B) Cerco di convincere qualcun altro a prendere il mio posto.");
                    this.historyChat.push("C) Accetto, ma solo se posso scegliere il mio equipaggiamento.");
                    this.historyChat.push("D) Rifiuto: la mia vita è più importante della missione.");
                    this.historyChat.push('--');
                    break;

                case key = 3:
                    this.historyChat.push('--');
                    this.historyChat.push("**Durante la crisi della ventilazione, quale sistema secondario è stato usato per filtrare l’aria temporaneamente?**");
                    this.historyChat.push("A) Il sistema di raffreddamento del reattore.");
                    this.historyChat.push("B) I condotti di emergenza collegati alla serra idroponica.");
                    this.historyChat.push("C) Le riserve d’ossigeno dei vecchi moduli criogenici.");
                    this.historyChat.push("D) Nessuno, siamo rimasti senza ossigeno per 12 ore.");
                    this.historyChat.push('--');
                break;

                case key = 4:
                    this.historyChat.push('--');
                    this.historyChat.push("**Chi era l’ultimo ingegnere capo del bunker prima che il Consiglio ne assumesse il controllo?**");
                    this.historyChat.push("A) Dr. Harlan Voss.");
                    this.historyChat.push("B) Comandante Eli Vargas.");
                    this.historyChat.push("C) Nessuno lo sa, i documenti su di lui sono spariti.");
                    this.historyChat.push("D) Non c’è mai stato un ingegnere capo, il bunker è stato lasciato incompiuto.");
                    this.historyChat.push('--');
                break;

                case key = 5:
                    this.historyChat.push('--');
                    this.historyChat.push("**Se un generatore al plasma inizia a surriscaldarsi, qual è la prima cosa da fare?**");
                    this.historyChat.push("A) Raffreddarlo con azoto liquido.");
                    this.historyChat.push("B) Scollegare il sistema di alimentazione principale.");
                    this.historyChat.push("C) Deviare l’energia su un circuito secondario.");
                    this.historyChat.push("D) Aumentare la pressione nei condotti per ridurre il rischio di implosione.");
                    this.historyChat.push('--');
                break;
                
                case key = 6:
                    this.historyChat.push('--');
                    this.historyChat.push("**Quale di questi materiali è il più adatto per isolare un cavo ad alta tensione?**");
                    this.historyChat.push("A) Rame.");
                    this.historyChat.push("B) Polietilene.");
                    this.historyChat.push("C) Acciaio al carbonio.");
                    this.historyChat.push("D) Titanio.");
                    this.historyChat.push('--');
                break;

                case key = 7:
                    this.historyChat.push('--');
                    this.historyChat.push("**Qual è il gas più abbondante nell’atmosfera terrestre?**");
                    this.historyChat.push("A) Ossigeno.");
                    this.historyChat.push("B) Azoto.");
                    this.historyChat.push("C) Anidride carbonica.");
                    this.historyChat.push("D) Idrogeno.");
                    this.historyChat.push('--');
                break;

                case key = 8:
                    this.historyChat.push('--');
                    this.historyChat.push("**Quale di questi metalli arrugginisce più velocemente se esposto all’acqua?**");
                    this.historyChat.push("A) Alluminio.");
                    this.historyChat.push("B) Rame.");
                    this.historyChat.push("C) Ferro.");
                    this.historyChat.push("D) Argento.");
                    this.historyChat.push('--');
                break;

                case key = 9:
                    this.historyChat.push('--');
                    this.historyChat.push("**Se un motore si blocca per attrito eccessivo, quale metodo è più efficace per risolvere il problema?**");
                    this.historyChat.push("A) Aggiungere olio lubrificante.");
                    this.historyChat.push("B) Raffreddare il motore prima di riavviarlo.");
                    this.historyChat.push("C) Aumentare la tensione per forzare la rotazione.");
                    this.historyChat.push("D) Smontarlo e riparare le componenti usurate.");
                    this.historyChat.push('--');
                break;

                case key = 10:
                    this.historyChat.push('--');
                    this.historyChat.push("**Qual è il principale svantaggio di usare energia solare in ambienti sotterranei?**");
                    this.historyChat.push("A) La temperatura eccessiva può danneggiare i pannelli.");
                    this.historyChat.push("B) L’energia generata è troppo instabile per essere immagazzinata.");
                    this.historyChat.push("C) Non ricevendo luce solare, è impossibile usarla direttamente.");
                    this.historyChat.push("D) Le batterie si esauriscono troppo rapidamente.");
                    this.historyChat.push('--');
                break;

                case key = 11:
                    this.historyChat.push('--');
                    this.historyChat.push("**Nel bunker, quale risorsa è stata sacrificata per mantenere attivo il sistema idrico?**");
                    this.historyChat.push("A) Le riserve di carburante.");
                    this.historyChat.push("B) L’energia del reattore principale.");
                    this.historyChat.push("C) L’ossigeno disponibile.");
                    this.historyChat.push("D) Il sistema di filtraggio dell’aria.");
                    this.historyChat.push('--');
                break;

                case key = 12:
                    this.historyChat.push('--');
                    this.historyChat.push("**Perché la pioggia tossica non è evaporata nel tempo?**");
                    this.historyChat.push("A) La contaminazione si rigenera attraverso il suolo.");
                    this.historyChat.push("B) L’atmosfera è diventata instabile e la trattiene.");
                    this.historyChat.push("C) Le piogge sono controllate artificialmente da un sistema ignoto.");
                    this.historyChat.push("D) È una conseguenza dell’evoluzione chimica post-catastrofe.");
                    this.historyChat.push('--');
                break;

                case key = 13:
                    this.historyChat.push('--');
                    this.historyChat.push("**Se fossi bloccato in un bunker senza acqua potabile, quale sarebbe la miglior strategia di sopravvivenza?**");
                    this.historyChat.push("A) Bere piccole quantità di acqua contaminata per abituare il corpo.");
                    this.historyChat.push("B) Tentare di purificare l’acqua con il fuoco.");
                    this.historyChat.push("C) Consumare meno cibo per rallentare la disidratazione.");
                    this.historyChat.push("D) Riciclare i liquidi corporei tramite filtrazione.");
                    this.historyChat.push('--');
                break;

                case key = 14:
                    this.historyChat.push('--');
                    this.historyChat.push("**L’IA del bunker sostiene di avere una soluzione per la crisi ambientale, ma i dati mostrano incongruenze. Cosa fai?**");
                    this.historyChat.push("A) Seguo le istruzioni: l’IA ha sempre ragione.");
                    this.historyChat.push("B) Confronto i dati con quelli registrati prima della catastrofe.");
                    this.historyChat.push("C) Cerco di disattivare l’IA prima che prenda il controllo.");
                    this.historyChat.push("D) Ignoro l’IA e cerco una soluzione alternativa con gli altri sopravvissuti.");
                    this.historyChat.push('--');
                break;
                default:
                    break;
            }
        },
        typeLine() {
            if (this.typeCount < this.bootLines.length) {
              let line = this.bootLines[this.typeCount];
              let j = 0;
              const typeChar = () => {
                if (j < line.length) {
                  this.bootLog.textContent += line[j];
                  //this.typeSound.currentTime = 0;
                  //this.typeSound.play();
                  j++;
                  setTimeout(typeChar, 20);
                } else {
                  this.bootLog.textContent += '\n';
                  this.typeCount++;
                  setTimeout(this.typeLine(), 1000);
                }
              }
          
              typeChar();
            } else {
              // Quando la scrittura termina, mostra il logo
              setTimeout(() => {
                this.Intro.play();
                this.bootScreen.classList.add('d-none');
                this.logoScreen.classList.remove('d-none');
                this.logoScreen.classList.add('logo-screen');
              }, 3000); // Ritardo di 1 secondo prima di mostrare il logo

              setTimeout(() => {
                this.secondAudio.play();
                this.logoScreen.classList.add('fade-out');
                document.getElementById('TheRminal').classList.remove('d-none');
              }, 7000);
            }
        },
    },
    mounted() {
        if (localStorage.getItem("directoryContents") != null) { // Se lo storage "directoryContents" esiste, aggiorna "this.directoryContents"
            this.directoryContents = JSON.parse(localStorage.getItem("directoryContents"));
        } else { // Altrimenti
            localStorage.setItem("directoryContents", JSON.stringify(this.directoryContents)); // Crea lo storage "directoryContents" attribuendogli il valore JSON stringato di this.directoryContents
        }
        this.firstAudio = new Audio('assets/sounds/Hacking23.mp3');
        this.secondAudio = new Audio('assets/sounds/Hacking33.mp3');
        this.Intro = new Audio('assets/sounds/Intro.mp3');
        this.createTerminal();
    },
    
}).mount('#TheRminal')


