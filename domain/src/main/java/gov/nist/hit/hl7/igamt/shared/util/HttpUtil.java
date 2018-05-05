package gov.nist.hit.hl7.igamt.shared.util;


import javax.servlet.http.HttpServletRequest;

public class HttpUtil {

	public static String getAppUrl(HttpServletRequest request) {
		String scheme = request.getScheme();
		String host = request.getHeader("Host");
		String url = scheme + "://" + host + request.getContextPath();
		return url;
	}

	public static String getImagesRootUrl(HttpServletRequest request) {
		return HttpUtil.getAppUrl(request) + FileStorageUtil.root;
	}
}
