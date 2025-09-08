package com.HZ.HireZentara.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ApplicationDateTimeUtil {
	private final String dateFormat = "dd-MM-yy";
	private final String ddMMYYYYdateFormat = "ddMMyyyy";

	private final String dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss";
	private final String IST_TIME_ZONE = "IST";

	public String getFormattedDate(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
		sdf.setTimeZone(TimeZone.getTimeZone(IST_TIME_ZONE));
		return sdf.format(date);
	}

	public String getCBSFormattedDate(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat(ddMMYYYYdateFormat);
		sdf.setTimeZone(TimeZone.getTimeZone(IST_TIME_ZONE));
		return sdf.format(date);
	}

	public String addDays(Date date, int numberOfDays) {
		log.info("date " + date);
		log.info("numberOfDays " + numberOfDays);
		SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
		sdf.setTimeZone(TimeZone.getTimeZone(IST_TIME_ZONE));
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
		c.add(Calendar.DATE, numberOfDays);
		String output = sdf.format(c.getTime());
		return output;
	}

	public String getTimeStamp() {
		SimpleDateFormat sdf = new SimpleDateFormat(dateTimeFormat);
		sdf.setTimeZone(TimeZone.getTimeZone(IST_TIME_ZONE));
		return sdf.format(new Date());
	}

	public Date addMinutestoDate(int minutes) {
		Calendar calendar = Calendar.getInstance();
		TimeZone timeZone = TimeZone.getTimeZone(IST_TIME_ZONE);
		calendar.setTimeZone(timeZone);
		calendar.add(Calendar.MINUTE, minutes);
		return calendar.getTime();
	}

	public long convertToTimeStamp(Date date, int daysToAdd) {
		LocalDateTime originalDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
		LocalDateTime newDateTime = originalDateTime.plusDays(daysToAdd);
		ZonedDateTime zonedDateTime = ZonedDateTime.of(newDateTime, ZoneId.systemDefault());
		Instant instant = zonedDateTime.toInstant();
		return instant.toEpochMilli();
	}

	public Date minusDaysFromDate(Date currentDate, int daysToSubtract) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(currentDate);
		// Subtract days
		calendar.add(Calendar.DAY_OF_MONTH, -daysToSubtract);

		// Get the updated date
		return calendar.getTime();
	}

	public String formatDateToDbDate(Date dateToConvert) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yy");
		return sdf.format(dateToConvert);
	}
	
	public Date formatDate(Date dateToConvert) throws ParseException {
	    SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yy");
	    return sdf.parse(sdf.format(dateToConvert));
	}

	public long getUnixTimeStamp(){
		Instant now = Instant.now();
		Instant later = now.plus(Duration.ofMinutes(15));
		return later.getEpochSecond();
	}
}
