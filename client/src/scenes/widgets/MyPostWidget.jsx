import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  EditOutlined,
  DeleteOutlined,
  // AttachFileOutlined,
  // GifBoxOutlined,
  ImageOutlined,
  // MicOutlined,
  // MoreHorizOutlined,
  VideoLibraryOutlined,
  InsertDriveFileOutlined,
  EmojiEmotionsOutlined, // Added emoji icon
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import Picker from "emoji-picker-react"; // Emoji picker component

const MyPostWidget = ({ picturePath, videoPath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isDocument, setIsDocument] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [post, setPost] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Added state for emoji picker
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    const currentDate = new Date();
    formData.append("createdAt", currentDate.toISOString());
    if (imageFile) {
      formData.append("picture", imageFile);
      formData.append("picturePath", imageFile.name);
    }
    if (videoFile) {
      formData.append("video", videoFile);
      formData.append("videoPath", videoFile.name);
    }
    if (documentFile) {
      formData.append("document", documentFile);
      formData.append("documentPath", documentFile.name);
    }

    try {
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }

  //     const responseData = await response.json(); // Récupérer les données JSON de la réponse
  // console.log(responseData);


      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImageFile(null);
      setVideoFile(null);
      setDocumentFile(null);
      setPost("");
      setShowEmojiPicker(false); // Resetting the emoji picker state
    } catch (error) {
      console.error("Error occurred in handlePost:", error);
      // Gérer l'erreur ici
      // Vous pouvez accéder à la source de l'erreur avec error.source
    }
  };



  const handleEmojiClick = (emojiObject) => {
    const { emoji } = emojiObject;
    setPost((prevPost) => prevPost + emoji); // Appending the emoji to the post text
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="Commencer un post..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
          endAdornment={ // Added endAdornment for the emoji picker icon
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotionsOutlined />
            </IconButton>
          }
        />
      </FlexBetween>
      {(isImage || isVideo || isDocument) && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles={isImage ? ".jpg,.jpeg,.png" : isVideo ? ".mp4" : ".pdf,.doc,.docx"}
            multiple={false}
            onDrop={(acceptedFiles) => {
              if (isImage) {
                setImageFile(acceptedFiles[0]);
              } else if (isVideo) {
                setVideoFile(acceptedFiles[0]);
              } else if (isDocument) {
                setDocumentFile(acceptedFiles[0]);
              }
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!imageFile && !videoFile && !documentFile ? (
                    <p>
                      {isImage ? "Add Image Here" : isVideo ? "Add Video Here" : "Add Document Here"}
                    </p>
                  ) : (
                    <FlexBetween>
                      <Typography>
                        {isImage
                          ? imageFile.name
                          : isVideo
                          ? videoFile.name
                          : documentFile.name}
                      </Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {(imageFile || videoFile || documentFile) && (
                  <IconButton
                    onClick={() => {
                      if (isImage) {
                        setImageFile(null);
                      } else if (isVideo) {
                        setVideoFile(null);
                      } else if (isDocument) {
                        setDocumentFile(null);
                      }
                    }}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsVideo(!isVideo)}>
          <VideoLibraryOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Video
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsDocument(!isDocument)}>
          <InsertDriveFileOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Document
          </Typography>
        </FlexBetween>

        <Button
          disabled={!post}
          onClick={handlePost}
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
            display: post ? "inline-block" : "none", // Ajout de la condition pour la visibilité
          }}
        >
          PUBLIER
        </Button>
      </FlexBetween>

      {showEmojiPicker && ( // Added condition to display emoji picker
        <Picker
          onEmojiClick={handleEmojiClick}
          pickerStyle={{ position: "absolute", bottom: "4rem", right: "1rem" }}
        />
      )}
    </WidgetWrapper>
  );
};

export default MyPostWidget;
