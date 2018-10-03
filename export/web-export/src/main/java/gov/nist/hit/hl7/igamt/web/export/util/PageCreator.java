package gov.nist.hit.hl7.igamt.web.export.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.Set;
import java.util.zip.ZipOutputStream;

import javax.xml.transform.TransformerException;

import org.apache.commons.io.FileUtils;

import com.google.common.io.Files;

import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatype;
import gov.nist.hit.hl7.igamt.export.domain.ExportParameters;
import gov.nist.hit.hl7.igamt.export.exception.ExportException;
import gov.nist.hit.hl7.igamt.export.util.HtmlUtil;
import gov.nist.hit.hl7.igamt.export.util.TransformationUtil;
import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;

public class PageCreator {

	private static String ALL_DATATYPES_IN_TABLE_INDEX = "/XSLT/AllDatatypesInTableIndex.xsl";
	private static String TRANSFORM_TO_TABLE = "/XSLT/TransformToTable.xsl";
	private static String TRANSFORM_TO_MULTIPLE_TABLE = "/XSLT/TransformToMultipleTable.xsl";

	File tempPages = Files.createTempDir();
	File tempXmlDatatypes = Files.createTempDir();

	HtmlWriter hw = new HtmlWriter();
	BasicXsl bx = new BasicXsl();



	ExportParameters exportParameters = new ExportParameters();

	public void generateIndex(MyExportObject myExportObject, ZipOutputStream zipStream) {

		try {

			File htmlFile = bx.transformUsingString(myExportObject.getAllDatatypesXml(), ALL_DATATYPES_IN_TABLE_INDEX);

			InputStream htmlInputStream = FileUtils.openInputStream(htmlFile);
			// HtmlUtil.cleanHtml(htmlInputStream);
			String htmlTableIndex = convertStreamToString(htmlInputStream);
			String indexWithVersionsDisplayed = createPage(Tools.getPathFileFromResources("ForJava/indexCopy.html"),
					"<ReplaceVersionLayer></ReplaceVersionLayer>", hw.generateVersionInIndex(myExportObject));
			String index = createPage(WritePage(tempPages.getAbsolutePath() + "/temp.html", indexWithVersionsDisplayed),
					"<ReplaceDatatypeLayer></ReplaceDatatypeLayer>", htmlTableIndex);
			// WritePage(webSiteFile.getAbsolutePath()+"/index.html", index);
//			FileUtils.writeStringToFile(new File("index.html"), index);
			ZipOutputStreamClass.addFileToZip(zipStream, "", "index.html", index);

		} catch (Exception exception) {
			exception.printStackTrace();
		}

	}

