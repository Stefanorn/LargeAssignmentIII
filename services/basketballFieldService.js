const request = require('request');

function getRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
const db = () => {
    const allBasketBallFields = async () => {
        var resp = await getRequest("https://basketball-fields.herokuapp.com/api/basketball-fields");
        resp = JSON.parse(resp);
        return await resp;
    };
    const basketBallField = async (id) => {
      var resp = await getRequest("https://basketball-fields.herokuapp.com/api/basketball-fields/" + id);
      resp = JSON.parse(resp);
      return await resp;
    }
    return { allBasketBallFields, basketBallField };
};

module.exports = db();
