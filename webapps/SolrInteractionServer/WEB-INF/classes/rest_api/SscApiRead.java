package rest_api;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;

import solr_interaction.SolrReturnObject;
import solr_interaction.SolrSearcher;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
/*
 * REST-API for all Read-Operations on Solr-cores like search
 * 
 * Uses SolrJ as Solr-Client-Library to communicate with Solr, SolrJ is part of the Solr Distribution
 * Uses gson to prettyprint and work with JSON: https://github.com/google/gson
 * Uses Jersey and JAX-RS via javax to implement servlet-architecture, javax is native, jersey: https://jersey.java.net/
 */
	@Path("/ssc-api-read")
	public class SscApiRead {
	
		/*
		 * Method to build an adapted Response for a search via a SolrReturnObject
		 */
		private String buildReturnResponse (QueryResponse response, SolrQuery solrquery, String[] allIds){
			
			// Get all necessary information from the arguments
			SolrDocumentList list = response.getResults();
			Long numFound = response.getResults().getNumFound();
			Map<String, Map<String, List<String>>> highlighting = response.getHighlighting();
			String queryString = solrquery.getQuery();
			int start = solrquery.getStart();
			int rows = solrquery.getRows();
			
			// Build the SolrReturnObject with all necessary informations
			SolrReturnObject sro = new SolrReturnObject(list, highlighting, numFound, queryString,
					solrquery, start, rows, allIds);
			
			// Prettyprint the SolrReturnObject for return to client
			return (indentResponse(sro));
		}
		
		/*
		 * REST-Resource to search in a specific Solr-core
		 * Expects the core as PahtParam e.g. searchableDocs, metaData, users
		 * 
		 * The following are all QueryParams connected in the URL as key-value pairs (connected with =) via &
		 * queryAll := a search-term to search in all Fields of a core (connected via OR), default is ""
		 * value := list of values to search in specific fields, default is an empty list
		 * field := list of fields in which the values are searched, default is an empty list
		 * sequence between value and field is important, search is connected via AND
		 * op := list of boolean operators to connect search-request of fields and values, default AND
		 * start := start-index for solr-result-list, default is 0
		 * rows := number of elements per result-page, default is 100
		 * processingStatus := list of processingStatus to filter the result, default is empty list
		 * 
		 * Examples:
		 * Returns everything 
		 * /ssc-api/read/searchableDocs/complexQuery
		 * 
		 * Returns everything with "Kind":
		 * /ssc-api-read/searchableDocs/complexQuery/queryAll=Kind
		 * 
		 * Returns everything with "Kind" and signature "A 2222" and archive "Bayern"
		 * /ssc-api-read/searchableDocs/complexQuery/queryAll=Kind&field=signature&value=A 2222
		 * &field=archive&value=Bayern
		 * 
		 * Returns all docs with processingStatus edited, and start 0 and rows 20
		 * /ssc-api-read/searchableDocs/complexQuery/processingStatus=edited&start=0&rows=20
		 * 
		 * All queryparts like queryAll and value can make use of the SolrQuerySyntax
		 */
		@GET
		@Produces(MediaType.APPLICATION_JSON)
		@Path("{core}/complexQuery")
		public String complexQuery(
				@PathParam("core") String core,
				@QueryParam("queryAll") String queryAll,
				@QueryParam("value") List<String> values,
				@QueryParam("field") List<String> fields,
				@QueryParam("op") List<String> booleanOps,
				@QueryParam("start") int start,
				@QueryParam("rows") int rows,
				@QueryParam("processingStatus") List<String> statuslist
				) throws SolrServerException, IOException{
			
			// Build searcher-object and querystring to serch in core
			SolrSearcher searcher = new SolrSearcher(core);
			String queryString = searcher.buildComplexQueryString(queryAll, statuslist, values, fields, booleanOps);
			System.out.println("QueryString: " + queryString);
			// Init SolrQuery and search in solr-core, return response
			SolrQuery solrquery = searcher.initSolrQuery(queryString, start, rows);
			QueryResponse response = searcher.queryAndGetResponse(solrquery);
			
			// Get all Ids of found results, otherwise results are limeted by start and rows
			String[] allIds = searcher.getIdsOfAllResults(queryString);
			
			// Build adapted response via SolrReturnObject 
			String returnResponse = buildReturnResponse(response, solrquery, allIds);
			
		    return returnResponse;
		}
		
		/*
		 * Method to get a specific document in a specific core via ID
		 * Expects the core as PathParam e.g., searchableDocs, metaData, users
		 * Expects the id as QueryParam
		 * 
		 * Example:
		 * /ssc-api-read/searchableDocs/id=f685091f-f097-4d64-b9cd-e2ce83ebbdce
		 */
		  @GET
		  @Produces(MediaType.APPLICATION_JSON)
		  @Path("{core}/getDocumentById")
		  public String getDocumentById (
				  @PathParam ("core") String core,
				  @QueryParam("id") String id) throws SolrServerException, IOException{
			  
			  SolrSearcher searcher = new SolrSearcher(core);
			  SolrDocument document = searcher.getDocumentById(id);
			  
			  // Prettyprint SolrDocument-Object for Client
			  return indentResponse(document);
			  
		  }
		  
		  /*
		   * Method to get a list of SolrDocuments via ID
		   * Expects the core as PathParam e.g., searchableDocs, metaData, users
		   * Excects the ids as comma-seperated list in the data-attribute of the POST
		   * 
		   * Example:
		   * /ssc-api-read/searchableDocs/getDocumentsByIds
		   * data: f685091f-f097-4d64-b9cd-e2ce83ebbdce,d685091f-f097-4d64-b9cd-e2ce83ebbdce,r685091f-f097-4d64-b9cd-e2ce83ebbdce
		   */
		  @POST
		  @Produces(MediaType.APPLICATION_JSON)
		  @Path("{core}/getDocumentsByIds")
		  public String getDocumentsByIds(
				  @PathParam("core") String core, String data) throws SolrServerException, IOException{
			  
			  SolrSearcher searcher = new SolrSearcher(core);
			  String[] ids = data.split(",");
			  
			  SolrDocument[] documents = searcher.getDocumentsByIds(ids);
			  
			  // Prettyprint SolrDocument-Array for Client 
			  return indentResponse(documents);
		  }
				  
		  /*
		   * Method to indent a java-object and transform it to JSON-String
		   * Only cosmetic feature to prettyprint the response back to the client
		   */
		  private String indentResponse(Object response){
			  Gson gson = new GsonBuilder().setPrettyPrinting().create();;
			  String json = gson.toJson(response);
			  return json;
		  }
	
	} 
