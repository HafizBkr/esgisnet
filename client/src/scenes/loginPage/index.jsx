import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
       
        <Box >
          <img src="http://localhost:3001/assets/logo-esgis-net.png" alt="Logo" style={{ width: "250px" }}/>
        </Box> 


      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Bienvenue sur ESGIS NET, un réseau social pour les Esgisiens !
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
