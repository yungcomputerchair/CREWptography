//import _sodium from 'libsodium-wrappers'
//await _sodium.ready
//const sodium = _sodium

let sodium

window.receiveSodium = async x => {
    await x.ready
    sodium = x
}

let yourkeypair = null
let crewmatepub = null

export function generate_keypair() {
    if (sodium.crypto_box_PUBLICKEYBYTES != 32) {
        throw new Error("CryptSCII is incompatible with this version of sodium.")
    }
    yourkeypair = sodium.crypto_box_keypair()
    let publichex = sodium.to_hex(yourkeypair.publicKey)
    let i = 0
    let amongus = 
`     XXXXXXXXXX
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
}

export function set_crewmatepub(crewmate) {
    // crewmate: String

    let cr = sodium.from_hex(crewmate.toLowerCase().replace(/[^a-f0-9]/g, ''))
    if (cr.length != sodium.crypto_box_PUBLICKEYBYTES) {
        throw new Error("Invalid crewmate key")
    }
    crewmatepub = cr
}

export function encrypt_comms(msg) {
    // msg: String

    if (yourkeypair == null) {
        throw new Error("No keypair!")
    }
    if (crewmatepub == null) {
        throw new Error("No crewmate key is present")
    }
    let n = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES)
    let m = sodium.crypto_box_easy(msg, n, crewmatepub, yourkeypair.privateKey)
    return sodium.to_base64(new Uint8Array([ ...n, ...m ]))
}

export function decrypt_comms(msg) {
    // msg: String

    if (yourkeypair == null) {
        throw new Error("No keypair!")
    }
    if (crewmatepub == null) {
        throw new Error("No crewmate key is present")
    }
    let b = sodium.from_base64(msg)
    let n = b.slice(0, sodium.crypto_box_NONCEBYTES)
    let m = b.slice(sodium.crypto_box_NONCEBYTES)
    let dec = sodium.crypto_box_open_easy(m, n, crewmatepub, yourkeypair.privateKey)
    return new TextDecoder().decode(dec);
}