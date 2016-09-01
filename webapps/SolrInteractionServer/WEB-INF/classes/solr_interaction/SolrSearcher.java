package solr_interaction;

import java.io.IOException;
import java.util.List;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
/*
 * Class to commmunicate with Solr and search in solr-core searchableDocs
 * Used mainly by Read-REST-API
 * Main-Task is to build a complex Query to send to solr-core searchableDocs
 * 
 * Uses SolrJ as Solr-Client-Library to communicate with Solr, SolrJ is part of the Solr Distribution
 */
public class SolrSearcher {
	
	private SolrClient searchableDocs;
	private SolrClient metaData;
	
	// All metaData-fields that can be searched saved in an array to easier work with it
	private String[] fieldStrings;
	
	// Current core to search in
	private SolrClient chosenCore;
	
	// Set the core to search in on initialization
	public SolrSearcher (String core) {
		init();
		chosenCore = getCore(core);
	};
	
	private void init(){
		searchableDocs = new HttpSolrClient(Globals.DOCS_URL);
		metaData = new HttpSolrClient(Globals.METADATA_URL);
		fieldStrings = new String[] {"text",
				"dateFindAid",
				"receivedOn",
				"signature",
				"oldSignature",
				"versionNumber",
				"missingCause",
				"origin",
				"title",
				"type",
				"includes",
				"incipit",
				"numberOfPages",
				"singPlace",
				"remark",
				"landscapeArchive",
				"publication",
				"sungOn",
				"recordedOn",
				"submittedOn",
				"singer",
				"reference",
				"handwrittenSource",
				"recorder",
				"archive",
				"lastChangedPerson"
				};
	}
	
	/*
	 * Method to get the client to connect to the core by the name of the core
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
	 * Method to query the current solr-core via the SolrQuery, which is created before
	 */
	public QueryResponse queryAndGetResponse(SolrQuery query) throws SolrServerException, IOException{
		QueryResponse qr = chosenCore.query(query);
		return qr;
		
	};
	
	/*
	 * Method to get all IDs of a resultlist (not in normal Solr Response)
	 * to build the SolrReturnObject
	 */
	public String[] getIdsOfAllResults(String queryString) throws SolrServerException, IOException{
		
		// Set start to 0 and row to maximum to get really ALL results with the query
		SolrQuery solrquery = initSolrQuery(queryString, 0, Integer.MAX_VALUE);
		QueryResponse response = chosenCore.query(solrquery);
		String[] allIds = new String[response.getResults().size()];
		
		// Iterate over all results and save ID
		for(int i = 0; i < response.getResults().size(); i++){
			SolrDocument currentDoc = response.getResults().get(i);
			allIds[i] = currentDoc.getFieldValue("id").toString();
		}
		
		return allIds;
	}
	
	/*
	 * Main-Method to build a complex query-string to query a solr-core
	 * Expects 
	 * - the searchterm to query all fields
	 * - the list of processingStatus-Values to filter the results
	 * - a corresponding list of values and fields to search specific value in a specific field, the list
	 * 	 is connected via AND
	 * - a list of boolean operators like OR,AND  if you don't want the field/value-list to be connected
	 *   via AND
	 * - everything can be empty --> returns all results
	 *   --> see also corresponding methods in Front-End and in SscApiRead that uses this method
	 */
	public String buildComplexQueryString(String queryAll, List<String> statuslist, List<String> values,
			List<String> fields, List<String> booleanOps){
		String queryString = "";
		
		// queryString gets build step by step
		queryString = addQueryForAllFields(queryString, queryAll);
		queryString = addStatusQuery(queryString, statuslist);
		queryString = addSpecificFieldsQuery(queryString, values, fields, booleanOps);
		
		return queryString;
	}
	
	/*
	 * Method to build the part of the queryString to search in a term in all fields
	 * 
	 * Returns for example:
	 * (text:knecht) OR (incipit:knecht) ...usw for all fields
	 */
	private String addQueryForAllFields (String queryString, String query){
		if(query != null){
			queryString = queryString + "(";
			// Iterate over all fields to be searched in
			for(int i = 0; i < fieldStrings.length; i++){
				if(i != fieldStrings.length - 1){
					
					// connect all fields via OR
					queryString = queryString + fieldStrings[i] + ":(" + query + ") OR ";
				}else{
					// last field ends queryString
					queryString = queryString + fieldStrings[i] + ":(" + query + ")";
				}	
			}
			queryString = queryString + ")";
		}else{
			// if the query is empty, search for everything
			queryString = queryString + "*:*";
		}
		
		return queryString;
	}
	
