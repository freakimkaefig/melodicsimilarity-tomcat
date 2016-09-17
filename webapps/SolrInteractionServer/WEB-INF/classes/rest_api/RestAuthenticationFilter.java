package rest_api;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/*
 * Class to filter every write-request, gets set in web.xml
 * Uses AuthenticationService to check username and password
 * Returns 401-Response (Unauthorized) back to client when check fails
 */
public class RestAuthenticationFilter implements javax.servlet.Filter {
	
	// Header that sends Authorization-Credentials is "Authorization"
	public static final String AUTHENTICATION_HEADER = "Authorization";

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain filter) throws IOException, ServletException {
		
		// get Authorization-Header from request
		HttpServletRequest httpServletRequest = (HttpServletRequest) request;
		String authCredentials = httpServletRequest
				.getHeader(AUTHENTICATION_HEADER);
		AuthenticationService authenticationService = new AuthenticationService();
		
		// Check authorization-credentials via authenticationService
		boolean authenticationStatus = authenticationService
				.authenticate(authCredentials);
		
		// If password and username are correct continue request to resource in ssc-api-write...
		if (authenticationStatus) {
			filter.doFilter(request, response);
			
			// ...if incorrect return 401-Response to Client (Unauthorized)
		}else {
			if (response instanceof HttpServletResponse) {
				HttpServletResponse httpServletResponse = (HttpServletResponse) response;
				httpServletResponse
						.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			}
		}	
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

}
