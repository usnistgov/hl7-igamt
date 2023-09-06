package gov.nist.hit.hl7.igamt.web.app.utility;
import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import gov.nist.hit.hl7.igamt.common.base.domain.TextSection ;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;

import org.plutext.jaxb.svg11.SVGTextContent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import gov.nist.hit.hl7.igamt.common.base.domain.*;

import org.apache.commons.compress.archivers.zip.UnsupportedZipFeatureException;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.compress.utils.IOUtils;

@RestController
public class ExportNarratives {
	@Autowired
	IgService igService;

	@RequestMapping(value = "/api/export-narrative/{id}", method = RequestMethod.GET)
	//	  @PreAuthorize("AccessResource('IGDOCUMENT', #documentId, READ)")
	public void generateFolderStructure(@PathVariable("id") String id, HttpServletResponse response) {

		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ZipOutputStream zos = new ZipOutputStream(baos);
		Ig ig = this.igService.findById(id);
		for (TextSection text: ig.getContent()) {
			generateFolderStructure(text, zos, "", ig.getMetadata().getTitle());	
		}

		try {
			zos.close(); 
		} catch (IOException e) {
			e.printStackTrace();
		}

		String zipFileName = ig.getMetadata().getTitle() + ".zip";
		response.setContentType("application/zip");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + zipFileName + "\"");

