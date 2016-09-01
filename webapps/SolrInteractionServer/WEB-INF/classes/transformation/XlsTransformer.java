package transformation;

import java.io.File;
import java.io.IOException;

import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;
/*
 * Class to transform an xls-File (Augias Export) into multiple Metadates-Object to import later in Solr
 * Uses Library JXL to work with Office-Data: http://jexcelapi.sourceforge.net/
 */
public class XlsTransformer {
	
	private File file;
	
	// Xls-File gets set on initialization
	public XlsTransformer(File file){
		this.file = file;
		
	}
	/*
	 * Main-Method to create Metadates-Array from xls-File, one xls-File consists of multiple rows
	 * which stand for one item of Metadates (which consists of multiple single fields)
	 */
	public Metadates[] createMetadatesFromExcel() throws BiffException, IOException{
		
		// Create sheet and get columns and rows to iterate over
		Sheet sheet = getSheetFromExcelFile();
		int col = sheet.getColumns();
		int rows = sheet.getRows();
		
		// Init metadates-Array
		Metadates[] metadates = new Metadates[rows-1];
		// Iterate over rows, first row consists of headlines and gets skipped
		for(int i = 1; i < rows; i++){
			
			String[] metadatesPerRow = new String[col];
			
			for(int j = 0; j < col; j++){
				
				//Set String-Array on correct position, if no content, "" gets set
				metadatesPerRow[j] = sheet.getCell(j, i).getContents();
			}
			
			// Create Metadates-Object with data of a row
			Metadates singleMetadate = new Metadates(metadatesPerRow);
			// Copy metadates of row in a metadates-object-array
			metadates[i-1] = singleMetadate;
		}
		
		return metadates;
		
	}
	
	/*
	 * Method to get the Sheet of an Excel-File
	 */
	private Sheet getSheetFromExcelFile() throws BiffException, IOException{
		
		Workbook w = Workbook.getWorkbook(file);
		
		Sheet sheet = w.getSheet(0);
		return sheet;
	}

}
