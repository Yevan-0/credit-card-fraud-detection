const { loadData } = require('./loadData');

const preprocess = async () => {
  const df = await loadData();
  // isolate classes in y
  const y = df.column("Class").values;
  // remove y classes col
  const x = df.drop({ columns: ["Class"], inplace: false })
  // isolates Amounts column in the x dataframe
  const currAmount = x.column("Amount").values;
  // converts Amounts to log values
  const logAmount = currAmount.map((i) => Math.log1p(i));
  // adds new column to x dataframe
  x.addColumn("Amount", logAmount, { inplace: true })
  // returns x and y
  return { x, y };
}

module.exports = { preprocess };