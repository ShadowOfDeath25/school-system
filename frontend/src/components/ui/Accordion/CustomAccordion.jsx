import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import styles from './styles.module.css';


export default function CustomAccordion({children, header, icon, expanded, onChange}) {

    return (
        <>
            <Accordion
                expanded={expanded}
                disableGutters
                onChange={onChange}
                sx={{margin: 0}}
                className={styles.customAccordion}
            >
                <AccordionSummary className={styles.accordionSummary}>
                    {header}
                </AccordionSummary>
                <AccordionDetails sx={{padding: 0}}>
                    <div className={styles.accordionContent}>
                        {children}
                    </div>
                </AccordionDetails>
            </Accordion>
        </>
    );
}