		try {
			baos.writeTo(response.getOutputStream());
			response.flushBuffer();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	private void generateFolderStructure(TextSection treeStructure, ZipOutputStream zos, String currentPath, String tempFolderName) {
		String node = treeStructure.getLabel();
		Set<TextSection> children = treeStructure.getChildren();
		List<TextSection> sortedNumberList = new ArrayList<TextSection>(children);

		Collections.sort(sortedNumberList, Comparator.comparingInt(TextSection::getPosition));

		try {
			String fullPath = currentPath + "/" + treeStructure.getPosition()+'.'+ node ;
			if(treeStructure.getType().equals(Type.TEXT) || treeStructure.getType().equals(Type.PROFILE)) {
				zos.putNextEntry(new ZipEntry(tempFolderName + "/" + fullPath + ".html"));
				zos.write(treeStructure.getDescription().getBytes());
				if (children != null && !children.isEmpty()) {
					zos.putNextEntry(new ZipEntry(tempFolderName + "/" + fullPath + "/"));

					for (TextSection child : children) {
						generateFolderStructure(child, zos, fullPath, tempFolderName);
					}
				} 
			} 
			zos.closeEntry();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}



	// Utility method to create a ZIP file from a folder.
	private void createZipFile(File folderToZip, String zipFilePath) {
		try (FileOutputStream fos = new FileOutputStream(zipFilePath);
				ZipOutputStream zos = new ZipOutputStream(fos)) {
			zipFolderContents(folderToZip, folderToZip.getName(), zos);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// Recursive method to zip folder contents.
	private void zipFolderContents(File folderToZip, String parentPath, ZipOutputStream zos) throws IOException {
		File[] files = folderToZip.listFiles();
		byte[] buffer = new byte[1024];
		int bytesRead;

		for (File file : files) {
			if (file.isDirectory()) {
				zipFolderContents(file, parentPath + "/" + file.getName(), zos);
			} else {
				FileInputStream fis = new FileInputStream(file);
				zos.putNextEntry(new ZipEntry(parentPath + "/" + file.getName()));

				while ((bytesRead = fis.read(buffer)) != -1) {
					zos.write(buffer, 0, bytesRead);
				}

				zos.closeEntry();
				fis.close();
			}
		}
	}


	@PostMapping("/api/upload-narrative-zip")
	public Set<SectionTemplate> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
		File uploadedFile = new File(file.getOriginalFilename());
		FileOutputStream fos = new FileOutputStream(uploadedFile);
		fos.write(file.getBytes());
		fos.close();
		//Ig ig = this.igService.findById(id);

		// Unzip the file
		File unzippedFolder = unzipFileWithDescriptors(uploadedFile);

		Set<SectionTemplate> sections = new HashSet<SectionTemplate>();
		processUploadedFolder(unzippedFolder.listFiles()[0],sections);


		return sections;
	}

	//	private File unzipFile(File zipFile) throws IOException {
	//		File unzippedFolder = new File(zipFile.getParentFile(), zipFile.getName().replace(".zip", ""));
	//		unzippedFolder.mkdirs();
	//
	//		try (ZipInputStream zipInputStream = new ZipInputStream(new FileInputStream(zipFile))) {
	//			byte[] buffer = new byte[1024];
	//			ZipEntry zipEntry = zipInputStream.getNextEntry();
	//			while (zipEntry != null) {
	//				File newFile = new File(unzippedFolder, zipEntry.getName());
	//				if (zipEntry.isDirectory()) {
	//					newFile.mkdirs();
	//				} else {
	//					new File(newFile.getParent()).mkdirs();
	//					try (FileOutputStream fos = new FileOutputStream(newFile)) {
	//						int len;
	//						while ((len = zipInputStream.read(buffer)) > 0) {
	//							fos.write(buffer, 0, len);
	//						}
	//					}
	//				}
	//				zipEntry = zipInputStream.getNextEntry();
	//			}
	//			zipInputStream.closeEntry();
	//		}
	//
	//		return unzippedFolder;
	//	}
	//	

	private File unzipFiled(File zipFile) throws IOException {
		File unzippedFolder = new File(zipFile.getParentFile(), zipFile.getName().replace(".zip", ""));
		unzippedFolder.mkdirs();
		try (ZipArchiveInputStream zipInputStream = new ZipArchiveInputStream(new FileInputStream(zipFile))) {
			ZipArchiveEntry zipEntry = zipInputStream.getNextZipEntry();
			while (zipEntry != null) {
				File newFile = new File(unzippedFolder, zipEntry.getName());
				if (zipEntry.isDirectory()) {
					newFile.mkdirs();
				} else {
					new File(newFile.getParent()).mkdirs();
					try (FileOutputStream fos = new FileOutputStream(newFile)) {
						int len;
						byte[] buffer = new byte[1024];
						while ((len = zipInputStream.read(buffer)) > 0) {
							fos.write(buffer, 0, len);
						}
					}
				}
				zipEntry = zipInputStream.getNextZipEntry();
			}
		}
		return unzippedFolder;

	}


	private File unzipFileWithDescriptors(File zipFile) throws IOException {
		File unzippedFolder = new File(zipFile.getParentFile(), zipFile.getName().replace(".zip", ""));
		unzippedFolder.mkdirs();


		try (ZipArchiveInputStream zipInputStream = new ZipArchiveInputStream(new FileInputStream(zipFile),"UTF-8", false, false)) {
			ZipArchiveEntry zipEntry;

			while ((zipEntry = zipInputStream.getNextZipEntry()) != null) {
				try {
					if (!zipEntry.isDirectory()) {
						File newFile = new File(unzippedFolder, zipEntry.getName());
						System.out.println("parsing ...."+ zipEntry.getName());
						new File(newFile.getParent()).mkdirs();

						try (FileOutputStream fos = new FileOutputStream(newFile)) {
							int len;
							byte[] buffer = new byte[1024];
							while ((len = zipInputStream.read(buffer)) > 0) {
								fos.write(buffer, 0, len);
							}
						}
					}
				}
				catch (UnsupportedZipFeatureException e) {
					System.err.println("Unsupported feature in entry: " + zipEntry.getName());
					// Log or handle the exception as needed
				}
			}
		}

		return unzippedFolder;
	}



	private void processUploadedFolder(File folder, Set<SectionTemplate> sections) {


		HashMap<String, SectionTemplate> map = new HashMap<String, SectionTemplate>();

		File[] files = folder.listFiles();


		if (files != null) {

			File[] dirs = Arrays.stream(files)
					.filter(File::isDirectory)
					.toArray(File[]::new);

			File[] filesOnly = Arrays.stream(files)
					.filter(File::isFile)
					.toArray(File[]::new);

			for(File file: filesOnly) {
				System.out.println(file.getName());
			}
			for(File file: dirs) {
				System.out.println(file.getName());
			}

			if(filesOnly != null) {

				for (File file : filesOnly) {

					//					if(!file.getName().startsWith(".")) {

					SectionTemplate section = processFile(file);
					sections.add(section);

					map.put(String.valueOf(section.getPosition()) + "." + section.getLabel(), section);

					//					}
				}
			}

			if(dirs != null) {

				for (File file : dirs) {
					if(map.containsKey(file.getName())){
						SectionTemplate existing = 	map.get(file.getName());
						existing.setChildren(new HashSet<SectionTemplate>());
						processUploadedFolder(file, existing.getChildren());
					}

				}
			}
		}
	}







	private SectionTemplate processFile(File file) {

		SectionTemplate section= createFromName(file.getName());
		section.setContent("");	

		try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
			String line;

			while ((line = reader.readLine()) != null) {

				section.setContent(section.getContent()+ line);

			}
		} catch (IOException e) {
			System.err.println("Error processing file: " + e.getMessage());
		}
		return section;

	}

	private SectionTemplate createFromName(String input){

		SectionTemplate ret = new SectionTemplate();
		int dotIndex = input.indexOf(".");

		if (dotIndex == -1) {
			throw new IllegalArgumentException("Invalid file name: "+ input );
		}

		try {
			int position = Integer.parseInt(input.substring(0, dotIndex));
			String restOfString = input.substring(dotIndex + 1);
			String name = removeSuffix(restOfString);

			//			ret.setType(Type.TEXT);
			ret.setLabel(name);
			ret.setPosition(position);

			return ret;
		} catch (NumberFormatException e) {
			throw new IllegalArgumentException("Invalid position format"+input );
		}

	}

	public static String removeSuffix(String name) {
		int suffixIndex = name.lastIndexOf(".");
		if (suffixIndex != -1) {
			return name.substring(0, suffixIndex);
		}
		return name;
	}





}
