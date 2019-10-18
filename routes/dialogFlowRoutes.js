const chatbot = require('../chatbot/chatbot');
const ffmpeg = require('fluent-ffmpeg');
// const util = require('util');
const fs = require('fs');
const path = require('path');

// const writeFile = util.promisify(fs.writeFile);
function middleWare(req, res, next) {
    const file = req.body.audio;
    const temp_dir = path.join(process.cwd(), 'temp/');
    console.log('temp dir', temp_dir);
    if (!fs.existsSync(temp_dir)) {
        fs.mkdirSync(temp_dir);
    }
    fs.writeFileSync(`${temp_dir}myQuery.wav`, Buffer.from(file.replace('data:audio/wav;base64,', ''), 'base64'));
    ffmpeg(`${temp_dir}myQuery.wav`)
    .audioBitrate('256k')
    .audioChannels(1)
    .audioFrequency(16000)
    .on('end', function() {
       console.log('file has been converted succesfully');
     })
    .on('error', function(err) {
       console.log('an error happened: ' + err.message);
     })
    .save(`/app/chatbot/temp/final.wav`);
    setTimeout(() => {
        next();
    }, 1500);
}
module.exports = app => {
    app.get('/', (req, res) => {
        res.send({'hello': 'world'});
    });
    app.post('/api/df_text_query', async (req, res) => {
        try {
            let responses = await chatbot.textQuery(req.body.text, req.body.parameters);
            res.send(responses[0].queryResult);                 
        } catch(e) {
            res.send(e);
        }
    });
    app.post('/api/df_event_query', async (req, res) => {
        try {
            let responses = await chatbot.eventQuery(req.body.event, req.body.parameters);
            res.send(responses[0].queryResult);     
        } catch(e) {
            res.send(e);     
        }
    });
    app.post('/api/df_audio_query', middleWare, async (req, res) => {
        try {
            let responses = await chatbot.audioQuery(req.body.audio);
            // console.log('final rsult', responses);
            res.send(responses[0].queryResult);     
        } catch(e) {
            res.send(e);     
        }
    });
}