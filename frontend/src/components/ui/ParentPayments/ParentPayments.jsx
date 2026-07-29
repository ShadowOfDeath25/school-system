import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import { PaymentHelper } from "@helpers/PaymentHelper.js";
import { useGetAll } from "@hooks/api/useCrud.js";
import styles from "./styles.module.css";

export default function ParentPayments({ student, academicYear }) {
  const [open, setOpen] = useState(false);

  const { data: parentData, isLoading, refetch } = useGetAll(
    `students/${student?.id}/parent-payments`,
    { academic_year: academicYear },
    {
      enabled: false,
      queryKey: ["parent-payments", student?.id, academicYear],
    }
  );

  const handleOpen = () => {
    setOpen(true);
    refetch();
  };

  if (!student?.has_siblings || student.has_siblings !== "نعم") {
    return null;
  }

  return (
    <>
      <div className={styles.buttonWrapper}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          عرض إجمالي مدفوعات ولي الأمر
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        className="parentPaymentsModal"
      >
        <DialogTitle className={styles.dialogTitle}>
          إجمالي مدفوعات ولي الأمر
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <LoadingScreen />
          ) : parentData ? (
            <>
              <div className={styles.siblingsList}>
                <strong>الأبناء: </strong>
                {parentData.siblings?.map((s, i) => (
                  <span key={s.id}>
                    {s.name}
                    {i < parentData.siblings.length - 1 ? " - " : ""}
                  </span>
                ))}
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>المطلوب</TableCell>
                    <TableCell>المدفوع</TableCell>
                    <TableCell>اعفائات</TableCell>
                    <TableCell>المتبقي</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={styles.label}>
                      المصروفات الادارية
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        (parentData.required?.[
                          PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE
                        ] ?? 0) +
                          (parentData.required?.[
                            PaymentHelper.PAYMENT_TYPES.WITHDRAWAL
                          ] ?? 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.paid?.[
                          PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE
                        ]
                      )}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        (parentData.remaining?.[
                          PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE
                        ] ?? 0) +
                          (parentData.remaining?.[
                            PaymentHelper.PAYMENT_TYPES.WITHDRAWAL
                          ] ?? 0)
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.label}>
                      المصروفات الدراسية
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.required?.[
                          PaymentHelper.PAYMENT_TYPES.TUITION
                        ]
                      )}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.paid?.[
                          PaymentHelper.PAYMENT_TYPES.TUITION
                        ]
                      )}
                    </TableCell>
                    <TableCell>
                      {parentData.exemptions?.exemptions ?? "-"}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.remaining?.[
                          PaymentHelper.PAYMENT_TYPES.TUITION
                        ]
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.label}>
                      مصروفات الكتب
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.required?.[
                          PaymentHelper.PAYMENT_TYPES.BOOKS
                        ]
                      )}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.paid?.[PaymentHelper.PAYMENT_TYPES.BOOKS]
                      )}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.remaining?.[
                          PaymentHelper.PAYMENT_TYPES.BOOKS
                        ]
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.label}>
                      مصروفات الزي
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.required?.[
                          PaymentHelper.PAYMENT_TYPES.UNIFORM
                        ]
                      )}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.paid?.[PaymentHelper.PAYMENT_TYPES.UNIFORM]
                      )}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.remaining?.[
                          PaymentHelper.PAYMENT_TYPES.UNIFORM
                        ]
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.label}>
                      مستحقات اضافية
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.required?.[
                          PaymentHelper.PAYMENT_TYPES.EXTRA_DUES
                        ]
                      )}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.paid?.[
                          PaymentHelper.PAYMENT_TYPES.EXTRA_DUES
                        ]
                      )}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.remaining?.[
                          PaymentHelper.PAYMENT_TYPES.EXTRA_DUES
                        ]
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.label}>الإجمالي</TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.total?.required
                      )}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(parentData.total?.paid)}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.total?.exemption
                      )}
                    </TableCell>
                    <TableCell>
                      {PaymentHelper.formatCurrency(
                        parentData.total?.remaining
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
