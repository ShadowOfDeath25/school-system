import styles from './styles.module.css'
import {useInputModal} from "@contexts/InputModalContext.jsx";
export default function BookPicker() {
    const {showEditModal} = useInputModal()
    return (
        <table className={styles.container}>
            <thead>
                <tr>
                    <th>
                        النسخة
                    </th>
                    <th>
                        الكمية
                    </th>
                    <th>
                        السعر
                    </th>
                    <th>
                        الاجمالي
                    </th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
                <button>اضافة كتب</button>
            </tfoot>
        </table>
    );
}

