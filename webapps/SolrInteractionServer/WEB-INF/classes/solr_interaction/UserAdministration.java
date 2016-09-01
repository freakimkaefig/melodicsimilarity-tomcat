package solr_interaction;

import java.io.IOException;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrResponse;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
/*
 * Class to communicate with the users-core, to add and remove Users
 * and to handle Authentication-Process
 * 
 * Uses gson to prettyprint and work with JSON: https://github.com/google/gson
 * Uses SolrJ as Solr-Client-Library to communicate with Solr, SolrJ is part of the Solr Distribution
 */
public class UserAdministration {
	
	private SolrClient usersCore;
	
	public UserAdministration(){
		// init communication client --> users
		usersCore = new HttpSolrClient(Globals.USERS_URL);
	}
	
	/*
	 * Method to add User to solr-core users
	 * Expects username, password and role (role isn't used in this project)
	 */
	public String addUser(String username, String password, String role) throws Exception{
		// The arguments can't be empty
		if(username.equals("") || username == null || password.equals("") || password == null){
			throw new Exception("Username or Password cannot be empty");
		}
		
		SolrInputDocument doc = new SolrInputDocument();
		doc.addField("username", username);
		doc.addField("password", password);
		doc.addField("role", role);
		
		UpdateResponse response = usersCore.add(doc);
		usersCore.commit();
		return indentResponse(response);
	}
	/*
	 * Method to remove user by username, should only be used by Admin
	 */
	public String removeUser(String username) throws SolrServerException, IOException{
		
		//build Query to finde the user-document and delete it
		String queryString = "username:" + username;
		SolrResponse response = usersCore.deleteByQuery(queryString);
		usersCore.commit();
		
		return indentResponse(response);
	}
	
	/*
	 * Necessary method for authentication process
	 * Used by AuthenticationService in REST-API
	 */
	public boolean checkUsernameAndPassword(String username, String password) throws SolrServerException, IOException{
		
		// Username and password can't be empty
		if(username.equals("") || username == null || password.equals("") || password == null){
			return false;
		}
		try{
			//First, get all users-docs with the username to test
			SolrQuery solrquery = new SolrQuery();
			solrquery.setQuery("username:" + username);
			QueryResponse qr = usersCore.query(solrquery);
			
			SolrDocumentList list = qr.getResults();
			
			//Iterate over all the users with the username and test the password
			for(int i = 0; i < list.size(); i++){
				SolrDocument user = list.get(i);
				String solrPassword = user.getFieldValue("password").toString();
				
				if(solrPassword.equals(password)){
					return true;
				}
			}
		// if something went wrong, probably something was wrong, so return false
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		// return false if username doesn't exist or password is wrong
		return false;
	}
	
	/*
	 * Method to prettyprint responses to the client
	 */
	private String indentResponse(Object response){
		  Gson gson = new GsonBuilder().setPrettyPrinting().create();;
		  String json = gson.toJson(response);
		  return json;
	  }

}
