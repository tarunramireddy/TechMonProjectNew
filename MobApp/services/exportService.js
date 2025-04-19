// services/exportService.js
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

export const exportAssetsToExcel = async (assets) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(assets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');

    const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const uri = FileSystem.cacheDirectory + 'assets_report.xlsx';

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Download Excel',
      UTI: 'com.microsoft.excel.xlsx',
    });
  } catch (error) {
    console.error('Failed to export Excel:', error);
  }
};