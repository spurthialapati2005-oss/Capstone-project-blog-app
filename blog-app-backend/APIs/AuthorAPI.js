import exp from "express";
import mongoose from "mongoose";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { register } from "../services/authService.js";
import { Article } from "../models/ArticleModel.js";

import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const authorRoute = exp.Router();


//Register Author
authorRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      let userObj = req.body;

      // Upload image if exists
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

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
      // rollback image if error
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      next(err);
    }
  }
);


//create article
authorRoute.post(
  "/articles",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const authorId = req.user.userId; // get authorId from token
      const { title, category, content } = req.body;

      const newArticle = new Article({
        title,
        category,
        content,
        author: authorId,
        isArticleActive: true,
      });

      const createdArticleDoc = await newArticle.save();

      res.status(201).json({
        message: "Article created",
        payload: createdArticleDoc,
      });

    } catch (err) {
      res.status(500).json({
        message: "Failed to create article",
        error: err.message,
      });
    }
  }
);


//get all articles of an author
authorRoute.get(
  "/articles/:authorId",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const { authorId } = req.params;

      // Validate authorId
      if (!authorId || authorId === "undefined" || !mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).json({ message: "Invalid Author ID" });
      }

      const articles = await Article.find({
        author: authorId,
      }).populate("author", "firstName lastName profileImageUrl");

      res.status(200).json({
        message: "Articles fetched",
        payload: articles,
      });

    } catch (err) {
      res.status(500).json({
        message: "Error fetching articles",
        error: err.message,
      });
    }
  }
);


//edit article
authorRoute.put(
  "/articles",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const { articleId, title, category, content } = req.body;
      const authorId = req.user.userId;

      const updatedArticle = await Article.findOneAndUpdate(
        { _id: articleId, author: authorId }, 
        { $set: { title, category, content } },
        { new: true }
      );

      if (!updatedArticle) {
        return res.status(404).json({
          message: "Article not found or unauthorized",
        });
      }

      res.status(200).json({
        message: "Article updated",
        payload: updatedArticle,
      });

    } catch (err) {
      res.status(500).json({
        message: "Update failed",
        error: err.message,
      });
    }
  }
);


//soft delete or restore article
authorRoute.patch(
  "/articles/:id/status",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isArticleActive } = req.body;

      const article = await Article.findOneAndUpdate(
        { _id: id, author: req.user.userId },
        { isArticleActive },
        { new: true }
      );

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(200).json({
        message: `Article ${isArticleActive ? "restored" : "deleted"}`,
        article,
      });

    } catch (err) {
      res.status(500).json({
        message: "Operation failed",
        error: err.message,
      });
    }
  }
);