import {
    generate_keypair,
    set_crewmatepub,
    encrypt_comms,
    decrypt_comms
} from './crypto.mjs'

window.document.getElementById('generateButton').addEventListener('click', async e => {
    e.preventDefault()

    let amongus = await generate_keypair()
    window.document.querySelector('#yourself textarea').textContent = amongus
})