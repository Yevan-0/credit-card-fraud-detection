const featureIndex = 0;
const threshold = 3;

const calculateGini = (labels) => {
  let classZero = 0;
  let classOne = 0;
  for (let i = 0; i < labels.length; i++) {
    let currentLabel = labels[i]
    if (currentLabel === 0) {
      classZero += 1
    } else {
      classOne += 1
    }
  }

  let p_0 = classZero / labels.length;
  let p_1 = classOne / labels.length;
  const gini = 1 - ((p_0) ** 2 + ((p_1) ** 2));
  return gini;
}

const splitDataset = (rows, labels, featureIndex, threshold) => {
  const leftRow = [];
  const leftLabel = [];
  const rightRow = [];
  const rightLabel = [];

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][featureIndex] <= threshold) {
      leftRow.push(rows[i]);
      leftLabel.push(labels[i])
    } else {
      rightRow.push(rows[i]);
      rightLabel.push(labels[i])
    }
  }
  return { leftRow, leftLabel, rightRow, rightLabel };
}

const weightedGini = (leftLabel, rightLabel) => {
  const leftGini = calculateGini(leftLabel);
  const rightGini = calculateGini(rightLabel);

  const totalCount = leftLabel.length + rightLabel.length;

  const leftWeight = leftLabel.length / totalCount;
  const rightWeight = rightLabel.length / totalCount;

  const weighted = (leftWeight * leftGini) + (rightWeight * rightGini);

  return weighted;
}

module.exports = { calculateGini, splitDataset, weightedGini }