	public void generateLeafPageTable(MyExportObject myExportObject, ZipOutputStream zipStream)
			throws IOException, TransformerException {
		// Remove root datatype from both lists

		BasicXsl bx = new BasicXsl();
		for (Datatype datatype : myExportObject.getMapDatatypeToXML().keySet()) {
			if (!datatype.getExt().isEmpty()) {
				WritePage(tempXmlDatatypes.getAbsolutePath() + "/XmlDatatype_" + datatype.getName() + datatype.getExt()
				+ ".xml", myExportObject.getMapDatatypeToXML().get(datatype));

			}
		}



		for (Datatype datatype : myExportObject.getMapDatatypeToXML().keySet()) {
//			if (!datatype.getExt().isEmpty()) {

				File htmlFile;
				try {
					htmlFile = bx.transformUsingString(myExportObject.getMapDatatypeToXML().get(datatype),
							TRANSFORM_TO_TABLE);
					InputStream htmlInputStream = FileUtils.openInputStream(htmlFile);
					// HtmlUtil.cleanHtml(htmlInputStream);
					String datatypeTransformedToTable = convertStreamToString(htmlInputStream);
//					FileUtils.writeStringToFile(
//							new File("Datatype_" + datatype.getName() + datatype.getExt() + ".html"),
//							datatypeTransformedToTable);
					ZipOutputStreamClass.addFileToZip(zipStream, "Pages/",
							"LeafTableForDatatype_" + datatype.getName() + datatype.getId().getId()+".html", createPage(Tools.getPathFileFromResources("ForJava/StructureForTables.html"), "<TagToReplace></TagToReplace>", datatypeTransformedToTable));

				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (TransformerException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}

//		}

		for (String version : myExportObject.getDatatypesbyVersionThenName().keySet()) {
			for (String name : myExportObject.getDatatypesbyVersionThenName().get(version).keySet()) {
				String allLeafTableResult = "";

				for (int i = 0; i <= myExportObject.getDatatypesbyVersionThenName().get(version).get(name).size()
						- 1; i += 2) {
					String firstDatatype = "";

					File htmlFile1 = bx.transformUsingPath(tempXmlDatatypes.getAbsolutePath() + "/XmlDatatype_"
							+ myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getName()
							+ myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i).getExt()
							+ ".xml", TRANSFORM_TO_MULTIPLE_TABLE);
					InputStream htmlInputStream1 = FileUtils.openInputStream(htmlFile1);
					firstDatatype = convertStreamToString(htmlInputStream1);

					String secondDatatype = "";
					if (i + 1 < myExportObject.getDatatypesbyVersionThenName().get(version).get(name).size()) {

						File htmlFile2 = bx.transformUsingPath(tempXmlDatatypes.getAbsolutePath() + "/XmlDatatype_"
								+ myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i + 1)
								.getName()
								+ myExportObject.getDatatypesbyVersionThenName().get(version).get(name).get(i + 1)
								.getExt()
								+ ".xml", TRANSFORM_TO_MULTIPLE_TABLE);
						InputStream htmlInputStream2 = FileUtils.openInputStream(htmlFile2);
						secondDatatype = convertStreamToString(htmlInputStream2);
					}

					String oneDivContent = "<div class = \"column\">" + firstDatatype + secondDatatype + "</div>";
					allLeafTableResult = allLeafTableResult + oneDivContent;
				}

				String pageToWrite = createPage(Tools.getPathFileFromResources("ForJava/AllLeafTableForJava.html"),
						"<TagToReplaceForAllLeafTable></TagToReplaceForAllLeafTable>", allLeafTableResult);
//				FileUtils.writeStringToFile(new File("AllDatatypesVersion_" + version + "ForRoot_" + name + ".html"),
//						pageToWrite);
				ZipOutputStreamClass.addFileToZip(zipStream, "Pages/",
						"AllDatatypesVersion_" + version + "ForRoot_" + name + ".html", createPage(Tools.getPathFileFromResources("ForJava/StructureForTables.html"), "<TagToReplace></TagToReplace>", pageToWrite));

			}
		}

		for (String name : myExportObject.getDatatypesbyNameThenVersion().keySet()) {
			for (Set<String> versionSet : myExportObject.getDatatypesbyNameThenVersion().get(name).keySet()) {
				String allLeafTableResult = "";
				String secondDatatypeLeaf = "";
				String firstDatatypeLeaf = "";
				for (int i = 0; i <= myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).size() - 1; i += 2) {
					String firstDatatype = "";
					File htmlFile1 = bx.transformUsingPath(tempXmlDatatypes.getAbsolutePath() + "/XmlDatatype_"
							+ myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getName()
							+ myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).get(i).getExt()
							+ ".xml", TRANSFORM_TO_MULTIPLE_TABLE);
					InputStream htmlInputStream1 = FileUtils.openInputStream(htmlFile1);
					firstDatatype = convertStreamToString(htmlInputStream1);

					String secondDatatype = "";
					if (i + 1 < myExportObject.getDatatypesbyNameThenVersion().get(name).get(versionSet).size()) {
						File htmlFile2 = bx
								.transformUsingPath(
										tempXmlDatatypes.getAbsolutePath() + "/XmlDatatype_"
												+ myExportObject.getDatatypesbyNameThenVersion().get(name)
												.get(versionSet).get(i + 1).getName()
												+ myExportObject.getDatatypesbyNameThenVersion().get(name)
												.get(versionSet).get(i + 1).getExt()
												+ ".xml",
												TRANSFORM_TO_MULTIPLE_TABLE);
						InputStream htmlInputStream2 = FileUtils.openInputStream(htmlFile2);
						secondDatatype = convertStreamToString(htmlInputStream2);

					}

					String oneDivContent = "<div class = \"column\">" + firstDatatype + secondDatatype + "</div>";
					allLeafTableResult = allLeafTableResult + oneDivContent;

				}

				String pageToWrite = createPage(Tools.getPathFileFromResources("ForJava/AllLeafTableForJava.html"),
						"<TagToReplaceForAllLeafTable></TagToReplaceForAllLeafTable>", allLeafTableResult);
//				FileUtils.writeStringToFile(
//						new File("AllDatatypesForRoot_" + name + "Version_" + versionSet + ".html"), pageToWrite);
				ZipOutputStreamClass.addFileToZip(zipStream, "Pages/",
						"AllDatatypesForRoot_" + name + "Version_" + versionSet + ".html", createPage(Tools.getPathFileFromResources("ForJava/StructureForTables.html"), "<TagToReplace></TagToReplace>", pageToWrite));
			}
		}

	}

	public String createPage(String staticContentPath, String toBeReplaced, String toReplaceWith) {

		StringBuilder contentBuilder = new StringBuilder();
		try {
			BufferedReader in = new BufferedReader(new FileReader(staticContentPath));
			String str;
			while ((str = in.readLine()) != null) {
				contentBuilder.append(str);
			}
			in.close();
		} catch (IOException e) {
		}
		String content = contentBuilder.toString();

		String resultPage = content.replace(toBeReplaced, toReplaceWith);

		return resultPage;
	}

	public String readFromFileToString(String path) {

		StringBuilder contentBuilder = new StringBuilder();
		try {
			BufferedReader in = new BufferedReader(new FileReader(path));
			String str;
			while ((str = in.readLine()) != null) {
				contentBuilder.append(str);
			}
			in.close();
		} catch (IOException e) {
		}
		String content = contentBuilder.toString();

		return content;

	}

	public String WritePage(String path, String content) {

		try (Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path), "utf-8"))) {
			writer.write(content);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return path;
	}

	public String convertStreamToString(InputStream inputstream) {
		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();

		String line;
		try {

			br = new BufferedReader(new InputStreamReader(inputstream));
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return sb.toString();

	}

}
