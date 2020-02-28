const Word = require('../models/word.model');

function replaceManyStr(replacements, str) {
  return replacements.reduce(
    (accum, t) => accum.replace(new RegExp(Object.keys(t)[0], 'g'), t[Object.keys(t)[0]]),
    str,
  );
}

/**
 * @public
 */
exports.check = async (req, res) => {
  try {
    const replacements = [];
    const nonLexicalWordDocs = await Word.find({ isDeleted: false }).select('word');
    const nonLexicalWords = nonLexicalWordDocs.map((nonLexicalWordDoc) => {
      if (nonLexicalWordDoc.word.indexOf(' ') !== -1) {
        const temp = {};
        const wordWithoutSpaces = nonLexicalWordDoc.word.split(' ').join('+');
        temp[nonLexicalWordDoc.word] = wordWithoutSpaces;
        replacements.push(temp);
        return wordWithoutSpaces;
      }
      return nonLexicalWordDoc.word;
    });
    const textToCheck = replaceManyStr(replacements, req.body.text.toLowerCase());
    const words = textToCheck.split(' ');
    if (words.length < 100 && textToCheck.length < 1000) {
      throw new Error('text must have at least 100 words or 1000 characters');
    }
    const sentenceLd = [];
    let lastSentenceNonLexicalWordCount = 0;
    let allNonLexicalWordCount = 0;
    let lastSentenceWordCount = 0.0;
    let allWordCount = 0.0;
    for (let index = 0; index < words.length; index += 1) {
      const word = words[index];
      allWordCount += 1;
      lastSentenceWordCount += 1;
      if (nonLexicalWords.indexOf(word) !== -1) {
        lastSentenceNonLexicalWordCount += 1;
        allNonLexicalWordCount += 1;
      }
      if (word.endsWith('.')) {
        if (nonLexicalWords.indexOf(word.slice(0, -1)) !== -1) {
          lastSentenceNonLexicalWordCount += 1;
          allNonLexicalWordCount += 1;
        }
        sentenceLd.push(
          (lastSentenceWordCount - lastSentenceNonLexicalWordCount) / lastSentenceWordCount,
        );
        lastSentenceWordCount = 0.0;
        lastSentenceNonLexicalWordCount = 0;
      }
    }
    const overallLd = (allWordCount - allNonLexicalWordCount) / allWordCount;
    const result = { overall_ld: overallLd };
    if (req.query.mode === 'verbose') {
      sentenceLd.push(
        (lastSentenceWordCount - lastSentenceNonLexicalWordCount) / lastSentenceWordCount,
      );
      result.sentence_ld = sentenceLd;
    }
    res.json({ data: result });
  } catch (error) {
    res.status(421).json({ error: error.message });
  }
};
