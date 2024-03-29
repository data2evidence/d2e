package com.legacy.health.fhir.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.util.Arrays;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.List;

import java.time.DateTimeException;

public class Utils {

	public static TemporalAccessor parse(String inputString) {

		List<DateTimeFormatter> l = Arrays.asList(
				DateTimeFormatter.ISO_OFFSET_DATE_TIME,
				DateTimeFormatter.ISO_LOCAL_DATE_TIME,
				DateTimeFormatter.ISO_LOCAL_DATE,
				DateTimeFormatter.ofPattern("yyyy"),
				DateTimeFormatter.ofPattern("yyyy-MM"));
		for (DateTimeFormatter dateTimeFormatter : l) {
			TemporalAccessor ret = parse(dateTimeFormatter, inputString);
			if (ret != null) {
				return ret;
			}
		}
		return null;

	}

	protected static TemporalAccessor parse(DateTimeFormatter formatter, String txt) {
		try {
			return formatter.parse(txt);
		} catch (DateTimeParseException e) {
			return null;
		}
	}

	public static Instant convert2Target(String obj) {
		TemporalAccessor temporal = parse(obj);
		if (temporal == null) {
			return null;
		}
		if (temporal instanceof Instant) {
			return (Instant) temporal;
		}
		Objects.requireNonNull(temporal, "temporal");
		try {
			int year = getValue(temporal, ChronoField.YEAR, 2017);// TODO Current Year;
			int month = getValue(temporal, ChronoField.MONTH_OF_YEAR, 1);
			int day = getValue(temporal, ChronoField.DAY_OF_MONTH, 1);
			int hour = getValue(temporal, ChronoField.HOUR_OF_DAY, 0);
			int minute = getValue(temporal, ChronoField.MINUTE_OF_HOUR, 0);
			int seconds = getValue(temporal, ChronoField.SECOND_OF_MINUTE, 0);
			int millies = getValue(temporal, ChronoField.MILLI_OF_SECOND, 0);
			LocalDateTime ldt = LocalDateTime.of(year, month, day, hour, minute, seconds, millies);
			return ldt.toInstant(ZoneOffset.UTC);

		} catch (DateTimeException e) {
			// which means it may be a local date time or local date only string
			ZonedDateTime zdt;
			try {
				LocalDateTime ldt = LocalDateTime.from(temporal);
				zdt = ZonedDateTime.of(ldt, ZoneId.systemDefault());
			} catch (DateTimeException ex) {
				// a local date only string
				zdt = ZonedDateTime.of(LocalDate.from(temporal).atStartOfDay(), ZoneId.systemDefault());
			}

			return zdt.toInstant();
		}

	}

	public static int getValue(TemporalAccessor accessor, ChronoField field, int dValue) {
		if (accessor.isSupported(field)) {
			return accessor.get(field);
		}
		return dValue;
	}

	public static String getLastElementOfUri(String profile) {
		String[] segs = profile.split("/");
		return segs[segs.length - 1];
	}

	public static String firstToUpper(String in) {
		return Character.toUpperCase(in.charAt(0)) + in.substring(1);
	}

	public static boolean isUUID(String value) {
		String uuidPattern = "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}";
		return Pattern.matches(uuidPattern, "" + value);
	}

	public static String checkUUID(String value) {
		String uuidPattern = "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}";
		String prefix = "";
		if (Pattern.matches(uuidPattern, "" + value)) {// TODO
			prefix = "urn:uuid:";
		}

		return prefix + value;

	}
}
