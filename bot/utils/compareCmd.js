function compareStrings(str1, str2) {
  const matchPercentage = str1.length * 0.95;
  const matchingChars = [];

  for (let i = 0; i < str1.length; i++) {
    if (str2.includes(str1[i])) {
      matchingChars.push(str1[i]);
    }
  }

  return matchingChars.length >= matchPercentage;
}

module.exports = {
  compareStrings,
};
