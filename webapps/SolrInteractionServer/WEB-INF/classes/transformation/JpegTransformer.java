package transformation;

import java.io.File;
import java.io.IOException;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.name.Rename;
/*
 * Class to create a fitting thumbnail of a sonsheet-jpg
 * Uses Library thumbnailator, https://github.com/coobird/thumbnailator
 */
public class JpegTransformer {
	public JpegTransformer(){
		
	}
	
	/*
	 * Creates Thumbnails via imagepath
	 */
	public void createThumbnails(String imagepath) throws IOException{
		File imagefile = new File(imagepath);
		
		/*
		 * Thumbnail gets scaled to fit height=300px
		 * Thumbnail gets renamed with thumbnail. as prefix, e.g. thumbnail.imagename.jpg
		 */
		Thumbnails.of(imagefile)
	    .size(300, 300)
	    .outputFormat("jpg")
	    .toFiles(Rename.PREFIX_DOT_THUMBNAIL);
	}
}
