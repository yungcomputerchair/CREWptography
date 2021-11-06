require('@electron/remote/main').initialize()

import {
    generate_keypair,
    set_crewmatepub,
    encrypt_comms,
    decrypt_comms
} from './crypto.mjs'

document.getElementById('generateButton').addEventListener('click', () => {
    let amongus = generate_keypair()
    document.querySelector('#yourself textarea').textContent = amongus
})