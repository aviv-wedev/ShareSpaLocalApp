import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

class ExcelUtilities {
  private filePath: string;
  private jsonPosts;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    this.filePath = path.join(path.dirname(__filename), "../../../posts.xlsx");
    const workbook = XLSX.readFile(this.filePath);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    this.jsonPosts = XLSX.utils.sheet_to_json(workSheet, { header: 1 }).slice(1);
  }

  public getJsonPosts() {
    return this.jsonPosts;
  }

  public formatDate(serialNumber: number) {
    return XLSX.SSF.format("yyyy-mm-dd", new Date(1900, 0, serialNumber - 1));
  }
}

export default new ExcelUtilities();
