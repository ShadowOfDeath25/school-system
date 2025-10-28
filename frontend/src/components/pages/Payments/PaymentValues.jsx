import styles from './styles.module.css'
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function PaymentValues() {
    return (
        <Page>
            <form className={styles.container}>
                <SelectField
                    {...ClassroomHelper.FIELDS.ACADEMIC_YEAR}
                />
            </form>
        </Page>
    );
}

