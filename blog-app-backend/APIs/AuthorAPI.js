import exp from "express"
import { UserTypeModel } from "../models/UserModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js"
import { register } from "../services/authService.js"
import { Article } from '../models/ArticleModel.js';
export const authorRoute = exp.Router()

//Register author
authorRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {
    let cloudinaryResult;
    try {
      let userObj = req.body;

      // Step 1: upload image to cloudinary if exists
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // Step 2: call register() with AUTHOR role
      const newAuthorObj = await register({
        ...userObj,
        role: "AUTHOR",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "Author created",
        payload: newAuthorObj,
      });

    } catch (err) {
      // Step 3: rollback cloudinary if DB save fails
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      next(err);
    }
  }
);

//create article - (protected route)
authorRoute.post('/articles', verifyToken("AUTHOR"), async(req, res) => {
    //get article from req
    let article = req.body;
    //create article doc
    let newArticleDoc = new Article(article)
    //save
    let createdArticleDoc = await newArticleDoc.save()
    //send res
    res.status(201).json({message: "article created", payload: createdArticleDoc})
})

//read articles of author - (protected route)
authorRoute.get('/articles/:authorId', verifyToken("AUTHOR"), async(req, res) => {
    //get author id
    let aId = req.params.authorId;
    //read articles by this author
    let articles = await Article.find({author: aId, isArticleActive: true}).populate("author", "firstname email")
    //send res
    res.status(200).json({message:"articles", payload: articles})
})

//edit articles - (protected route)
authorRoute.put("/articles", verifyToken("AUTHOR"), async(req, res) => {
    //get modified article from req
    let { articleId, title, category, content, author } = req.body
    //find article
    let articleofDB = await Article.findById({ _id:articleId, author:author})
    if(!articleofDB){
        return res.status(401).json({message:"Article not found"})
    }

    //update the article
    let updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    {
        $set: { title, category, content },
    },
    { new: true })
    //send res(updated article)
    res.status(200).json({message:"Article Updated", payload: updatedArticle})
})

//delete (soft delete) article
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await Article.findById(id); //.populate("author");
  //console.log(article)
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  //console.log(req.user.userId,article.author.toString())
  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && article.author.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({ message: `Article is already ${isArticleActive ? "active" : "deleted"}`});
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`, 
  article,});
});