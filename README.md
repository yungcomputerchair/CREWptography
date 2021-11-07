# CREWptography
Ever been worried about an impostor snooping on your comms? Fear no more, as with CREWptography you and another crewmate are able to securely encrypt your messages and fix the comms sabotage. 

## Description
This is CREWptography, "We couldn't think of a team name."'s HackOHI/O 2021 project.
CREWptography is an ephemeral text encryption program intended to provide end-to-end encrypted messaging for any chat platform. It uses the Sodium library, a modern cryptography library that eschews backwards compatibility in favor of only providing the current standard of security, along with the venerable (if not somewhat obtuse) Electron to make it work on all major platforms.
The app was designed half-jokingly as a love letter to Innersloth's smash hit game "Among Us", but it also functions as a proof of concept for universal end to end encryption that has no regard for the service in between two users so long as it is reasonably authenticated.

## Building Instructions
```
npm install
npm start
```
You can alternatively download binaries from our [release page.](https://github.com/gsemaj/CREWptography/releases)
