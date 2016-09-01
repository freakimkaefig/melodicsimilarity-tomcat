package transformation;
/*
 * Class as more usable storage for song-sheet-data
 * Stores the song-sheet-data of OCR-XML-Output on first Upload
 */
public class SongSheetDoc {
	
	
	private String filename;
	private String imagename;
	private String text;
	
	/*
	 * Fields for positional Information of Textboxes
	 * Was planned to be used, but isn't used, gets saved for future projects
	 * Every TextBox consists of vPosition, hPosition, the number of textlines (of the text-field)
	 * that correspond to the textbox, height, width
	 */
	private String[] vPositions;
	private String[] hPositions;
	private String[] boxLines;
	private String[] heights;
	private String[] widths;
	
	private int boxCount;
	
	public SongSheetDoc(){
		//Do nothing at all, document is build during runtime
		filename = null;
		imagename = null;
		text = null;
		setvPositions(null);
		sethPositions(null);
		boxLines = null;
		setHeights(null);
		setWidths(null);
		setBoxCount(0);
	}
	
	public SongSheetDoc(String filename, String imageame, String text, String[] vPositions, String[] hPositions,
			String[] boxLines, String[] heights, String[] widths){
		
		this.setFilename(filename);
		this.setImagename(imagename);
		this.setText(text);
		this.setvPositions(vPositions);
		this.sethPositions(hPositions);
		this.setBoxLines(boxLines);
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String[] getvPositions() {
		return vPositions;
	}

	public void setvPositions(String[] vPositions2) {
		this.vPositions = vPositions2;
	}

	public String[] gethPositions() {
		return hPositions;
	}

	public void sethPositions(String[] hPositions2) {
		this.hPositions = hPositions2;
	}

	public String[] getHeights() {
		return heights;
	}

	public void setHeights(String[] heights) {
		this.heights = heights;
	}

	public String[] getWidths() {
		return widths;
	}

	public void setWidths(String[] widths) {
		this.widths = widths;
	}

	public String[] getBoxLines() {
		return boxLines;
	}

	public void setBoxLines(String[] boxLines) {
		this.boxLines = boxLines;
	}

	public int getBoxCount() {
		return boxCount;
	}

	public void setBoxCount(int boxCount) {
		this.boxCount = boxCount;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getImagename() {
		return imagename;
	}

	public void setImagename(String imagename) {
		this.imagename = imagename;
	}
	

}
