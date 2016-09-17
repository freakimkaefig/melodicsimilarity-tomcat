package solr_interaction;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import jxl.read.biff.BiffException;

import org.apache.solr.client.solrj.SolrServerException;
import org.xml.sax.SAXException;

import transformation.XlsTransformer;

public class MainTestClass {
	
	public static void main (String args[]) throws Exception{
		
	    // To add all Xml-Docs of a folder to Solr (searchableDocs)
		/*
		DocumentImporter solrInteraction = new DocumentImporter();
		solrInteraction.importToSolr("WebContent/FrontEnd/assets/xml");
		*/
		
		// To add users to Solr (users)
		/*
		UserAdministration ua = new UserAdministration();
		ua.addUser("admin", "admin", "admin");
		*/
		// To remove users from Solr 
		//#TODO
		
		
		// To add one xml-Doc to Solr (searchableDocs)
		/*
		DocumentImporter solrInteraction = new DocumentImporter();
		solrInteraction.importSingleDocToSolr("C:/Users/Thomas/Documents/GitHub/SongSheets/BackEnd/SolrInteractionServer/data/abby-xml/ubr16444_0013.xml");
		*/
		
		
		// To add all xls-Files of a Folder to Solr (metaData) 
		/*
		MetadatesImporter mdi = new MetadatesImporter();
		mdi.importMetadatesToSolr("assets/metadata");
		*/	
	}
}
