import * as React from "react";
import styles from "./AppHeader.module.scss";
import { Text } from "@fluentui/react/lib";
let redirectURLOpen = "_self";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton/IconButton";

export default function AppHeader(props: {
  userEmail: string;
  siteURL: string;
  userName: string;
  title: any;
}) {
  const navigate = useNavigate();

  const handleChange = (tab: string) => {
    if (tab === "Home") {
      navigate("/");
    }else{
      navigate("/ConfigurationScreen");
    }
  };

  return (
    <div className={styles.bt_ah_AppHeader}>
      <img
        className={styles.bt_ah_CompanyLogo}
        src={require("../../assets/companyLogo.png")}
        alt=""
      />

      <Text block className={styles.bt_ah_HeaderText}>
        {props.title}
      </Text>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "77px",
          marginRight:"25px"
        }}
      >
        <div>
          <IconButton
            aria-label="Setting"
            size="small"
            onClick={() => handleChange("ConfigurationScreen")}
          >
            <img
              style={{
                height: "27px",
                width: "27px",
                marginTop: "3px",
                cursor: "pointer",
              }}
              src={require("../../assets/settings.png")}
              alt="Setting"
            />
          </IconButton>
        </div>

        <div>
          <IconButton
            aria-label="Home"
            size="small"
            onClick={() => handleChange("Home")}
          >
            <img
              style={{
                height: "30px",
                width: "30px",
                cursor: "pointer",
              }}
              src={require("../../assets/home.png")}
              alt="Home"
              onClick={() => handleChange("Home")}
            />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
