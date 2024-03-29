package com.legacy.health.fhir.helper;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ParameterStringHelper {
	public static String getParamsString(Map<String, String> params)
			throws UnsupportedEncodingException {
		StringBuilder result = new StringBuilder();

		for (Map.Entry<String, String> entry : params.entrySet()) {
			result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
			result.append("=");
			result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
			result.append("&");
		}

		String resultString = result.toString();
		return resultString.length() > 0
				? resultString.substring(0, resultString.length() - 1)
				: resultString;
	}

	public static Map<String, String[]> splitQuery2Array(String query) throws UnsupportedEncodingException {

		Map<String, List<String>> in = splitQuery(query);
		Map<String, String[]> ret = new HashMap<String, String[]>();
		Set<String> keys = in.keySet();
		for (String key : keys) {
			List<String> list = in.get(key);
			String[] arr = list.toArray(new String[list.size()]);
			ret.put(key, arr);
		}
		return ret;
	}

	public static Map<String, List<String>> splitQuery(String query) throws UnsupportedEncodingException {
		final Map<String, List<String>> query_pairs = new LinkedHashMap<String, List<String>>();
		final String[] pairs = query.split("&");
		for (String pair : pairs) {
			final int idx = pair.indexOf("=");
			final String key = idx > 0 ? URLDecoder.decode(pair.substring(0, idx), "UTF-8") : pair;
			if (!query_pairs.containsKey(key)) {
				query_pairs.put(key, new LinkedList<String>());
			}
			final String value = idx > 0 && pair.length() > idx + 1
					? URLDecoder.decode(pair.substring(idx + 1), "UTF-8")
					: null;
			query_pairs.get(key).add(value);
		}
		return query_pairs;
	}
}
