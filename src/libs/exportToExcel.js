import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { format } from "date-fns"

export const exportToExcel = async ({
  data = [],
  columns = [],
  fileName = "Export",
  sheetName = "Sheet1",
  title = "",
  context = [],
  fromDate,
  toDate
}) => {
  if (!data || data.length === 0) {
    alert("No data to export")
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  const BORDER = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  }

  let rowIndex = 1
  const totalCols = columns.length

  /* ================= TITLE ================= */
  if (title) {
    worksheet.mergeCells(rowIndex, 1, rowIndex, totalCols)
    const cell = worksheet.getCell(rowIndex, 1)
    cell.value = title
    cell.font = { bold: true, size: 16 }
    cell.alignment = { horizontal: "center" }
    rowIndex += 2
  }

  /* ================= CONTEXT ================= */
  context.forEach(text => {
    worksheet.mergeCells(rowIndex, 1, rowIndex, totalCols)
    const cell = worksheet.getCell(rowIndex, 1)
    cell.value = text
    cell.font = { bold: true }
    rowIndex++
  })

  if (fromDate && toDate) {
    worksheet.mergeCells(rowIndex, 1, rowIndex, totalCols)
    worksheet.getCell(rowIndex, 1).value =
      `Period: ${format(new Date(fromDate), "dd MMM yyyy")} to ${format(
        new Date(toDate),
        "dd MMM yyyy"
      )}`
    rowIndex++
  }

  worksheet.mergeCells(rowIndex, 1, rowIndex, totalCols)
  worksheet.getCell(rowIndex, 1).value =
    `Report Generated: ${format(new Date(),"dd-MM-yyyy hh:mm a")}`
  rowIndex += 2

  /* ================= HEADER ================= */
  const headerRowIndex = rowIndex
  const headerRow = worksheet.getRow(headerRowIndex)

  columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1)
    cell.value = col.header
    cell.font = { bold: true }
    cell.alignment = { horizontal: "center" }
    cell.border = BORDER
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" }
    }

    worksheet.getColumn(i + 1).width = col.width || 15
  })

  headerRow.commit()
  rowIndex++

  /* ================= DATA ================= */
  data.forEach(item => {
    const row = worksheet.getRow(rowIndex)

    columns.forEach((col, i) => {
      const cell = row.getCell(i + 1)
      let value = item[col.key]

      // Date formatting if value is Date-like
      if (value instanceof Date) {
        value = format(value, "dd-MM-yyyy")
      }

      cell.value = value ?? ""
      cell.alignment = { horizontal: "center" }
      cell.border = BORDER
    })

    row.commit()
    rowIndex++
  })

  /* ================= AUTO FILTER & FREEZE ================= */
  worksheet.autoFilter = {
    from: { row: headerRowIndex, column: 1 },
    to: { row: headerRowIndex, column: totalCols }
  }

  worksheet.views = [{ state: "frozen", ySplit: headerRowIndex }]

  /* ================= EXPORT ================= */
  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(
    new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    `${fileName}_${format(new Date(), "dd-MM-yyyy")}.xlsx`
  )
}
