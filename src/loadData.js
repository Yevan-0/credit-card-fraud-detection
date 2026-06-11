const dfd = require('danfojs');

const csvFilePath = "../data/creditcard.csv";
const csv = require('csvtojson');

// loads the csv file as a jsonObject
const loadData = async () => {
  const jsonArray = await csv({ checkType: true }).fromFile(csvFilePath);
  let df = new dfd.DataFrame(jsonArray);
  return df;
  console.log('data loaded!')
}
module.exports = {loadData};
