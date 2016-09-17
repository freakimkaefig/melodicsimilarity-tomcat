package transformation;

import java.io.File;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
/*
 * Class to transform Abbyy-XML-Output of OCR-Process to SongSheetDoc-Object to use later on Import in Solr
 * Uses Parser of Javax and w3c Elements for Transforming (both Libraries are native in Java)
 */
public class XmlTransformer {
	
	private File file;
	private SongSheetDoc songSheetDoc;

	/*
	 * Expects XML-File to transform on Initialization
	 */
	public XmlTransformer (File file){
		this.file = file;
		songSheetDoc = new SongSheetDoc();
	}
	
	/*
	 * Main-Method to create a SongSheetDoc from an XML-File as Storage
	 */
	public SongSheetDoc createSongSheetDoc() throws ParserConfigurationException, SAXException, IOException{
		String text = "";
		
		Document xmlDoc = createXmlDocument(file);
		// Text is saved in TextBlocks in ABBYY-XML, so get all TextBlocks of the XML
		NodeList textBlockList = xmlDoc.getElementsByTagName("TextBlock");
		
		// Every TextBox has distinct positioning-information, set Arrays according to numbers of TextBlocks
		String[] vPositions = new String[textBlockList.getLength()];
	    String[] hPositions = new String[textBlockList.getLength()];
	    String[] heights = new String[textBlockList.getLength()];
	    String[] widths = new String[textBlockList.getLength()];
	    String[] boxLines = new String[textBlockList.getLength()];
	    songSheetDoc.setBoxCount(textBlockList.getLength());
		
	    // Iterate over all TextBlocks
    	for(int i = 0; i < textBlockList.getLength(); i++){
    		Element textBlock = (Element) textBlockList.item(i);
    		
    		//Get all positions, heights and widths
    		vPositions[i] = textBlock.getAttribute("VPOS");
    		hPositions[i] = textBlock.getAttribute("HPOS");
    		heights[i] = textBlock.getAttribute("HEIGHT");
    		widths[i] = textBlock.getAttribute("WIDTH");
    		
    		// Text is stored in TextLine-Elements in TextBlock-Elements
    		NodeList textLinesList = textBlock.getElementsByTagName("TextLine");
    		
    		// Store number of Textlines a Textbox consists of
    		// --> to retrieve from plain text via newLines the exakt text, a corresponding TextBox consists of
    		boxLines[i] = Integer.toString(textLinesList.getLength());
    		
    		// Loop over TextLine-Elements to create the Text with new-Line-Markers
    		for(int j = 0; j < textLinesList.getLength(); j++){
    			Element textLine = (Element) textLinesList.item(j);
    			
    			// Text is saved in String-Element
    			NodeList textStringsList = textLine.getElementsByTagName("String");
    			
    			for(int k = 0; k < textStringsList.getLength(); k++){
    				Element textString = (Element) textStringsList.item(k);
    				// Raw Text is saved in CONTENT Attribute of String-Element
    				text = text + textString.getAttribute("CONTENT");
    				
    				//Checking if End of Line is reached
    				if(k != (textStringsList.getLength() - 1)){
    					text = text + " ";
    				}
    				
    			}
    			//Adding a new Line after every TextLine
    			text = text + "\n";
    		}
    	}
    	
    	// Replace all <, > so nothing gets confused for HTML-Elements in Front-End
    	// (Happens rather often in the Noise-Output of the File)
    	text = text.replaceAll("<", "&lt;");
    	text = text.replaceAll(">", "&gt;");
    	
    	songSheetDoc.setFilename(file.getName());
    	songSheetDoc.setImagename(createImagename(file.getName()));
    	songSheetDoc.setText(text);
    	songSheetDoc.setvPositions(vPositions);
    	songSheetDoc.sethPositions(hPositions);
    	songSheetDoc.setHeights(heights);
    	songSheetDoc.setWidths(widths);
    	songSheetDoc.setBoxLines(boxLines);
		
		return songSheetDoc;
	}
	
	// Create imagename of a SongSheetDoc by filename of XML-File
	// ! Has to have ending .jpg !
	private String createImagename(String filename){
		String imagename = filename.substring(0, filename.length()-3);
		imagename = imagename + "jpg";
		System.out.println(imagename);
		return imagename;
	}
	
	// First Method that gets invoked in Main-Method, transforms File to Document-Object via Parser
	public Document createXmlDocument(File xmlFile) throws ParserConfigurationException, SAXException, IOException{
		
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document xmlDoc = dBuilder.parse(xmlFile);
		return xmlDoc;
	}
}
