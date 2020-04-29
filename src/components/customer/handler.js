'use-strict'
const AWS = require('aws-sdk')
const resp = require('../../templates/generic/message');
const uuid = require('uuid/v1')
const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE;
const db = new AWS.DynamoDB.DocumentClient();


module.exports.customers = (event, context, callback) => {

  let method = event['httpMethod'];

  switch (method) {
    case 'GET': {

      let hasPathParams = event['pathParameters'];

      if (hasPathParams) {

        findCustomerById(event, callback)

      } else {
        listCustomers(callback)
      }

      break;
    }
    case 'POST': {
      addCustomer(event, callback)
      break;
    }
    default: {
      callback(null, resp.sendMessage(405, {error:"Method Not Allowed"}))
    }
  }


};

function addCustomer(event, callback) {

  request = JSON.parse(event['body']);

  const customer = {
    customerId: uuid(),
    createdAt: new Date().toString(),
    name: request.name,
    email: request.email,
    phone: request.phone,
    age: request.age,
    address: request.address
  }

  db.put({
    TableName: CUSTOMERS_TABLE,
    Item: customer
  }).promise().then((data) => {
    callback(null, resp.sendMessage(201, customer))
  }).catch(error => callback(null, res.sendMessage(error.statusCode, error)))


}


function findCustomerById(event, callback) {
  let customerId = event['pathParameters']['id'];

  const params = {
    TableName: CUSTOMERS_TABLE,
    Key: {
      customerId
    }
  }

  db.get(params).promise().then((data) => {

    if (Object.entries(data).length !== 0) {
      callback(null, resp.sendMessage(200, data))
    } else {
      callback(null, resp.sendMessage(404, { error: `No existe cliente con código: ${customerId}` }))
    }
  }).catch(error => callback(null, res.sendMessage(error.statusCode, error)))


};

function listCustomers(callback) {
  const params = {
    TableName: CUSTOMERS_TABLE,
  };

  db.scan(params).promise().then((data) => {

    if (data['Items'].length > 0) {
      callback(null, resp.sendMessage(200, data))
    } else {
      callback(null, resp.sendMessage(404, { error: 'No se encontraron resultados' }))
    }

  }).catch(error => callback(null, res.sendMessage(error.statusCode, error)))
}