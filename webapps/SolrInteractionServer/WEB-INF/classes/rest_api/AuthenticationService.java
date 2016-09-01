package rest_api;

import java.io.IOException;
import java.util.Base64;
import java.util.StringTokenizer;

import solr_interaction.UserAdministration;
/*
 * Class to implement the authentication
 * Used by RestAuthenticationFilter.
 */
public class AuthenticationService {
	
	/*
	 * Method to test if username and password are correct in Solr Core users
	 * Returns true when everything is correct, and false if something is wrong
	 */
	public boolean authenticate(String authCredentials){
		
		// No authCredentials results in false
		if (null == authCredentials){
			return false;
		}
		
		//	Decode the base64 authCredentials-String of Form: Basic dXNlcjE6c29uZ3NoZWV0czE=
		//	First remove the start-string Basic
		final String encodedUserPassword = authCredentials.replaceFirst("Basic"
				+ " ", "");
		
		String usernameAndPassword = null;
		
		try {
			// Decode the raw base64 --> Result is: username:password
			byte[] decodedBytes = Base64.getDecoder().decode(
					encodedUserPassword);
			usernameAndPassword = new String(decodedBytes, "UTF-8");
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		try {
			// Get username and password by splitting the String on :
			final StringTokenizer tokenizer = new StringTokenizer(
					usernameAndPassword, ":");
			final String username = tokenizer.nextToken();
			final String password = tokenizer.nextToken();
			
			// Test if username and password is fitting via UserAdministration-Object
			// Connects to Solr-core users
			UserAdministration ua = new UserAdministration();
			
			boolean authenticationStatus = ua.checkUsernameAndPassword(username, password);
			return authenticationStatus;
			// If something doesn't go well return false
		}catch(Exception e){
			return false;
		}
			
	}

}
