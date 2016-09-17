package rest_api;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;

import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.xml.parsers.ParserConfigurationException;

import jxl.read.biff.BiffException;

import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrDocument;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.xml.sax.SAXException;

import solr_interaction.MetadatesImporter;
import solr_interaction.DocumentImporter;
import solr_interaction.SolrDocumentManipulation;
import solr_interaction.SolrSearcher;
import solr_interaction.UserAdministration;
import transformation.JpegTransformer;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/*
 * REST-API for all Write-Operations on Solr-cores like upload, update and delete
 * All resources are protected via Base64-Authentication, therefore every request needs Header 
 * with name "Authentication" and then the Base64-encoded username and passwordd
 * see web.xml, AuthenticationService.java,
 * RestAuthenticationFilter.java and Documentation for more information
 * 
 * Uses gson to prettyprint and work with JSON: https://github.com/google/gson
 * Uses Jersey and JAX-RS via javax to implement servlet-architecture, javax is native, jersey: https://jersey.java.net/
 * 
 */

@Path("/ssc-api-write")
public class SscApiWrite {

	
	private boolean errorOnUpload;
	
	/*
	 * Context-Object of the server to get relative paths to save imgs, xmls and xls
	 */
	@Context
	   private ServletContext context;
			
	/*
	 * Simple login-ressource, only checks via Authentication if client can login
	 * and can use the Write-REST-API
	 * Path:
	 * /ssc-api-write/login
	 */
	@POST
	@Path("login")
	public void login(){
		//login test runs over AuthenticationService.java
	}
	
	/*
	 * REST-Resource to add a new user, new username and password gets added via headers with the
	 * same name in the POST-request
	 * Returns SolrResponse to Client
	 * Path:
	 * /ssc-api-write/users/addUser
	 */
	@POST
	@Path("/users/addUser")
	public String addUser(@HeaderParam ("username") String username, @HeaderParam("password") String password) throws Exception{
		// User get added via UserAdministration-Object
		UserAdministration ua = new UserAdministration();
		String response = ua.addUser(username, password, "Admin");
		
		return response;
	}
	/*
	 * REST-Resource to remove a User via username and password
	 * #TODO
	 */
	@POST
	@Path("/users/removeUser")
	public String removeUser(@HeaderParam ("username") String username) throws SolrServerException, IOException{
		UserAdministration ua = new UserAdministration();
		String response = ua.removeUser(username);
		return response;
	}
	/*
	 * REST-Resource to upload a new data part like ABBYY-XML-Output, XLS-File (Augias Export)
	 * or JPG-File of the songsheet
	 * 
	 * Must be posted via POST-Request as MulipartFormData according to w3c-Standards
	 * 
	 * Datatype can be added via path
	 * Path:
	 * /ssc-api-write/xml/upload
	 * /ssc-api-write/img/upload
	 * /ssc-api-write/table/upload
	 * 
	 * Returns adjusted Response as json-String to work with Front-End-Uploader
	 */
	@POST
	@Path("{dataType}/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadFile(@PathParam ("dataType") String dataType,
			FormDataMultiPart form) {
		// boolean Operator to track if something goes wrong on uploading and saving process
		errorOnUpload = false;
		
		// Returns response according to succes and failure, has to have success key-value-pair
		// to get FineUploader in Front-End working
		String errorMessage = "{\"success\": false, \"error\": \"Something went wrong\"}";
		String successMessage = "{\"success\": true}";
		
		
		try{
			// Get the filename of the uploaded data by attribute of FineUploader
			String filename = form.getField("qqfilename").getValue();
			// Get the content (uploaded File) by attribute of FineUploader
			FormDataBodyPart filePart = form.getField("qqfile");
			
			// Get the path of the serverenvironment
			String realPath = context.getRealPath("/");
			
			// Save the data according to type in a folder in the Front-End
			switch(dataType){
				case "xml":
					saveXml(filename, filePart, realPath);
					break;
				case "img":
					saveImg(filename, filePart, realPath);
					break;
				case "table":
					saveTable(filename, filePart, realPath);
					break;
				case "default":
					
					break;
			}
		}catch(Exception e){
			e.printStackTrace();
			errorOnUpload = true;
		}
		if(!(errorOnUpload)){
			return successMessage;
		}else{
			return errorMessage;
		}
		
	}
	/*
	 * Method to save xml-File in Front-End and transform it
	 * to SolrDocument, as well as import it to solr-core
	 * Uses DocumentImporter of solr_interaction-Package
	 * 
	 * XMl gets saved to FrontEnd-Path: /FrontEnd/assets/xml
	 */
	private void saveXml(String filename, FormDataBodyPart filepart, String realPath) throws ParserConfigurationException, SAXException, IOException, SolrServerException{
		// First try relative path according to Windows-Path-Notation
		try{
		String relativePath = "FrontEnd\\assets\\xml\\";
		
		// If this doesn't work use MAC OS Path-Notation
		if(!(new File(realPath + relativePath).exists())){
			relativePath = "FrontEnd/assets/xml/";
		}
		
		// Build path to save file to
		String xmlPath = realPath + relativePath + filename;
		
		InputStream fileInputStream = filepart.getValueAs(InputStream.class);
		
		// Save the file to path
		saveFile(fileInputStream, xmlPath);
		
		// Import the xml-File (saved in the specific Path) to solr (searchableDocs)
		DocumentImporter solrInteraction = new DocumentImporter();
		solrInteraction.importSingleDocToSolr(xmlPath);
		}catch(Exception e){
			e.printStackTrace();
			errorOnUpload = true;
		}
		
	}
	/*
	 * Method to save jpg-File in Front-End
	 * Uses JpegTransformer of transformation-Package to create thumbnails
	 * 
	 * jpg gets saved to FrontEnd-Path: /FrontEnd/img/jpegs
	 */
	private void saveImg(String filename, FormDataBodyPart filepart, String realPath){
		try{
			// First try relative path according to Windows-Path-Notation
			String relativePath = "FrontEnd\\img\\jpegs\\";
			
			// If this doesn't work use MAC OS Path-Notation
			if(!(new File(realPath + relativePath).exists())){
				relativePath = "FrontEnd/img/jpegs/";
			}
			
			// Build path to save file to
			String imgPath = realPath + relativePath + filename;
			
			
			InputStream fileInputStream = filepart.getValueAs(InputStream.class);
			
			// Save normal image to Front-End
			saveFile(fileInputStream, imgPath);
			
			// Create thumbnail and save it to Front-End
			JpegTransformer jt = new JpegTransformer();
			jt.createThumbnails(imgPath);
		
		}catch(Exception e){
			e.printStackTrace();
			errorOnUpload = true;
		}
	}
	
