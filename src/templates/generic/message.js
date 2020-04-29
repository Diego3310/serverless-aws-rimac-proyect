const sendMessage = (statusCode, body) => {

  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  }

}

module.exports = {
  sendMessage
}