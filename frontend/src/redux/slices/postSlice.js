import { createSlice } from "@reduxjs/toolkit";


const postSlices = createSlice({
  name : "post",
  initialState : {
    feed : [],
    explorePosts : [],
  },
  reducers : {
    setFeed : (state, action) => {
      state.feed = action.payload;
    },
    addPost : (state , action)=>{
        state.feed.unshift(action.payload);
    },
    removePost : (state ,action) => {
      state.feed = state.feed.filter(post => post._id !== action.payload);
    },
    toggleLike : (state ,action)=>{
      const {postId , userId} = action.payload;
      const post = state.feed.find((p) => p._id === postId);
      if(post){
        const isLiked = post.likes.includes(userId);
        if(isLiked){
          post.likes = post.likes.filter((id) => id !== userId);
        }else{
          post.likes.push(userId);
        }
      }
    },
    setExplorePosts : (state , action) => {
      state.explorePosts = action.payload;
    }
  }
})


export const { setFeed , addPost , removePost , toggleLike , setExplorePosts } = postSlices.actions;

export default postSlices.reducer;