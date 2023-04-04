/**
 * a simple ping function to test the lambda
 * @param {a} event
 * @param {*} context
 * @returns
 */
exports.handler = async function(event, context) {
    return {
      statusCode: 200,
      body: 'pong'
    };
  };