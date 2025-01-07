import * as React from "react";
import styles from "./AppHeader.module.scss";
import { Text } from "@fluentui/react/lib";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton/IconButton";

export default function AppHeader(props: { userEmail: string; siteURL: string; userName: string; title: any; logo: any; absoluteURL: string; isUserAdmin: Boolean; configurationListData: any}) {
 
  const navigate = useNavigate();
  const handleChange = (tab: string) => {
    if (tab === "Home") {
      navigate("/");
    }else{
      navigate("/ConfigurationScreen");
    }
  };
  let Permissions = JSON.parse(props.configurationListData[0].Permissions);
  let deafutSettingIconShow = false; 
  let ServerRelativeUrl = props.logo && props.logo.length > 0 && props.logo[0].ServerRelativeUrl  ? props.logo[0].ServerRelativeUrl  : '';
  let baseURL = props.absoluteURL.split("sites")[0]?props.absoluteURL.split("sites")[0]:"";
  let imageUrl = "";
  if(ServerRelativeUrl!="" && baseURL!=""){
    imageUrl = `${baseURL}${ServerRelativeUrl}`;
  }else{
    imageUrl = "";
  }

  if(Permissions.AdminGroup.length === 0 && Permissions.Admin.length === 0){
    deafutSettingIconShow = true;
  }
  
  return (
    <div className={styles.bt_ah_AppHeader}>
      <img className={styles.bt_ah_CompanyLogo} src={imageUrl != "" ? imageUrl : require("../../assets/companyLogo.png")} alt="" />
      
      <Text block className={styles.bt_ah_HeaderText}> {props.title}</Text>
      
      <div className={styles.IconDiv}>
        { (props.isUserAdmin || deafutSettingIconShow ) && (
            <div>
            <IconButton aria-label="Setting"size="small" onClick={() => handleChange("ConfigurationScreen")} >
              <img className={styles.SettingIcon} src={require("../../assets/settings.png")} alt="Setting" />
            </IconButton>
          </div>
        )}

        <div>
          <IconButton aria-label="Home" size="small" onClick={() => handleChange("Home")} >
            <img className={styles.HomeIcon} src={require("../../assets/home.png")} alt="Home" onClick={() => handleChange("Home")} />
          </IconButton>
        </div>
        
      </div>
    </div>
  );
}
