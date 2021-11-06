import {
    generate_keypair,
    set_crewmatepub,
    encrypt_comms,
    decrypt_comms
} from './crypto.mjs'

window.document.getElementById('generateButton').addEventListener('click', async e => {
    e.preventDefault()

    let amongus = await generate_keypair()
    window.document.querySelector('#yourself textarea').value = amongus
})

window.document.getElementById('confirmButton').addEventListener('click', async e => {
    e.preventDefault()

    await set_crewmatepub(window.document.querySelector('#crewmate textarea').value)
})

window.document.getElementById('sendButton').addEventListener('click', async e => {
    e.preventDefault()

    let plain = window.document.getElementById('sendinput').value
    window.document.getElementById('sendoutput').value = await encrypt_comms(plain)
})

window.document.getElementById('receiveButton').addEventListener('click', async e => {
    e.preventDefault()

    let cipher = window.document.getElementById('recvinput').value
    window.document.getElementById('recvoutput').value = await decrypt_comms(cipher)
})