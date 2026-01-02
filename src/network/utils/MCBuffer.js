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

    writeDouble(value) {
        const buf = Buffer.alloc(8)
        buf.writeDoubleBE(value)
        this.buffer = Buffer.concat([this.buffer, buf])
    }

    writeFloat(value) {
        const buf = Buffer.alloc(4)
        buf.writeFloatBE(value)
        this.buffer = Buffer.concat([this.buffer, buf])
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

    /**
     * Writes a Minecraft "BitSet" (a VarInt length-prefixed long[]).
     *
     * Wire format (wiki.vg): VarInt longCount, then longCount × Long (8 bytes each).
     * Bit index 0 is the least-significant bit of long[0].
     *
     * Usage examples:
     *   // empty (all bits false)
     *   buf.writeBitset([])
     *
     *   // bits 0 and 5 set
     *   buf.writeBitset([0, 5])
     *
     *   // specify a fixed size (forces enough longs even if last bits are 0)
     *   buf.writeBitset([0, 5], 256)
     */
    writeBitset(setBits = [], totalBits = null) {
        // Allow passing a precomputed long array directly: { longs: BigInt[] }
        if (
            setBits &&
            typeof setBits === 'object' &&
            !Array.isArray(setBits) &&
            Array.isArray(setBits.longs)
        ) {
            const longs = setBits.longs
            this.writeVarInt(longs.length)
            for (const w of longs) {
                // Ensure signed 64-bit range for writeBigInt64BE
                this.writeLong(BigInt.asIntN(64, BigInt(w)))
            }
            return
        }

        const bits = Array.isArray(setBits) ? setBits : []
        let maxBit = -1
        for (const b of bits) {
            if (!Number.isInteger(b) || b < 0) {
                throw new Error(`Invalid bit index for BitSet: ${b}`)
            }
            if (b > maxBit) maxBit = b
        }

        // Determine how many bits/words to write
        const effectiveMaxBit =
            totalBits == null ? maxBit : Math.max(maxBit, totalBits - 1)
        const longCount =
            effectiveMaxBit < 0 ? 0 : Math.floor(effectiveMaxBit / 64) + 1

        // Empty bitset
        if (longCount === 0) {
            this.writeVarInt(0)
            return
        }

        const words = new Array(longCount).fill(0n)
        for (const b of bits) {
            const wordIndex = Math.floor(b / 64)
            const bitInWord = b % 64
            words[wordIndex] |= 1n << BigInt(bitInWord)
        }

        this.writeVarInt(words.length)
        for (const w of words) {
            // Java longs are two's complement; on the wire it's just 8 bytes.
            // Convert to signed 64-bit range so writeBigInt64BE always succeeds.
            this.writeLong(BigInt.asIntN(64, w))
        }
    }

    writeShort(value) {
        const buf = Buffer.alloc(2)
        buf.writeInt16BE(value)
        this.buffer = Buffer.concat([this.buffer, buf])
    }

    writeEmptyNbtCompound() {
        this.writeByte(0x0a) // TAG_Compound
        this.writeShort(0) // name length = 0
        this.writeByte(0x00) // TAG_End (end of compound payload)
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
