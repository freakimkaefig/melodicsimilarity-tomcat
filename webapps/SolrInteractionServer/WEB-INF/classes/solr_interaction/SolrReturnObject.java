package solr_interaction;

import java.util.List;
import java.util.Map;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.common.SolrDocumentList;
/*
 * Own designed Object to return a adapted response for Front-End 
 * instead of the normal Solr-Response
 * Fields get created in SolrSearcher, Object is a formatted Storage to return to Client
 */
public class SolrReturnObject {
	
	// All results corresponding to start and row values
	public SolrDocumentList documents;
	// The highlighting information for snippets
	public Map<String, Map<String, List<String>>> highlighting;
	// The number of all results to the query (not in normal Solr-Response because of start and row)
	public long numFound;
	
	// The query and SolrQuery for debugging issues
	public String query;
	public SolrQuery solrquery;
	public int start;
	public int row;
	
	// IDs of all the found documents (not in normal Solr-Response because of start and row)
	public String[] allIds;
	
	public SolrReturnObject(SolrDocumentList documents, 
			Map<String, Map<String, List<String>>> highlighting,
			long numFound,
			String query,
			SolrQuery solrquery,
			int start,
			int row,
			String[] allIds){
		
		this.documents = documents;
		this.highlighting = highlighting;
		this.numFound = numFound;
		this.query = query;
		this.solrquery = solrquery;
		this.start = start;
		this.row = row;
		this.allIds = allIds;
	}

}