	/*
	 * Method to save xls-File in Front-End and transform it
	 * to SolrDocument, as well as import the metadates to solr-core
	 * Uses MetadatesImporter of solr_interaction-Package
	 * 
	 * xls gets saved to FrontEnd-Path: /FrontEnd/assets/tables
	 */
	private void saveTable(String filename, FormDataBodyPart filepart, String realPath) throws BiffException, NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException, IOException, SolrServerException{
		try{
			// First try relative path according to Windows-Path-Notation
			String relativePath = "FrontEnd\\assets\\tables\\";
			
			// If this doesn't work use MAC OS Path-Notation
			if(!(new File(realPath + relativePath).exists())){
				relativePath = "FrontEnd/assets/tables/";
			}
			
			// Build path to save file to
			String tablePath = realPath + relativePath + filename;
			
			InputStream fileInputStream = filepart.getValueAs(InputStream.class);
			
			//Save xls-File in Front-End
			saveFile(fileInputStream, tablePath);
			// Import metadates of xls-File into solr (metaDates-core)
			MetadatesImporter mdi = new MetadatesImporter();
			mdi.importSingleMetadataTableToSolr(tablePath);
		}catch(Exception e){
			e.printStackTrace();
			errorOnUpload = true;
		}
	}

	// save uploaded file to a defined location on the server
		private void saveFile(InputStream uploadedInputStream,
				String serverLocation) {

			try {
				OutputStream outpuStream = new FileOutputStream(new File(serverLocation));
				int read = 0;
				byte[] bytes = new byte[1024];

				outpuStream = new FileOutputStream(new File(serverLocation));
				while ((read = uploadedInputStream.read(bytes)) != -1) {
					outpuStream.write(bytes, 0, read);
				}
				outpuStream.flush();
				outpuStream.close();
			} catch (Exception e) {
				errorOnUpload = true;
				e.printStackTrace();
				
			}

		}
	/*
	 * REST-Resource to update a Document via POST-Request
	 * Expects the core as PathParam e.g. searchableDocs, metaData, users
	 * Path (for example):
	 * /ssc-api-write/searchableDocs/updateDocument
	 * 
	 * Expects a json-String of key-value-pairs as data-attribute of the POST-Request
	 * consisting of the fields to upadate and the new values
	 * for example: { "id": "f685091f-f097-4d64-b9cd-e2ce83ebbdce", "text": "new text"}
	 * 
	 * Uses SolrDocumentManipulation to update the document
	 * 
	 * Returns the Solr Response as JSON
	 */
	@POST
	  @Produces(MediaType.APPLICATION_JSON)
	  @Path("{core}/updateDocument")
	  public String updateDocument(@PathParam ("core") String core, String message) throws SolrServerException, IOException{
		
		SolrDocumentManipulation sdm = new SolrDocumentManipulation(core);
		  
		  JsonParser parser = new JsonParser();
		  JsonObject document = parser.parse(message).getAsJsonObject();
		  
		  UpdateResponse response = sdm.updateDocument(document);
		  
		  Gson gson = new Gson();
		  
		  return gson.toJson(response);
	  }
	
