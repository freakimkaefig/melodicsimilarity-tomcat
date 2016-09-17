package solr_interaction;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.common.SolrInputDocument;
import org.xml.sax.SAXException;

import transformation.SongSheetDoc;
import transformation.XmlTransformer;
/*
 * Class to import ABBYY-XML-Outputs as SongSheetDocs into Solr
 * Uses SolrJ as Solr-Client-Library to communicate with Solr, SolrJ is part of the Solr Distribution
 */
public class DocumentImporter {	
	
	private SolrClient searchableDocs;
	
	
	public DocumentImporter(){
		
	}
	
	
	/*
	 * Method to initialize the Main-Core for search and Document-Import: searchableDocs
	 */
	private void initSearchableDocs(){
		String url = Globals.DOCS_URL;
		searchableDocs = new HttpSolrClient(url);
	}
	
	/*
	 * Imports all XML-Files into searchableDocs
	 * Excpects folderpath with valid ABBYY-XML-Files
	 */
	public void importToSolr (String folderpath) throws ParserConfigurationException, SAXException, IOException, SolrServerException{
		initSearchableDocs();
		Collection<SolrInputDocument> docs = createSolrCollection(folderpath);
		importCollectionToSolr(docs);
	}
	
	/*
	 * Method to import a single Docuemnt into searchableDocs
	 * Expects path to specific valid ABBY-XML-File
	 */
	public void importSingleDocToSolr(String docPath) throws ParserConfigurationException, SAXException, IOException, SolrServerException{
		
		Collection<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();
		
		// init connection to searchableDocs-core
		initSearchableDocs();
		File file = new File(docPath);
		
		// Use XmlTransformer to transform ABBYY-XML-File to SongSheetDoc
		XmlTransformer toSolrTransformer = new XmlTransformer(file);
		SongSheetDoc songSheetDoc = toSolrTransformer.createSongSheetDoc();
		
		// Transform SongSheetDoc to SolrDocument an add it to a collection
		SolrInputDocument solrInputDoc = createSolrDocument(songSheetDoc);
		docs.add(solrInputDoc);
		
		// same Method as to import collection to Solr-Core, this time the collection consists of one Element
		importCollectionToSolr(docs);
		
	}
	
	/*
	 * Method to import transformed SolrDocuments into solr-core and commit the changes
	 */
	private void importCollectionToSolr(Collection<SolrInputDocument> docs) throws SolrServerException, IOException{
		
		 searchableDocs.add(docs);
		 searchableDocs.commit();
	}
	
	/*
	 * Method to create Collection of SolrInputDocuments to add to solr-core
	 * Expects the folderpath
	 */
	private Collection<SolrInputDocument> createSolrCollection(String folderpath) throws ParserConfigurationException, SAXException, IOException{
		
		// Create File-Array for every single ABBYY-XML-file
		File[] files = new File(folderpath).listFiles();
		
		Collection<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();
		
		// Iterate over all Files, transform them to SongSheetDoc, transform them to SolrInputDocuments
		// and add them to the collection
		for(File file : files){
			XmlTransformer toSolrTransformer = new XmlTransformer(file);
			SongSheetDoc songSheetDoc = toSolrTransformer.createSongSheetDoc();
			SolrInputDocument solrInputDoc = createSolrDocument(songSheetDoc);
			docs.add(solrInputDoc);
		}
		
		return docs;
	}
	
	/*
	 * Method to transform one SongSheetDoc to SolrInputDocument to import it to Solr
	 */
	private SolrInputDocument createSolrDocument(SongSheetDoc songSheetDoc){
		SolrInputDocument doc = new SolrInputDocument();
		
		// Add the data of a SongSheetDoc as solr-field with the corresponding content
		doc.addField("text", songSheetDoc.getText());
		doc.addField("filename", songSheetDoc.getFilename());
		doc.addField("imagename", songSheetDoc.getImagename());
		
		for(int i = 0; i < songSheetDoc.getBoxCount(); i++){
			doc.addField("vPos_" + i, Integer.parseInt(songSheetDoc.getvPositions()[i]));
			doc.addField("hPos_" + i, Integer.parseInt(songSheetDoc.gethPositions()[i]));
			doc.addField("height_" + i, Integer.parseInt(songSheetDoc.getHeights()[i]));
			doc.addField("width_" + i, Integer.parseInt(songSheetDoc.getWidths()[i]));
			doc.addField("boxLines_" + i, Integer.parseInt(songSheetDoc.getBoxLines()[i]));
		}
		
		return doc;
	}
	
}
