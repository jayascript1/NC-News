const { updateArticleVotes } = require("../models/updateArticleVotes");
const { fetchArticleById } = require("../models/article_id");

exports.patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const { inc_votes } = req.body;
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "Number not received when expected" });
  }
  fetchArticleById(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: "Not found" });
      }
      updateArticleVotes(articleId, inc_votes)
        .then((updatedArticle) => {
          res.status(200).send({ article: updatedArticle , message: 'Article votes updated'});
        })
        .catch(next);
    })
    
};
