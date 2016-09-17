package solr_interaction;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import jxl.read.biff.BiffException;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.common.SolrInputDocument;

import transformation.Metadates;
import transformation.XlsTransformer;
/*
 * Class to import xls-Files of Augias Export into solr-core: metaDates
 * 
 * Uses SolrJ as Solr-Client-Library to communicate with Solr, SolrJ is part of the Solr Distribution
 */
public class MetadatesImporter {
	
	private SolrClient metaData;

	
	//Method to initalize the Metadata-Core for import
	private void initMetaData(){
		String url = Globals.METADATA_URL;
		metaData = new HttpSolrClient(url);
	}
	
	/*
	 * Imports all xls-Files of a folderpath into metaData-core
	 * Excpects folderpath with valid xls-Files
	 */
	public void importMetadatesToSolr(String folderpath) throws SolrServerException, IOException, BiffException, NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException{
		initMetaData();
		Collection<SolrInputDocument> docs = createMetadatesSolrCollection(folderpath);
		importMetadatesCollectionToSolr(docs);
	}
	
	/*
	 * Method to import a single metaData-Table into metaData
	 * Expects path to a specific valid xls-File
	 */
	public void importSingleMetadataTableToSolr(String filepath) throws BiffException, IOException, NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException, SolrServerException{
		
		// Start connection to metaData-core
		initMetaData();
		
		File file = new File(filepath);
		Collection<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();
		
		// Transform metadates of xls-File to Metadates-Array via XlsTransformer
		XlsTransformer xlsTransformer = new XlsTransformer(file);
		Metadates[] metadates = xlsTransformer.createMetadatesFromExcel();
		
		// Iterate over every metadates-element (row of table) and create SolrInputDocument
		for(int j = 0; j < metadates.length; j++){
			SolrInputDocument solrMetadates = createMetadatesSolrDocument(metadates[j]);
			docs.add(solrMetadates);
		}
		
		// import collection to solr-core: metaData
		importMetadatesCollectionToSolr(docs);
	}
	
	/*
	 * Method to import metaData-Collection to metaData-core and commit changes
	 */
	private void importMetadatesCollectionToSolr(Collection<SolrInputDocument> docs) throws SolrServerException, IOException{
		
		 metaData.add(docs);
		 metaData.commit();
	}
	/*
	 * Method to import several metadata-tables into solr-core
	 * Expects path to Folder of valid xls-Files
	 */
	public Collection<SolrInputDocument> createMetadatesSolrCollection(String path) throws BiffException, IOException, NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException{
		
		// Get File of every xls-File
		File[] files = new File(path).listFiles();
		
		Collection<SolrInputDocument> docs = new ArrayList<SolrInputDocument>();
		
		// Iterate over every File, and over every row to create Metadates-Array and transform i
		// to SolrInputDocument
		for(File file : files){
			XlsTransformer xlsTransformer = new XlsTransformer(file);
			Metadates[] metadates = xlsTransformer.createMetadatesFromExcel();


			for(int j = 0; j < metadates.length; j++){
				SolrInputDocument solrMetadates = createMetadatesSolrDocument(metadates[j]);
				docs.add(solrMetadates);
			}

		}
		
		return docs;
	}
	
	/*
	 * Method to transform Metadates-Object to SolrInputDocument to import into solr-core metaData
	 */
	private SolrInputDocument createMetadatesSolrDocument(Metadates metadates) throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException{
		
		SolrInputDocument solrMetadates = new SolrInputDocument();
		
		// Get every content of Metadates-Object and copy it to corresponding field of Solr-Document
		solrMetadates.addField("dateFindAid", metadates.getDateFindAid());
		solrMetadates.addField("receivedOn", metadates.getReceivedOn());
		solrMetadates.addField("signature", metadates.getSignature());
		solrMetadates.addField("oldSignature", metadates.getOldSignature());
		solrMetadates.addField("versionNumber", metadates.getVersionNumber());
		solrMetadates.addField("missingCause", metadates.getMissingCause());
		solrMetadates.addField("origin", metadates.getOrigin());
		solrMetadates.addField("title", metadates.getTitle());
		solrMetadates.addField("type", metadates.getType());
		solrMetadates.addField("includes", metadates.getIncludes());
		solrMetadates.addField("incipit", metadates.getIncipit());
		solrMetadates.addField("numberOfPages", metadates.getNumberOfPages());
		solrMetadates.addField("singPlace", metadates.getSingPlace());
		solrMetadates.addField("remark", metadates.getRemark());
		solrMetadates.addField("landscapeArchive", metadates.getLandscapeArchive());
		solrMetadates.addField("publication", metadates.getPublication());
		solrMetadates.addField("sungOn", metadates.getSungOn());
		solrMetadates.addField("recordedOn", metadates.getRecordedOn());
		solrMetadates.addField("submittedOn", metadates.getSubmittedOn());
		solrMetadates.addField("singer", metadates.getSinger());
		solrMetadates.addField("reference", metadates.getReference());
		solrMetadates.addField("handwrittenSource", metadates.getHandwrittenSource());
		solrMetadates.addField("recorder", metadates.getRecorder());
		solrMetadates.addField("archive", metadates.getArchive());
		
		return solrMetadates;
	}

}
