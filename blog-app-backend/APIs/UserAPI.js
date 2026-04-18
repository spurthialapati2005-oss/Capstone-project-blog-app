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

                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                // Step 2: call existing register()
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

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
);

//Read all articles(protected route)
userRoute.get('/users', verifyToken("USER"), checkUser, async(req, res) => {
    let uid = req.user.userId;
    let articles = await Article.find({ isArticleActive: true })
     if(!articles){
        return res.status(401).json({message:"Article Not Found"});
    }
    res.status(200).json({message:"All articles", payload: articles})
})

//Add comment to an article
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {
  //get body from req
  const { articleId, comment } = req.body;
  //check article
  const articleDocument = await Article
                          .findOne({ _id: articleId, isArticleActive: true })
                           .populate("comments.user");

  console.log(articleDocument);
  //if article nbot found
  if (!articleDocument) {
    return res.status(404).json({ message: "Article not found" });
  }
  //get user id
  const userId = req.user?.id;
  //add comment to comments array of articleDocument
  articleDocument.comments.push({ user: userId, comment: comment });
  //save
  await articleDocument.save();
  //send res
  res.status(200).json({ message: "Comment added successfully", payload: articleDocument });
});