import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async ({
  sheetName = 'Report',
  fileName = 'Report.xlsx',
  columns = [],
  rows = []
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Columns
  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 20
  }));

  // Rows
  rows.forEach(row => worksheet.addRow(row));

  // Header styling
  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, fileName);
};
