function genToken() {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let s = ''
    for (let i = 0; i < 16; ++i) s += alpha[Math.floor(Math.random()*alpha.length)]
    return s
}

function sendCall(name, ...args) {
    return new Promise((resolve, reject) => {
        const token = genToken()
        let listener = (restoken, err, result) => {
            if (restoken == token) {
                if (err != null) reject(err)
                else resolve(result)
                window.api.kill("fromMain", listener)
            }
        }
        window.api.receive("fromMain", listener)
        window.api.send("toMain", token, name, args)
    })
}

function clearErrors() {
    document.getElementById('error').textContent = ''
}

const errorMap = {
    set_crewmatepub: {
        "Error: invalid input": "Error: The other crewmate is sus! (check for any typos)",
        "Error: Invalid crewmate": "Error: The other crewmate is sus! (check for any typos)"
    },
    decrypt_comms: {
        "Error: ciphertext is too short": "Error: This encrypted message is sus! (check for any typos)",
        "Error: invalid input": "Error: This encrypted message is sus! (check for any typos)",
        "Error: incomplete input": "Error: This encrypted message is sus! (check for any typos)",
        "Error: incorrect key pair for the given ciphertext": "Error: This message is from an impostor and cannot be decrypted. Please check if your comms have been sabotaged."
    }
}

function setError(fn, msg) {
    if (errorMap[fn] && errorMap[fn][msg]) document.getElementById('error').textContent = errorMap[fn][msg]
    else document.getElementById('error').textContent = msg
}

window.document.getElementById('generateButton').addEventListener('click', async e => {
    e.preventDefault()

    clearErrors()
    document.querySelector('#crewmate textarea').value = ''
    let amongus = await sendCall('generate_keypair')
    window.document.querySelector('#yourself textarea').value = amongus
})

window.document.getElementById('confirmButton').addEventListener('click', async e => {
    e.preventDefault()

    clearErrors()
    try {
        await sendCall('set_crewmatepub', window.document.querySelector('#crewmate textarea').value)
    } catch (ex) {
        setError('set_crewmatepub', ex)
    }
})

window.document.getElementById('sendButton').addEventListener('click', async e => {
    e.preventDefault()

    clearErrors()
    try {
        let plain = window.document.getElementById('sendinput').value
        window.document.getElementById('sendoutput').value = await sendCall('encrypt_comms', plain)
    } catch (ex) {
        setError('encrypt_comms', ex)
    }
})

window.document.getElementById('receiveButton').addEventListener('click', async e => {
    e.preventDefault()

    clearErrors()
    try {
        let cipher = window.document.getElementById('recvinput').value.trim()
        window.document.getElementById('recvoutput').value = await sendCall('decrypt_comms', cipher)
    } catch (ex) {
        setError('decrypt_comms', ex)
    }
})

/*
window.document.querySelector('#crewmate textarea').addEventListener('change', async () => {
    await sendCall('clear_crewmatepub')
})
*/

sendCall('clear_keypair')
sendCall('clear_crewmatepub')