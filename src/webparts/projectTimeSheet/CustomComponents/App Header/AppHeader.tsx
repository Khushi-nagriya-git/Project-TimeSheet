import * as React from "react";
import styles from "./AppHeader.module.scss";
import { Text } from "@fluentui/react/lib";
let redirectURLOpen = "_self";

export default function AppHeader(props: {
  userEmail: string;
  siteURL: string;
  userName: string;
}) {
  return (
    <div className={styles.bt_ah_AppHeader}>
      <img
        className={styles.bt_ah_CompanyLogo}
        src={require("../../assets/companyLogo.png")}
        alt=""
      />

      <Text  block className={styles.bt_ah_HeaderText}>
       Project Timesheet
      </Text>
      <div
        className={styles.bt_ah_HomeIcon}
        onClick={() => {
          window.open(`${props.siteURL}`, redirectURLOpen);
        }}
      >
        {/* <Home size={28} color="#0078D4" /> */}
      </div>
    </div>
  );
}
