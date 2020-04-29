'use strict';

const axios = require('axios');
const resp = require('../../../templates/generic/message');
const PROVIDER_URL = 'https://swapi.py4e.com/api/people';



module.exports.personages =  async event => {

  let personageId = event['path']['id'];
  let fullURL = `${PROVIDER_URL}${personageId? "/"+ personageId : ""}`;

  let response = await axios(fullURL).then(
    res => { return res['data'] }
  ).catch(error => { 
      console.log('Error:' + JSON.stringify(error))
      return resp.sendMessage(404,error)
    })
  return response;
};