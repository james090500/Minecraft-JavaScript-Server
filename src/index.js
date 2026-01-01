import net from 'net'

import ClientPacketHandler from './network/ClientPacketHandler.js'
import logger from './network/utils/Logger.js'
import MCConnection from './network/utils/MCConnection.js'

const server = net.createServer()
const port = 25565

const connections = new Map()

server.listen(port, () => {
    logger.info(`Server listening on port ${port}`)
})

server.on('connection', (socket) => {
    const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`
    logger.info(`New client connection from ${remoteAddress}`)

    socket.on('data', (data) => {
        const connection = connections.get(socket) ?? new MCConnection(socket)
        if (connections.has(socket) === false) {
            connections.set(socket, connection)
        }

        ClientPacketHandler.handle(connection, data)
    })

    socket.once('close', () => {
        logger.info(`Connection from ${remoteAddress} closed`)
    })

    socket.on('error', (err) => {
        logger.error(`Connection ${remoteAddress} error: ${err.message}`)
    })
})
