"use strict"

const fs = require('fs');
// const util = require('util');
const dialogFlow = require('dialogflow');
const config = require('../config/keys');
const structjson = require('./structjson');
const projectID = config.googleProjectID;
const uuidv4 = require('uuid/v4');
const dialogFlowSessionID = uuidv4();
const path = require('path');// const ffmpeg = require('fluent-ffmpeg');


const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
};
const sessionClient = new dialogFlow.SessionsClient({projectID, credentials});
const sessionPath = sessionClient.sessionPath(config.googleProjectID, dialogFlowSessionID);
// const readFile = util.promisify(fs.readFile);
// const writeFile = util.promisify(fs.writeFile);
// console.log('DIRNAME', __dirname);
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
      console.log('reached inside audioQuery');
      const temp_dir = path.join(process.cwd(), 'temp/');
      console.log('temp dir2', temp_dir);
      if (!fs.existsSync(temp_dir)) {
          fs.mkdirSync(temp_dir);
      }
        // console.log('reached here ********', filename);
        const queryAudioFile = fs.readFileSync(`${temp_dir}final.wav`);
        // console.log('queryAudioFile', queryAudioFile);
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
        // fs.unlinkSync(`${temp_dir}myQuery.wav`);
        // fs.unlinkSync(`${temp_dir}final.wav`);
        console.log('response', responses);
        return responses;
    },
    handleAction: (responses) => {
        return responses;   
    }
}