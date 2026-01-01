export default class MCConnection {
    /**
     * 1 = Status
     * 2 = Login
     * 3 = Transfer
     * 4 = Configuration
     * 5 = Play
     */
    phase = 1
    readyForStatus = false

    constructor(socket) {
        this.socket = socket
    }

    getPhase() {
        return this.phase
    }

    setPhase(phase) {
        this.phase = phase
    }

    write(buffer) {
        this.socket.write(buffer)
    }

    waitForStatus() {
        if (!this.readyForStatus) {
            this.readyForStatus = true
            setTimeout(() => {
                this.readyForStatus = false
            }, 30_000) // 30 seconds
        }
    }

    isReadyForStatus() {
        return this.readyForStatus
    }

    end() {
        this.socket.end()
    }
}
