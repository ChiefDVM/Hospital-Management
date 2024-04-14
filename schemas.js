const Joi = require('joi');

module.exports.patientSchema = Joi.object({
    patient: Joi.object({
        username: Joi.string().required(),
        ID: Joi.string().required(),
        mobile: Joi.number().required(),
        age: Joi.number().required(),
        sex: Joi.string().required(),
        address: Joi.string().required()
    }).required()
})