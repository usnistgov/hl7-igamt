package gov.nist.hit.hl7.igamt.web.export;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSONExtractor {
	
	private List<String> ListIDs;

	public List<String>  extract() throws JSONException{
		
		
		JSONObject obj = new JSONObject(readAllBytesJava7("/Users/ynb4/Desktop/MasterDatatypeLibCleaned.json"));
		
		List<String> ListIDs = new ArrayList<String>();
		
		
		JSONArray arr = obj.getJSONArray("children");
		for (int i = 0; i < arr.length(); i++)
		{
		    String id = arr.getJSONObject(i).getString("_id");
		    ListIDs.add(id);
		}

		System.out.println(ListIDs.get(0));
		return ListIDs;
	}
	
	private static String readAllBytesJava7(String filePath)
	{
	    String content = "";
	    try
	    {
	        content = new String ( Files.readAllBytes( Paths.get(filePath) ) );
	    }
	    catch (IOException e)
	    {
	        e.printStackTrace();
	    }
	    return content;
	}
}
