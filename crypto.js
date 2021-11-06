const sodium = require('libsodium-wrappers')

let yourkeypair = null
let crewmatepub = null

module.exports = {
    generate_keypair: function () {
        if (sodium.crypto_box_PUBLICKEYBYTES != 32) {
            throw new Error("CryptSCII is incompatible with this version of sodium.")
        }
        crewmatepub = null
        yourkeypair = sodium.crypto_box_keypair()
        let publichex = sodium.to_hex(yourkeypair.publicKey)
        let i = 0
        let amongus = 
`   XXXXXXXXXX
  X          X
 XXXXXXX      X
X       X     XXX
X       X     X  X
 XXXXXXX      X  X
 X            X  X
 X     XX     X  X
 X    X  X    XXX
 X    X  X    X
  XXXX    XXXX`.replaceAll('X', () => publichex[i++])
        return amongus
    },
    
    set_crewmatepub: function (crewmate) {
        // crewmate: String
    
        let cr = sodium.from_hex(crewmate.toLowerCase().replace(/[^a-f0-9]/g, ''))
        if (cr.length != sodium.crypto_box_PUBLICKEYBYTES) {
            throw new Error("Invalid crewmate")
        }
        crewmatepub = cr
    },

    clear_crewmatepub: function () {
        crewmatepub = null
    },

    clear_keypair: function () {
        yourkeypair = null
    },
    
    encrypt_comms: function (msg) {
        // msg: String
    
        if (yourkeypair == null) {
            throw new Error("You don't have a crewmate!")
        }
        if (crewmatepub == null) {
            throw new Error("No other crewmate is present")
        }
        let n = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES)
        let m = sodium.crypto_box_easy(msg, n, crewmatepub, yourkeypair.privateKey)
        return sodium.to_base64(new Uint8Array([ ...n, ...m ]))
    },
    
    decrypt_comms: function (msg) {
        // msg: String
    
        if (yourkeypair == null) {
            throw new Error("You don't have a crewmate!")
        }
        if (crewmatepub == null) {
            throw new Error("No other crewmate is present")
        }
        let b = sodium.from_base64(msg)
        let n = b.slice(0, sodium.crypto_box_NONCEBYTES)
        let m = b.slice(sodium.crypto_box_NONCEBYTES)
        let dec = sodium.crypto_box_open_easy(m, n, crewmatepub, yourkeypair.privateKey)
        return new TextDecoder().decode(dec);
    }    
};
