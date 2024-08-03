import React from "react";

function LisitngPhotos({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `${API_BASE_URL}/uploads/` + src;
  return <img {...rest} src={src} alt={""} />;
}

export default LisitngPhotos;
