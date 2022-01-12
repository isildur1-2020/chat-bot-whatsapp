import { MessageMedia } from "whatsapp-web.js"

class Media {
    constructor(client) {
        this.client = client
    }

    sendMedia = (to, file) => {
        const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
        client.sendMessage(to, mediaFile)
    }
}