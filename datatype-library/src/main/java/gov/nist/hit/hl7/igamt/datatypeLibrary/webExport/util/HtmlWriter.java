//package gov.nist.hit.hl7.igamt.datatypeLibrary.webExport.util;
//
//
//import static j2html.TagCreator.a;
//import static j2html.TagCreator.attrs;
//import static j2html.TagCreator.body;
//import static j2html.TagCreator.div;
//import static j2html.TagCreator.each;
//import static j2html.TagCreator.h4;
//import static j2html.TagCreator.head;
//import static j2html.TagCreator.html;
//import static j2html.TagCreator.link;
//import static j2html.TagCreator.nav;
//import static j2html.TagCreator.span;
//import static j2html.TagCreator.strong;
//import static j2html.TagCreator.table;
//import static j2html.TagCreator.tbody;
//import static j2html.TagCreator.td;
//import static j2html.TagCreator.th;
//import static j2html.TagCreator.thead;
//import static j2html.TagCreator.tr;
//import static j2html.TagCreator.br;
//import static j2html.TagCreator.h2;
//
//
//import java.io.BufferedReader;
//import java.io.BufferedWriter;
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.FileReader;
//import java.io.IOException;
//import java.io.OutputStreamWriter;
//import java.io.Writer;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import j2html.tags.ContainerTag;
//
//
//public class HtmlWriter {
//
//	public void generateHtmlVersionsThenName(WebExportObject webExportObject) throws IOException {
//		Map<String,Map<String,List<Datatype>>> datatypesbyVersionThenName = webExportObject.getDatatypesbyVersionThenName();
//		
//		for( String version : datatypesbyVersionThenName.keySet()){
//
//	    String tableDatatypesByVersion = span(h2("Table of Datatypes and their flavors for version_" + version),
//	    		
//	    				
//	    				table( attrs(".greyGridTable1"),
//	    			
//	    						thead(
//	    								tr(
//	    										th("Datatype"), th("Flavors")
//	    										)
//	    								),
//	    						tbody(
//	    								each(datatypesbyVersionThenName.get(version).keySet(), name ->	    								
//	    								tr(
//		        	    						td(a(name).withHref("Datatype_"+name+".html")).attr("bgcolor","#ffcccc"),  td(span(each(datatypesbyVersionThenName.get(version).get(name), datatype -> span(a(datatype.getName() + datatype.getExt()).withHref("Datatype_"+datatype.getName() + datatype.getExt()+".html"), span(", "))),a("See all at once").withHref("AllDatatypesVersion_"+version+"ForRoot_"+name+".html")))
//		        	    				))
//	    								))).render();
////	    System.out.println(tableDatatypesByVersion);
//	    
//	    PageCreator pg = new PageCreator();
//	    String resultPage = pg.createPage("/Users/ynb4/ExportV2/ForJava/StructureForTables.html", "<TagToReplace></TagToReplace>", tableDatatypesByVersion);
//	    
//	    
//	    try (Writer writer = new BufferedWriter(new OutputStreamWriter(
//	              new FileOutputStream("/Users/ynb4/ExportV2/Pages/DatatypesForVersion_"+version+".html"), "utf-8"))) {
//	   writer.write(resultPage);
//	}
//	    		
//
//	}
//	}
//	
//	public void generateHtmlNameThenVersion(WebExportObject webExportObject) throws IOException {
//		Map<String,Map<Set<String>,List<Datatype>>> datatypesbyNameThenVersion = webExportObject.getDatatypesbyNameThenVersion();
////		System.out.println("REGARDE ICI : " +datatypesbyNameThenVersion.keySet().toString());
//		for( String name : datatypesbyNameThenVersion.keySet()){
//			
//			String tableDatatypesByNameThenVersion =
//					
//					table( attrs(".greyGridTable2"),
//						thead(
//								tr(
//										th("Datatype"),th("Compatibility Versions And Flavors")
//										
//								),
//						
//						tbody(
//								tr(
//										td(
//												a(name).withHref("Datatype_"+name+".html")
//												).attr("bgcolor","#eee"),
//										td(
//										table( attrs(".greyGridTable"),
//												tbody(
//													each(datatypesbyNameThenVersion.get(name).keySet(), versionSet ->
//														tr(
//																td(
//																		each(versionSet, version -> span(a(version).withHref("DatatypesForVersion_"+version+".html"),br()))
//																		).attr("bgcolor","#ffcccc"),
//																td(span(each(datatypesbyNameThenVersion.get(name).get(versionSet), datatype ->
//																span(a(datatype.getName()+datatype.getExt()).withHref("Datatype_"+datatype.getName()+datatype.getExt()+".html"),br())),a("See all at once").withHref("AllDatatypesForRoot_"+name+"Version_"+versionSet+".html"))
//																		))
//															)	
//														)
//												)))
//										))
//						
//							).render();
////			System.out.println("XMLL: " +tableDatatypesByNameThenVersion);
//					
//
//
//	    
//	    PageCreator pg = new PageCreator();
//	    String resultPage = pg.createPage("/Users/ynb4/ExportV2/ForJava/StructureForTables.html", "<TagToReplace></TagToReplace>", tableDatatypesByNameThenVersion);
//	    
//	    
//	    try (Writer writer = new BufferedWriter(new OutputStreamWriter(
//	              new FileOutputStream("/Users/ynb4/ExportV2/Pages/Datatype_"+name+".html"), "utf-8"))) {
//	   writer.write(resultPage);
//	}
//	    		
//	    		
//
//	}
//	}
//	
//	public String generateVersionInIndex(WebExportObject webExportObject) {
//		List<String> versionList = webExportObject.getAllDomainCompatibilityVersions();
//		
//		String versionInIndex = span(each(versionList, version -> span(a(version).withHref("Pages/DatatypesForVersion_"+version+".html"),span(","),br()))).render();
////		System.out.println(versionInIndex);
//		return versionInIndex;
//	}
//	
//
//}