	/*
	 * REST-Resource to remove a Document via POST-Request
	 * 
	 * Expects ID in data-attribute of POST-Request
	 * it is only possible to delete documents in searchable-docs core
	 * Everything that belongs to that document gets also deleted in the Front-End (XML-File, JPG-File)
	 * 
	 * Uses SolrDocumentManipulation-Object
	 * Path:
	 * /ssc-api-write/removeDocument
	 * 
	 * Returns the Solr Response as JSON
	 */
	
	@POST
	  @Produces(MediaType.APPLICATION_JSON)
	  @Path("/removeDocument")
	public String removeDocumentById(String id) throws SolrServerException, IOException{
		
		// Get document by id to get filename of XML-File and imagename
		SolrSearcher searcher = new SolrSearcher("searchableDocs");
		SolrDocument docToDelete = searcher.getDocumentById(id);
				
		String xmlFilename = docToDelete.getFieldValue("filename").toString();
		String jpgFilename = docToDelete.getFieldValue("imagename").toString();
		
		// Delete XML-File und JPG-File
		removeMediaContentByFilename(xmlFilename, jpgFilename);
		
		SolrDocumentManipulation sdm = new SolrDocumentManipulation("searchableDocs");
		UpdateResponse response = sdm.deleteById(id);
		
		// Prettyprint Solr Response and transform it to JSOn
		Gson gson = new Gson();
		return gson.toJson(response);
	}
	
	/*
	 * Method to delete the JPG-File and the XML-File in Front-End
	 */
	private void removeMediaContentByFilename(String filename, String imagename) throws IOException{
		// Get path of server environment via Context-Object
		String realPath = context.getRealPath("/");
		
		removeXmlFile(realPath, filename);
		removeJpgFile(realPath, imagename);
	}
	
	/*
	 * Removes xml-File according to path and filename, process is irreversible
	 */
	private void removeXmlFile(String realPath, String filename) throws IOException{
		
		// First try relative path according to Windows-Path-Notation
		String relativePath = "FrontEnd\\assets\\xml\\";
		
		// If this doesn't work use MAC OS Path-Notation
		if(!(new File(realPath + relativePath).exists())){
			relativePath = "FrontEnd/assets/xml/";
		}
			
		String xmlPath = realPath + relativePath + filename;
		File xmlFile = new File(xmlPath);
		Files.deleteIfExists(xmlFile.toPath());
	}
	
	/*
	 * Removes jpg-File according to path and filename, process is irreversible
	 * Also removes corresponding thumbnail
	 */
	private void removeJpgFile(String realPath, String imagename) throws IOException{
		String relativePath = "FrontEnd\\img\\jpegs\\";
		
		if(!(new File(realPath + relativePath).exists())){
			relativePath = "FrontEnd/img/jpegs/";
		}
		String imgPath = realPath + relativePath + imagename;
		File jpgFile = new File(imgPath);
		Files.deleteIfExists(jpgFile.toPath());
		
		String thumbnailPath = realPath + relativePath + "thumbnail." + imagename;
		File thumbnailFile = new File(thumbnailPath);
		Files.deleteIfExists(thumbnailFile.toPath());
	}
	
	}
