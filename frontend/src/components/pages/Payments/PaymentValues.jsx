import styles from './styles.module.css'
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {Tab, Tabs} from "@mui/material";
import {useState} from "react";

const CustomTab = (props) => {
    return (
        <Tab
            {...props}
            sx={{
                color: "white",
                '&.Mui-selected': {
                    color: "var(--primary-text-color)",
                    backgroundColor: "rgba(0,0,0,.2) !important"
                }
            }}
        />
    )
}
export default function PaymentValues() {
    const [tab, setTab] = useState();
    return (
        <Page>
            <form className={styles.container}>
                <div className={styles.tabsWrapper}>
                    <span>انواع المدفوعات</span>
                    <Tabs
                        value={tab}
                        onChange={(e, newValue) => setTab(newValue)}
                        sx={{
                            "& .MuiTabs-indicator":{
                                backgroundColor: "var(--secondary-color)"
                            }
                        }}
                    >
                        <CustomTab id={"1"} label={'tab1'}/>
                        <CustomTab id={"2"} label={'tab1'}/>
                        <CustomTab id={"3"} label={'tab1'}/>
                    </Tabs>
                </div>
                <SelectField
                    {...ClassroomHelper.FIELDS.ACADEMIC_YEAR}
                />
            </form>
        </Page>
    );
}

