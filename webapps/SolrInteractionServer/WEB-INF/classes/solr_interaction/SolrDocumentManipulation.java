package solr_interaction;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrInputDocument;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
/*
 * Class to update and delete Documents in solr-cores
 * 
 * Uses SolrJ as Solr-Client-Library to communicate with Solr, SolrJ is part of the Solr Distribution
 * Uses gson to prettyprint and work with JSON: https://github.com/google/gson
 */
public class SolrDocumentManipulation {
	
	// Connection to every major solr-core possible
	private SolrClient searchableDocs;
	private SolrClient metaData;
	
	// Current core gets saved as chosenCore
	private SolrClient chosenCore;
	
	/*
	 * On creation chosenCore gets set
	 */
	public SolrDocumentManipulation (String core) {
		init();
		chosenCore = getCore(core);
	};
	
	/*
	 * Necessary method to init SolrClients for solr-cores
	 */
	private void init(){
		searchableDocs = new HttpSolrClient(Globals.DOCS_URL);
		metaData = new HttpSolrClient(Globals.METADATA_URL);
	}
	
	/*
	 * Method used in update and delete to determine current core by String
	 */
	private SolrClient getCore(String core){
		if(core.equals("searchableDocs")){
			return searchableDocs;
		}
		if(core.equals("metaData")){
			return metaData;
		}
		
		return null;
	}
	
	/*
	 * Method to update a document
	 * Excepts valid JSON that corresponds to Solr-Field-Structure
	 * Needs only fields that are affected by change and id to identify document to be updated
	 * Field-Value-structure corresponds to key-value-structure in JSON
	 * 
	 * Example Parameter:
	 * { "id": "f685091f-f097-4d64-b9cd-e2ce83ebbdce", "text": "Dies ist ein geänderter Text" }
	 */
	public UpdateResponse updateDocument(JsonObject document) throws SolrServerException, IOException{
		  
		  String docId = document.get("id").getAsString();
		  
		  // Build a new Document with same ID
		  SolrInputDocument solrDocument = new SolrInputDocument();
		  solrDocument.addField("id", docId);
		  
		  // Get all Entries of JSON-Object (all key-value-pairs)
		  Set<Map.Entry<String,JsonElement>> entrySet = document.entrySet();
		  
		  // Iterate over all entries
		  for(Map.Entry<String,JsonElement> entry:entrySet){
			  // No need to update id
			  if(!(entry.getKey().equals("id"))){
				  String value = document.get(entry.getKey()).getAsString();
				  
				  // Use Map to build update-query, map contains of pairs like "set" and the valuecontent
				  // to update
				  Map<String,Object> fieldModifier = new HashMap<>();
				  fieldModifier.put("set", value);
				  
				  //Add this fieldmodifier to update fields, with the fitting fields
				  solrDocument.addField(entry.getKey(), fieldModifier);	
			  } 			  	
			}
		  
		  // Commit the update and return the solrResponse
		  UpdateResponse response = chosenCore.add(solrDocument);
		  
		  chosenCore.commit();
		  
		  return response;
	}
	
	/*
	 * Method to delete a document by ID
	 * This affects only the document in the solrCore (chosenCore)
	 */
	public UpdateResponse deleteById(String id) throws SolrServerException, IOException{
		UpdateResponse ur = chosenCore.deleteById(id);
		chosenCore.commit();
		return ur;
	}
}
