const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { matchFaq } = require('../utils/faqChatbot');

const query = asyncHandler(async (req, res) => {
  const { message, lang } = req.body;
  const result = matchFaq(message, lang);
  res.status(200).json(new ApiResponse(200, result));
});

module.exports = { query };
