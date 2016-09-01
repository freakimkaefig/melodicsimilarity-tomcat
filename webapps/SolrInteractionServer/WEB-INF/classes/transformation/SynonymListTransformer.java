package transformation;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
/*
 * Class to transform a Synonymlist from OpenThesaurus to a List, that can be used in Solr
 * Was only used once to create the List, has no further meaning for implementation in Back-End or Front-End
 * 
 * Synonymlist from OpenThesaurus https://www.openthesaurus.de/about/download
 */
public class SynonymListTransformer {
	
	private final String OUTPUT_FILENAME = "synonymList.txt";
	private String filepath = "";
	
	/*
	 * Main-Method to use the Class outside of Servlet-Implementation
	 */
	public static void main(String [] args) throws IOException{
		//Per Default list has to be on same path level as Project
		SynonymListTransformer transformer = new SynonymListTransformer("openthesaurus.txt");
		transformer.transformSynonymList();
	}
	
	public SynonymListTransformer(String filepath){
		this.filepath = filepath;
	}
	
	public void transformSynonymList(){
		
		FileWriter writer;
		File file;
		file = new File(OUTPUT_FILENAME);
		
		try (BufferedReader br = new BufferedReader(new FileReader(filepath))){
			writer = new FileWriter(file);
			String sCurrentLine;
			
			// Iterate over Lines of original List, every Line consists of ;-seperated List of Synonyms
			while ((sCurrentLine = br.readLine()) != null) {
				
				String outputLine = "";
				
				// Get every single synonym per line
				String [] splitLine = sCurrentLine.split(";");
				
				for(int i=0; i < splitLine.length; i++){
					// Clean all words from disturbing signs for Solr
					String lineItem = cleanLineItem(splitLine[i]);
					// clean "." and add comma-separation
					outputLine += lineItem.replace(".", "") + ",";		
				}
				// delete the last "," from each generated line
				if(outputLine.length() > 0){
					outputLine = outputLine.substring(0, outputLine.length()-1);
				}
				/*
				 * first few lines of the OpenThesaurus List start with "#" as comments
				 * this makes shure that these lines are not recognized in the
				 * transformation
				 * */
				if(outputLine.contains("#"))
					continue;
				
				// split the generated line by "," to get the single synonym items
				String [] outputArray = outputLine.split(",");
				String finalOutputLine = "";
				
				// remove the items which contain a whitespace because its not compatible with solr
				for(int i=0; i < outputArray.length; i++){
					if(!outputArray[i].contains(" "))
						finalOutputLine += outputArray[i] + ",";
				}
				// create a new output line with the clean items separated by ","
				if(finalOutputLine.length() > 0)
					finalOutputLine = finalOutputLine.substring(0, finalOutputLine.length()-1);
				// write the outputline to the output file if it is not empty and does not contain only
				// one item
				if(!finalOutputLine.equals("") && finalOutputLine.contains(",")){
					writer.write(finalOutputLine);
					writer.write(System.getProperty("line.separator")); 
				}  
			}
			writer.flush();
		    writer.close();

		}catch (IOException e) {
			e.printStackTrace();
		} 
	}
	// clean the line of brackets
	public String cleanLineItem(String input){
		
		String output = "";
		String trimmedOutput = "";
		
		output = input.replaceAll("\\([^\\(^\\)]*\\)", "");
		trimmedOutput = output.trim();
		
		return trimmedOutput;
	}
}
