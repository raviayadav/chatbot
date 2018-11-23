const chatbot = require('../chatbot/chatbot');

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
}