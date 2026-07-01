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

const getRandomFeatureSubset = (totalFeatures, subsetSize) => {
  const set = new Set();
  while (set.size < subsetSize) {
    const randomNum = Math.floor(Math.random() * totalFeatures);
    set.add(randomNum)
  }
  const array = Array.from(set);
  return array;
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

  // pick random feature subset
  const featureIndices = getRandomFeatureSubset(rows[0].length, Math.floor(Math.sqrt(rows[0].length)))

  // find the best split using that subset
  const { bestFeatureIndex, bestThreshold } = findBestSplit(rows, labels, featureIndices)

  // if no valid split was found, return a leaf
  if (bestFeatureIndex === null) {
    return { isLeaf: true, prediction: getMajorityClass(labels) }
  }

  // split the data using the best split
  const { leftRow, leftLabel, rightRow, rightLabel } = splitDataset(rows, labels, bestFeatureIndex, bestThreshold)

  // recurse into left and right
  const leftNode = buildTree(leftRow, leftLabel, depth + 1, maxDepth)
  const rightNode = buildTree(rightRow, rightLabel, depth + 1, maxDepth)

  // return a decision node
  return { isLeaf: false, featureIndex: bestFeatureIndex, threshold: bestThreshold, left: leftNode, right: rightNode }
}

const predictTree = (node, row) => {
  if (node.isLeaf === true) {
    return node.prediction
  }

  if (row[node.featureIndex] <= node.threshold) {
    return predictTree(node.left, row);
  }
  else {
    return predictTree(node.right, row);
  }
}

const rows = [
  [2, 5],
  [4, 1],
  [6, 8],
  [1, 3]
]
const labels = [0, 1, 0, 1]

const tree = buildTree(rows, labels, 0, 3)
console.log(predictTree(tree, [2, 5]))  // expect 0
console.log(predictTree(tree, [4, 1]))  // expect 1 

module.exports = { getUniqueValues, findBestSplit, buildTree }