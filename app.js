import fs from 'fs'
import ora from 'ora'
import chalk from 'chalk'
import qrcode from 'qrcode-terminal' // SHOW QR-CODE ON TERMINAL
import { Client } from 'whatsapp-web.js'
import SESSION_DATA from './session.json'

const phrases = [
    "Hola mi vida hermosa, eres preciosa",
    "Hola mi pompis, es segundos estaré contigo",
    "Hola amor de mi vida, te extraño",
    "Estoy en el baño, ya vuelvo, teamo!",
    "Estoy haciendo alguna cosa, ya vuelvo, pero te amo"
]

class ChatBot {
    constructor() {
        this.client;
        this.session;
        this.SESSION_FILE_PATH = "./session.json";
        this.authenticate();
        this.onAuthFailure();
        this.initialize();
    }

    authenticate = () => {
        fs.existsSync(this.SESSION_FILE_PATH) ? this.withSession() : this.withOutSession()
        this.onReady()
        this.onMessage()
    }

    withSession = () => {
        console.log("Checking session...")
        const loadingText = chalk.green("Checking session...")
        const spinner = ora(loadingText).start()
        this.client = new Client({
            session: SESSION_DATA
        })
        spinner.stop()
    }

    withOutSession = () => {
        this.showQR()
        this.saveSession()
    }

    showQR = () => {
        this.client = new Client
        this.client.on("qr", QRCODE => {
            console.log("Generating QR...")
            const loadingText = chalk.green("Generating QR...")
            const spinner = ora(loadingText).start()
            qrcode.generate(QRCODE, { small: true })
            spinner.stop()
        })
    }

    saveSession = () => {
        this.client.on("authenticated", session => {
            this.session = session
            this.createFile(this.SESSION_FILE_PATH, this.session)
        })
    }

    createFile = async (path, body) => {
        try {
            if (!path) throw new Error("Destino es obligatorio")
            if (!body) throw new Error("Cuerpo es obligatorio")
            fs.writeFile(path, JSON.stringify(body), (err) => console.log(err))
            chalk.greenBright("Session saved succesfully!")
        } catch (err) {
            console.log(err)
        }
    }

    onAuthFailure = () => {
        this.client.on('auth_failure', (err) => {
            console.log(err)
        })
    }

    onReady = () => {
        this.client.on("ready", () => {
            console.log("Conexion sucessfully!")
        })
    }

    onMessage = () => {
        this.client.on("message", message => {
            const { from, to, body } = message
            if (from.toString().includes("3212282638")) {
                this.client.sendMessage(from, phrases[this.randomNumber()])
            }
            console.log(from, to, body)
        })
    }

    randomNumber = () => {
        return Math.floor(Math.random() * 5)
    }

    initialize = () => {
        this.client.initialize()
    }
}

new ChatBot()