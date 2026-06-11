const { preprocess } = require("./preprocess")

const loadValues = async () => {
  const { x, y } = await preprocess();
  // seperate x and y from the object
  const arrayX = x.values;
  // shuffle arrayX and y together
  const shuffle = (arrayX, y) => {
    for (let i = arrayX.length - 1; i >= 1; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayX[i], arrayX[j]] = [arrayX[j], arrayX[i]];
      [y[i], y[j]] = [y[j], y[i]];
    }
    return { arrayX, y };
  }
  const { arrayX: shuffledX, y: shuffledY } = shuffle(arrayX, y);
  // split the shuffled array by 80%
  const trainSplit = Math.floor(shuffledX.length * 0.8);
  const xTrain = shuffledX.slice(0, trainSplit);
  const xTest = shuffledX.slice(trainSplit);
  const yTrain = shuffledY.slice(0, trainSplit);
  const yTest = shuffledY.slice(trainSplit);
  console.log(xTrain.length);
  console.log(xTest.length);
  console.log(yTrain.length);
  console.log(yTest.length);
}
module.exports = { loadValues }