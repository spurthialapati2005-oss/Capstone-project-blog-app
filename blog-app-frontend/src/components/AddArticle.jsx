import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../AuthStore/useAuth';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function AddArticle() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { category: "General" }
  });
  
  const selectedCategory = watch("category");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const onArticleSubmit = async (data) => {
    setIsSubmitting(true);

    const finalArticleObj = {
      title: data.title,
      content: data.content,
      category: data.category === "Other" ? data.customCategory : data.category,
      isArticleActive: true
    };

    try {
      const res = await axios.post('https://capstone-project-blog-app-zk0y.onrender.com/author-api/articles', finalArticleObj, { 
        withCredentials: true 
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Article Published!");
        setTimeout(() => {
          navigate("/author-profile");
        }, 150);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create article";
      toast.error(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-purple-100">
        
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center tracking-tight">
          New Story
        </h2>

        <form onSubmit={handleSubmit(onArticleSubmit)} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              {...register("title", { required: "Title is required" })} 
              className="w-full p-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all" 
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select 
              {...register("category", { required: "Category is required" })} 
              className="w-full p-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
            >
              <option value="General">General</option>
              <option value="Programming">Programming</option>
              <option value="Life Stories">Life Stories</option>
              <option value="Travel">Travel</option>
              <option value="Health">Health</option>
              <option value="Other">Other (Create your own)</option>
            </select>
          </div>

          {/* Custom Category */}
          {selectedCategory === "Other" && (
            <div>
              <label className="block text-sm font-semibold text-purple-600 mb-1">
                Custom Category Name
              </label>
              <input 
                type="text" 
                {...register("customCategory", { required: "Please name your category" })} 
                className="w-full p-3 bg-purple-50 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                placeholder="Enter your topic..."
              />
              {errors.customCategory && <p className="text-red-500 text-xs mt-1">{errors.customCategory.message}</p>}
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
            <textarea 
              {...register("content", { required: "Content is required" })} 
              rows="8" 
              className="w-full p-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none resize-none transition-all"
            ></textarea>
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-all active:scale-[0.98] disabled:bg-gray-300"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddArticle;