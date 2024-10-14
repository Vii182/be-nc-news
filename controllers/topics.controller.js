const { selectTopics } = require("../models/topics.model");




const getTopics = ( request, response, next ) => {
    selectTopics().then((topics) => {
        response.status(200).send({ topics })
    }).catch((err) => {
        console.log(err)
        next(err)
    });
}







module.exports = { getTopics };