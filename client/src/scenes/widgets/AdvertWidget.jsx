import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper >
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsorisé
        </Typography>
        <Typography color={medium}>ESGIS</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/esgis_togo_officiel_240815631_379913300251999_3699793581529207575_n.jpg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>ESGIS</Typography>
        <Typography color={medium}>esgis.org</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
       L'Ecole Supérieure de Gestion, d'Informatique et des Sciences (ESGIS), l'école des Leaders.
      </Typography>
    </WidgetWrapper>
    
  );
};

export default AdvertWidget;
