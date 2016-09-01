package transformation;
/*
 * Class as more usable storage for metadates
 */
public class Metadates {
	
	// All Metadates to potentially get from xls-File of Augias Export
	// Translated form names of xls-Files
	private String dateFindAid;
	private String receivedOn;
	private String signature;
	private String oldSignature;
	private String versionNumber;
	private String missingCause;
	private String origin;
	private String title;
	private String type;
	private String includes;
	private String incipit;
	private String numberOfPages;
	private String singPlace;
	private String remark;
	private String landscapeArchive;
	private String publication;
	private String sungOn;
	private String recordedOn;
	private String submittedOn;
	private String singer;
	private String reference;
	private String handwrittenSource;
	private String recorder;
	private String archive;
	
	public Metadates(){
		
	}
	
	//Metadates get set via Array, so order is important to set correct metadate
	public Metadates(String[] metadates){
		dateFindAid = metadates[0];
		receivedOn = metadates[1];
		signature = metadates[2];
		oldSignature = metadates[3];
		versionNumber = metadates[4];
		missingCause = metadates[5];
		origin = metadates[6];
		title = metadates[7];
		type = metadates[8];
		includes = metadates[9];
		incipit = metadates[10];
		numberOfPages = metadates[11];
		singPlace = metadates[12];
		remark = metadates[13];
		landscapeArchive = metadates[14];
		publication = metadates[15];
		sungOn = metadates[16];
		recordedOn = metadates[17];
		submittedOn = metadates[18];
		singer = metadates[19];
		reference = metadates[20];
		handwrittenSource = metadates[21];
		recorder = metadates[22];
		archive = metadates[23];
		
	}


	public String getDateFindAid() {
		return dateFindAid;
	}


	public void setDateFindAid(String dateFindAid) {
		this.dateFindAid = dateFindAid;
	}


	public String getReceivedOn() {
		return receivedOn;
	}


	public void setReceivedOn(String receivedOn) {
		this.receivedOn = receivedOn;
	}


	public String getSignature() {
		return signature;
	}


	public void setSignature(String signature) {
		this.signature = signature;
	}


	public String getOldSignature() {
		return oldSignature;
	}


	public void setOldSignature(String oldSignature) {
		this.oldSignature = oldSignature;
	}


	public String getVersionNumber() {
		return versionNumber;
	}


	public void setVersionNumber(String versionNumber) {
		this.versionNumber = versionNumber;
	}


	public String getMissingCause() {
		return missingCause;
	}


	public void setMissingCause(String missingCause) {
		this.missingCause = missingCause;
	}


	public String getOrigin() {
		return origin;
	}


	public void setOrigin(String origin) {
		this.origin = origin;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}


	public String getIncludes() {
		return includes;
	}


	public void setIncludes(String includes) {
		this.includes = includes;
	}


	public String getIncipit() {
		return incipit;
	}


	public void setIncipit(String incipit) {
		this.incipit = incipit;
	}


	public String getNumberOfPages() {
		return numberOfPages;
	}


	public void setNumberOfPages(String numberOfPages) {
		this.numberOfPages = numberOfPages;
	}


	public String getSingPlace() {
		return singPlace;
	}


	public void setSingPlace(String singPlace) {
		this.singPlace = singPlace;
	}


	public String getRemark() {
		return remark;
	}


	public void setRemark(String remark) {
		this.remark = remark;
	}


	public String getLandscapeArchive() {
		return landscapeArchive;
	}


	public void setLandscapeArchive(String landscapeArchive) {
		this.landscapeArchive = landscapeArchive;
	}


	public String getPublication() {
		return publication;
	}


	public void setPublication(String publication) {
		this.publication = publication;
	}


	public String getSungOn() {
		return sungOn;
	}


	public void setSungOn(String sungOn) {
		this.sungOn = sungOn;
	}


	public String getRecordedOn() {
		return recordedOn;
	}


	public void setRecordedOn(String recordedOn) {
		this.recordedOn = recordedOn;
	}


	public String getSubmittedOn() {
		return submittedOn;
	}


	public void setSubmittedOn(String submittedOn) {
		this.submittedOn = submittedOn;
	}


	public String getSinger() {
		return singer;
	}


	public void setSinger(String singer) {
		this.singer = singer;
	}


	public String getReference() {
		return reference;
	}


	public void setReference(String reference) {
		this.reference = reference;
	}


	public String getHandwrittenSource() {
		return handwrittenSource;
	}


	public void setHandwrittenSource(String handwrittenSource) {
		this.handwrittenSource = handwrittenSource;
	}


	public String getRecorder() {
		return recorder;
	}


	public void setRecorder(String recorder) {
		this.recorder = recorder;
	}


	public String getArchive() {
		return archive;
	}


	public void setArchive(String archive) {
		this.archive = archive;
	}

}
