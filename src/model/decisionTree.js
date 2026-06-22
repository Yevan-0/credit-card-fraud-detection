const { prelu } = require("@tensorflow/tfjs");
const { splitDataset, calculateGini, weightedGini } = require("./giniHelpers");

const getUniqueValues = (rows, featureIndices) => {
  const arr = [];
  for (let i = 0; i < rows.length; i++) {
    arr.push(rows[i][featureIndices]);
  }
  const set = new Set(arr);
  const deduplicateArray = Array.from(set)
  return deduplicateArray;
}

const findBestSplit = (rows, labels, featureIndices) => {
  let bestGini = Infinity;
  let bestFeatureIndex = null;
  let bestThreshold = null;

  for (let f = 0; f < featureIndices.length; f++) {
    const featureIndex = featureIndices[f];
    const uniqueValues = getUniqueValues(rows, featureIndex);

    for (let t = 0; t < uniqueValues.length; t++) {
      const threshold = uniqueValues[t];
      const split = splitDataset(rows, labels, featureIndex, threshold);
      const { leftLabel, rightLabel } = split;
      if (leftLabel.length === 0 || rightLabel.length === 0) {
        continue;
      }

      const weighted = weightedGini(leftLabel, rightLabel);
      if (weighted < bestGini) {
        bestGini = weighted;
        bestFeatureIndex = featureIndex;
        bestThreshold = threshold
      }
    }
  }
  return { bestGini, bestFeatureIndex, bestThreshold }
}

const getMajorityClass = (labels) => {
  let classZero = 0;
  let classOne = 0;
  let majorityClass = null;

  for (let i = 0; i < labels.length; i++) {
    let currentLabel = labels[i];
    if (currentLabel === 0) {
      classZero += 1
    } else {
      classOne += 1
    }
  }

  if (classZero > classOne) {
    majorityClass = 0;
  } else {
    majorityClass = 1;
  }
  return majorityClass
}

const buildTree = (rows, labels, depth, maxDepth) => {
  if (calculateGini(labels) === 0) {
    return { isLeaf: true, prediction: getMajorityClass(labels) }
  }
  if (depth >= maxDepth) {
    return { isLeaf: true, prediction: getMajorityClass(labels) }
  }
  if (labels.length < 2) {
    return { isLeaf: true, prediction: getMajorityClass(labels) }
  }
}

// TODO: make recursive part
const getRandomFeatureSubset = (totalFeature, subsetSize) => {

}


module.exports = { getUniqueValues, findBestSplit }