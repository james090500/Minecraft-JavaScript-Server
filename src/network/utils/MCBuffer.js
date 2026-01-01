import logger from './Logger.js'
import { stringify as uuidStringify } from 'uuid'

const SEGMENT_BITS = 0x7f
const CONTINUE_BIT = 0x80

export default class MCBuffer {
    constructor(buffer) {
        this.buffer = buffer ?? Buffer.alloc(0) // no "new" needed
        this.offset = 0
    }

    writeVarInt(value) {
        const bytes = []
        do {
            let temp = value & SEGMENT_BITS
            value >>>= 7
            if (value !== 0) temp |= CONTINUE_BIT
            bytes.push(temp)
        } while (value !== 0)

        this.buffer = Buffer.concat([this.buffer, Buffer.from(bytes)])
    }

    readVarInt() {
        let value = 0
        let position = 0
        let currentByte

        while (true) {
            currentByte = this.buffer[this.offset++]
            value |= (currentByte & SEGMENT_BITS) << (position * 7)
            position += 1

            if (position > 5) {
                throw new Error('VarInt exceeds allowed bounds.')
            }

            if ((currentByte & CONTINUE_BIT) === 0) break
        }

        return value
    }

    writeString(str) {
        const strBuffer = Buffer.from(str, 'utf8')
        this.writeVarInt(strBuffer.length)
        this.buffer = Buffer.concat([this.buffer, strBuffer])
    }

    readString() {
        const len = this.readVarInt()
        const str = this.buffer.toString('utf8', this.offset, this.offset + len)
        this.offset += len
        return str
    }

    writeUByte(value) {
        const buf = Buffer.alloc(1)
        buf.writeUInt8(value)
        this.buffer = Buffer.concat([this.buffer, buf])
    }

    writeByte(value) {
        const buf = Buffer.alloc(1)
        buf.writeInt8(value)
        this.buffer = Buffer.concat([this.buffer, buf])
    }

    writeBytes(bytes) {
        this.buffer = Buffer.concat([this.buffer, bytes])
    }

    readUShort() {
        const value = this.buffer.readUInt16BE(this.offset)
        this.offset += 2
        return value
    }

    writeInt(value) {
        const buf = Buffer.alloc(4)
        buf.writeInt32BE(value)
        this.buffer = Buffer.concat([this.buffer, buf])
    }

    writeBoolean(value) {
        const buf = Buffer.alloc(1)
        buf.writeUInt8(value ? 1 : 0)
        this.buffer = Buffer.concat([this.buffer, buf])
    }

    writeLong(value) {
        const buf = Buffer.alloc(8)
        buf.writeBigInt64BE(value)
        this.buffer = Buffer.concat([this.buffer, buf])
    }

    readLong() {
        const value = this.buffer.readBigInt64BE(this.offset)
        this.offset += 8
        return value
    }

    writeUUID(uuid) {
        // Strip dashes
        const hex = uuid.replace(/-/g, '')
        if (hex.length !== 32) throw new Error('Invalid UUID')

        // First 64 bits (MSB)
        const msb = BigInt('0x' + hex.substring(0, 16))
        // Last 64 bits (LSB)
        const lsb = BigInt('0x' + hex.substring(16))

        const buf = Buffer.alloc(16)
        buf.writeBigUInt64BE(msb, 0)
        buf.writeBigUInt64BE(lsb, 8)

        this.writeBytes(buf)
    }

    readUUID() {
        const uuidBuffer = this.buffer.slice(this.offset, this.offset + 16)
        this.offset += 16
        return uuidStringify(uuidBuffer)
    }

    getBuffer() {
        return this.buffer
    }

    send(socket) {
        const packet = new MCBuffer()
        packet.writeVarInt(this.buffer.length) // outer length
        packet.writeBytes(this.buffer)
        socket.write(packet.getBuffer())
    }
}
