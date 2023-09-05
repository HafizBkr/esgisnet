import React, { useState, useEffect } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  EmojiEmotionsOutlined,
} from "@mui/icons-material";
import UserImage from "components/UserImage";
import { Box, Divider, IconButton, InputBase, Button, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Picker from "emoji-picker-react";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  videoPath,
  userPicturePath,
  likes,
  comments,
  updatedAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const comment = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: commentText, userId: loggedInUserId }),
    });
    const updatedPost = await response.json();

    // console.log(updatedPost)
    dispatch(setPost({ post: updatedPost }));
    setCommentText("");
    setShowEmojiPicker(false);
  };



  const fetchCreatedAt = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/createdAt`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch createdAt");
      }
  
      const postData = await response.json();
      const createdAt = postData.createdAt;
  
      // console.log(createdAt)
      setCreatedAt(createdAt);
  
    } catch (error) {
      console.error("Error occurred while fetching createdAt:", error);
      // Gérer l'erreur ici
    }
  };
  




  const renderMedia = () => {
    if (picturePath) {
      const fileExtension = picturePath.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const videoExtensions = ["mp4", "avi", "mov"];

      if (imageExtensions.includes(fileExtension)) {
        return (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        );
      } else if (videoExtensions.includes(fileExtension)) {
        return (
          <video width="100%" height="500px" controls>
            <source src={`http://localhost:3001/assets/${picturePath}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return (
          <div>
            <a href={`http://localhost:3001/assets/${picturePath}`} download>
              Télécharger le fichier
            </a>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const { emoji } = emojiObject;
    setCommentText((prevText) => prevText + emoji);
  };


  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
  
    // Obtenir les éléments de la date et de l'heure
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Formater la date et l'heure
    const formattedDate = `${day} ${month} ${year}`;
    const formattedTime = `${hours.toString().padStart(2, "0")}h${minutes.toString().padStart(2, "0")}`;
  
    // Retourner la date et l'heure formatées
    return `${formattedDate} à ${formattedTime}`;
  };

  

  const [createdAt, setCreatedAt] = useState(null);

  useEffect(() => {
    fetchCreatedAt();
  }, []);

  return (
    <WidgetWrapper m="2rem 0">
      <Friend friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath} />
      <Typography color={main} variant="caption" sx={{ mt: "0.9rem" }}>
          Posté le {createdAt ? formatDate(createdAt) : "..."}
      </Typography>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {renderMedia()}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? <FavoriteOutlined sx={{ color: primary }} /> : <FavoriteBorderOutlined />}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
            
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">

             {/* Input du commentaire  */}

             <Box>
             {/* <UserImage image={picturePath} /> */}
            <InputBase
              placeholder="Commenter 😀"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              endAdornment={
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <EmojiEmotionsOutlined />
                </IconButton>
              }
              sx={{
                border:"1px solid",
                borderRadius: "3rem",
                padding: "0 18px",
                marginBottom: "1rem"
              }}
            />
            <Button variant="contained" onClick={comment}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                  padding: "6px 18px",
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.background.alt,
                    backgroundColor: palette.primary.dark,
                  },
                }}
            >
              Publier
            </Button>
            </Box>
            
            <Divider />





          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
            <FlexBetween>
              <Box>
              <Typography style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={`http://localhost:3001/assets/${comment.userPicturePath}`} style={{ width: '25px', borderRadius: '50px'}} alt="User" />
                  {comment.userName}
                </Typography>
                
              </Box>
              <Typography style={{ textAlign: 'end'}} sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>{comment.comment}</Typography>
              
            </FlexBetween>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
      {showEmojiPicker && (
        <Picker
          onEmojiClick={handleEmojiClick}
          pickerStyle={{ position: "absolute", bottom: "4rem", right: "1rem" }}
        />
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
