import * as XLSX from 'xlsx';
import { ExcelJobDescription, ExcelProcessingResult } from '../types';

/**
 * ExcelProcessor - Handles processing of Excel files containing multiple job descriptions
 */
export class ExcelProcessor {
  private errors: string[] = [];

  /**
   * Process Excel file and extract job descriptions
   */
  public processExcelFile(fileBuffer: Buffer): ExcelProcessingResult {
    this.errors = [];
    
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        throw new Error('No worksheet found in Excel file');
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1) as any[][];

      const jobDescriptions = this.parseJobDescriptions(headers, dataRows);

      return {
        jobDescriptions,
        errors: this.errors,
        totalRows: dataRows.length,
        processedRows: jobDescriptions.length
      };
    } catch (error) {
      this.errors.push(`Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        jobDescriptions: [],
        errors: this.errors,
        totalRows: 0,
        processedRows: 0
      };
    }
  }

  /**
   * Parse job descriptions from Excel rows
   */
  private parseJobDescriptions(headers: string[], dataRows: any[][]): ExcelJobDescription[] {
    const jobDescriptions: ExcelJobDescription[] = [];
    
    // Map common column names to our expected fields
    const columnMap = this.createColumnMap(headers);

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // +2 because we start from row 2 (after headers)

      try {
        const jobDescription = this.parseJobDescriptionRow(row, columnMap, rowNumber);
        if (jobDescription) {
          jobDescriptions.push(jobDescription);
        }
      } catch (error) {
        this.errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Failed to parse row'}`);
      }
    }

    return jobDescriptions;
  }

  /**
   * Create a mapping between Excel column headers and our expected fields
   */
  private createColumnMap(headers: string[]): Record<string, number> {
    const columnMap: Record<string, number> = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();
      
      // Map various possible column names to our expected fields
      if (normalizedHeader.includes('title') || normalizedHeader.includes('position') || normalizedHeader.includes('role')) {
        columnMap['title'] = index;
      } else if (normalizedHeader.includes('company') || normalizedHeader.includes('organization')) {
        columnMap['company'] = index;
      } else if (normalizedHeader.includes('department') || normalizedHeader.includes('team')) {
        columnMap['department'] = index;
      } else if (normalizedHeader.includes('location') || normalizedHeader.includes('city') || normalizedHeader.includes('address')) {
        columnMap['location'] = index;
      } else if (normalizedHeader.includes('description') || normalizedHeader.includes('summary')) {
        columnMap['description'] = index;
      } else if (normalizedHeader.includes('requirement') || normalizedHeader.includes('qualification')) {
        columnMap['requirements'] = index;
      } else if (normalizedHeader.includes('experience') || normalizedHeader.includes('years')) {
        columnMap['minimumExperience'] = index;
      } else if (normalizedHeader.includes('skill') && normalizedHeader.includes('required')) {
        columnMap['requiredSkills'] = index;
      } else if (normalizedHeader.includes('skill') && normalizedHeader.includes('preferred')) {
        columnMap['preferredSkills'] = index;
      } else if (normalizedHeader.includes('education') || normalizedHeader.includes('degree')) {
        columnMap['education'] = index;
      } else if (normalizedHeader.includes('salary') || normalizedHeader.includes('compensation')) {
        columnMap['salary'] = index;
      } else if (normalizedHeader.includes('type') || normalizedHeader.includes('employment')) {
        columnMap['employmentType'] = index;
      }
    });

    return columnMap;
  }

  /**
   * Parse a single job description row
   */
  private parseJobDescriptionRow(row: any[], columnMap: Record<string, number>, rowNumber: number): ExcelJobDescription | null {
    // Validate required fields
    if (!columnMap['title'] || !columnMap['company'] || !columnMap['description']) {
      this.errors.push(`Row ${rowNumber}: Missing required fields (title, company, or description)`);
      return null;
    }

    const title = this.getCellValue(row, columnMap['title']);
    const company = this.getCellValue(row, columnMap['company']);
    const description = this.getCellValue(row, columnMap['description']);

    if (!title || !company || !description) {
      this.errors.push(`Row ${rowNumber}: Missing required field values`);
      return null;
    }

    const jobDescription: ExcelJobDescription = {
      id: this.generateJobId(title, company, rowNumber),
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      requirements: this.getCellValue(row, columnMap['requirements']) || '',
      department: this.getCellValue(row, columnMap['department']),
      location: this.getCellValue(row, columnMap['location']),
      education: this.getCellValue(row, columnMap['education']),
      salary: this.getCellValue(row, columnMap['salary']),
      employmentType: this.getCellValue(row, columnMap['employmentType']),
      minimumExperience: this.parseExperience(row, columnMap['minimumExperience']),
      requiredSkills: this.parseSkills(row, columnMap['requiredSkills']),
      preferredSkills: this.parseSkills(row, columnMap['preferredSkills'])
    };

    return jobDescription;
  }

  /**
   * Get cell value safely
   */
  private getCellValue(row: any[], index: number): string {
    if (index === undefined || index < 0 || index >= row.length) {
      return '';
    }
    const value = row[index];
    return value ? String(value).trim() : '';
  }

  /**
   * Parse experience requirements
   */
  private parseExperience(row: any[], index: number): number | undefined {
    if (index === undefined) return undefined;
    
    const value = this.getCellValue(row, index);
    if (!value) return undefined;

    // Extract numbers from strings like "3+ years", "5 years", etc.
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }

  /**
   * Parse skills from comma-separated or semicolon-separated strings
   */
  private parseSkills(row: any[], index: number): string[] | undefined {
    if (index === undefined) return undefined;
    
    const value = this.getCellValue(row, index);
    if (!value) return undefined;

    return value
      .split(/[,;]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  /**
   * Generate a unique job ID
   */
  private generateJobId(title: string, company: string, rowNumber: number): string {
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const sanitizedCompany = company.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `${sanitizedCompany}-${sanitizedTitle}-${rowNumber}`;
  }

  /**
   * Validate Excel file structure
   */
  public validateExcelStructure(fileBuffer: Buffer): { isValid: boolean; errors: string[] } {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        return { isValid: false, errors: ['No worksheet found in Excel file'] };
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as string[];
      
      if (!headers || headers.length === 0) {
        return { isValid: false, errors: ['No headers found in Excel file'] };
      }

      const requiredColumns = ['title', 'company', 'description'];
      const columnMap = this.createColumnMap(headers);
      const missingColumns = requiredColumns.filter(col => columnMap[col] === undefined);

      if (missingColumns.length > 0) {
        return { 
          isValid: false, 
          errors: [`Missing required columns: ${missingColumns.join(', ')}`] 
        };
      }

      return { isValid: true, errors: [] };
    } catch (error) {
      return { 
        isValid: false, 
        errors: [`Failed to validate Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      };
    }
  }
} 