import Page from "@ui/Page/Page.jsx";
import {useLocation, useMatches} from "react-router-dom";
import ItemPicker from "@ui/ItemPicker/ItemPicker.jsx";
import SubjectPicker from "@ui/SubjectPicker/SubjectPicker.jsx";

export default function AssignSubjectToGrades() {
    const matches = useMatches();
    const breadcrumbsLinks = matches
        .filter(match => Boolean(match.handle?.breadcrumbs))
        .flatMap(match => match.handle.breadcrumbs());
    const {state} = useLocation();
    return (

        <Page breadcrumbsLinks={breadcrumbsLinks}>
            <SubjectPicker
                grade={state.grade}

                language={"عربي"}
            />
            <SubjectPicker
                grade={state.grade}
                language="لغات"
            />
        </Page>

    );
}