	/*
	 * Method to add the processingStatus-query-part to the queryString
	 * 
	 * Adds something like this to the queryString:
	 * AND (processingStatus:edited) OR (processingStatus:design)
	 */
	private String addStatusQuery(String queryString, List<String> statuslist){
		
		// If no filter for the processingStatus is given, do nothing at all
		if(!statuslist.isEmpty()){
			//connect the existing processingStatus-variables OR (added to the existing query with AND)
			queryString = queryString + " AND (";
			for(int i = 0; i < statuslist.size(); i++){
				if(i == statuslist.size() - 1){
					queryString = queryString + "processingStatus" + ":" + statuslist.get(i);
				}else{
					queryString = queryString + "processingStatus" + ":" + statuslist.get(i) + " OR ";
				}
			}
			queryString = queryString + ")";
		}
		return queryString;
	}
	
	/*
	 * Method to add to the queryString the search for specific values in specific fields
	 * 
	 * Adds something like this:
	 * AND (incipit:knecht) AND (archive:bayern) AND (signature:22)
	 */
	private String addSpecificFieldsQuery(String queryString, List<String> values, 
			List<String> fields, List<String> booleanOps){
		
		// if list is empty do nothing at all
		if(!values.isEmpty()){
			queryString = queryString + " AND (";
		}
		
		for(int i = 0; i < values.size(); i++){
			
			// build the string to search in specific field with specific value
			System.out.println("values " + values.get(i));
			if(!values.get(i).equals("")){
				queryString = queryString + fields.get(i) + ":(" + values.get(i) + ")";
			}else{
				queryString = queryString + fields.get(i) + ":(" + "*" + ")";
			}
			
			if(i != (values.size()-1)){
				
				// if the boolean operators are empty use AND per default
				if(!booleanOps.isEmpty()){
					if(booleanOps.get(i) != null){
						queryString = queryString + " " + booleanOps.get(i) + " ";
					}else{
						queryString = queryString + " AND ";
					}
				}else{
					queryString = queryString + " AND ";
				}
			}
		}
		
		if(!values.isEmpty()){
			queryString = queryString + ")";
		}
		
		return queryString;
	}
	
	/*
	 * Method to initalize the SolrQuery to send to Solr, when the queryString is set
	 * Sets start and row and activates highlighting to get highlighted snippets for Front-End
	 */
	public SolrQuery initSolrQuery(String queryString, int start, int rows){
		SolrQuery solrquery = new SolrQuery();
		solrquery.setQuery(queryString);
		initHighlighting(solrquery);
		initStartAndRows(solrquery, start, rows);
		
		return solrquery;
	}
	
	/*
	 * Method to init start and rows
	 * If rows is 0 (doesn't make sense) rows gets set to 100
	 */
	private void initStartAndRows(SolrQuery solrquery, int start, int rows){
		solrquery.setStart(start);
		if(rows == 0){
			rows = 100;
		}
		solrquery.setRows(rows);
	}
	
	/*
	 * Method to initialize the Highlighting-component in the SolrQuery
	 * Adjusted to work best in Front-End
	 */
	private void initHighlighting(SolrQuery solrquery){
		solrquery.setHighlight(true);
		// Add the highlighting for all fields
		for(int i = 0; i < fieldStrings.length; i++){
			solrquery.addHighlightField(fieldStrings[i]);
		}
		
		// Maximum size is 300 chars, maximum numbers of snippets to return is 3
		solrquery.setHighlightFragsize(300);
		solrquery.setHighlightSnippets(3);
	}
	
	/*
	 * Simple Method to get a document by id, used in Read-REST-API
	 */
	public SolrDocument getDocumentById(String id) throws SolrServerException, IOException{
		SolrDocument document = chosenCore.getById(id);
		return document;
	}
	
	/*
	 * Simple Method to get all documents by ids, used in Read-REST-API
	 */
	public SolrDocument[] getDocumentsByIds(String[] ids) throws SolrServerException, IOException{
		SolrDocument[] documents = new SolrDocument[ids.length];
		  
		  for(int i = 0; i < ids.length; i++){
			  documents[i] = chosenCore.getById(ids[i]);
			  
		  }
		 return documents;
	}

}
