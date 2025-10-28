import styles from './styles.module.css'

export default function StudentPayments({student}) {
    return (
        <>
            <div className={styles.container}>
                <h3 className={styles.title}>مدفوعات التلميذ</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>المطلوب</th>
                            <th>المدفوع</th>
                            <th>اعفائات</th>
                            <th>المتبقي</th>
                        </tr>
                    </thead>

                </table>
            </div>
        </>
    );
}

