"use strict"

const fs = require('fs');
const util = require('util');
const dialogFlow = require('dialogflow');
const path = require('path');
const config = require('../config/keys');
const structjson = require('./structjson');
const WaveFile = require('wavefile');
const projectID = config.googleProjectID;
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
};
const sessionClient = new dialogFlow.SessionsClient({projectID, credentials});
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
module.exports = {
    textQuery: async (text, parameters = {}) => {
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text,
                languageCode: config.dialogFlowSessionLanguageCode,
              },
            },
            parameters: {
                payload: {
                    data: parameters
                }
            }
          };
          let responses = await sessionClient
          .detectIntent(request);
          responses = await self.handleAction(responses);
          return responses;
    },
    eventQuery: async (event, parameters = {}) => {
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
              event: {
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                languageCode: config.dialogFlowSessionLanguageCode
              }
            }
          };
          let responses = await sessionClient.detectIntent(request);
          responses = await self.handleAction(responses);
          return responses;
    },
    audioQuery: async (filename) => {
        // console.log('reached here ********', filename);
        await writeFile('./temp/myQuery.wav', Buffer.from(filename.replace('data:audio/wav;base64,', ''), 'base64'));
        await ffmpeg('./temp/myQuery.wav')
        .audioBitrate('256k')
        .audioChannels(1)
        .audioFrequency(16000)
        .on('end', function() {
          console.log('file has been converted succesfully');
        })
        .on('error', function(err) {
          console.log('an error happened: ' + err.message);
        })
        .save('./temp/final.wav');
        const queryAudioFile = await readFile('./temp/final.wav');
        console.log('queryAudioFile', queryAudioFile);
        const request = {
            session: sessionPath,
            queryInput: {
              audioConfig: {
                audioEncoding: config.inputAudioEncoding,
                sampleRateHertz: config.sampleRateHertz,
                languageCode: config.dialogFlowSessionLanguageCode
              },
            },
            inputAudio: queryAudioFile,
          };
        // console.log('request', request);
        let responses = await sessionClient.detectIntent(request);
        console.log('response', responses);
        return responses;
    },
    handleAction: (responses) => {
        return responses;   
    }
}