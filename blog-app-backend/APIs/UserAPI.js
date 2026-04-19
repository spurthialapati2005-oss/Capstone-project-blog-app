import exp from 'express';
import { authenticate, register } from '../services/authService.js';
import { Article } from '../models/ArticleModel.js';
import { UserTypeModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { checkUser } from "../middlewares/checkUser.js";
import { upload } from "../config/multer.js"
import cloudinary  from "../config/cloudinary.js"
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';

export const userRoute = exp.Router()

//register user
userRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
        let cloudinaryResult;
            try {
                let userObj = req.body;

                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err);
            }

});

//Read all articles(protected route)
userRoute.get('/articles', verifyToken("USER"), checkUser, async(req, res) => {

    let articles = await Article.find({ isArticleActive: true })
      .populate("author", "firstName lastName profileImageUrl")
      .populate("comments.user", "firstName lastName profileImageUrl");

    if (!articles || articles.length === 0) {
        return res.status(200).json({ message: "No Articles Found", payload: [] });
    }

    res.status(200).json({message:"All articles", payload: articles})
})


//Add comment to an article
userRoute.post("/articles", verifyToken("USER"), checkUser, async (req, res) => {

  const userId = req.user.userId;
  const { articleId, comment } = req.body;

  try {
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: articleId, isArticleActive: true },
      { $push: { comments: { user: userId, comment } } },
      { new: true, runValidators: true }
    )
    .populate("author", "firstName lastName profileImageUrl")
    .populate("comments.user", "firstName lastName profileImageUrl");

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "Comment added successfully",
      payload: updatedArticle
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});