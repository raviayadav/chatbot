"use strict"

const dialogFlow = require('dialogflow');
const config = require('../config/keys');
const structjson = require('./structjson');
const sessionClient = new dialogFlow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

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
    handleAction: (responses) => {
        return responses;   
    }
}