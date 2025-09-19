package com.HZ.HireZentara.utils;

import com.HZ.HireZentara.dto.request.CandidateInterviewSchedulerRequest;
import org.springframework.stereotype.Component;

@Component
public class MeetEventCreation {

    // ---------- GOOGLE MEET ----------
    public String createGoogleMeetEvent(CandidateInterviewSchedulerRequest request)  {
//        Calendar service = getGoogleCalendarService();
//
//        // Convert Date to RFC3339 format
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
//        String startDateTime = sdf.format(request.getInterviewDate());
//        Calendar endCal = Calendar.getInstance();
//        endCal.setTime(request.getInterviewDate());
//        endCal.add(Calendar.MINUTE, 30); // default 30 min
//        String endDateTime = sdf.format(endCal.getTime());
//
//        Event event = new Event()
//                .setSummary("Interview with " + request.getInterviewName())
//                .setDescription("Candidate interview scheduled")
//                .setStart(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(startDateTime)).setTimeZone("Asia/Kolkata"))
//                .setEnd(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(endDateTime)).setTimeZone("Asia/Kolkata"));
//
//        ConferenceData conferenceData = new ConferenceData();
//        CreateConferenceRequest conferenceRequest = new CreateConferenceRequest()
//                .setRequestId(UUID.randomUUID().toString())
//                .setConferenceSolutionKey(new ConferenceSolutionKey().setType("hangoutsMeet"));
//        conferenceData.setCreateRequest(conferenceRequest);
//        event.setConferenceData(conferenceData);
//
//        event = service.events().insert("primary", event)
//                .setConferenceDataVersion(1)
//                .execute();
//
//        return event.getHangoutLink(); // Google Meet link
        return " Successfully created Google Meet meeting (stub link) ";
    }

    // ---------- MICROSOFT TEAMS ----------
    public String createMicrosoftTeamsEvent(CandidateInterviewSchedulerRequest request) {
//        GraphServiceClient<?> graphClient = getGraphClient();
//
//        Event event = new Event();
//        event.subject = "Interview with " + request.getInterviewName();
//
//        // Convert to Microsoft format
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
//        String startIso = sdf.format(request.getInterviewDate());
//        Calendar endCal = Calendar.getInstance();
//        endCal.setTime(request.getInterviewDate());
//        endCal.add(Calendar.MINUTE, 30); // default 30 min
//        String endIso = sdf.format(endCal.getTime());
//
//        DateTimeTimeZone start = new DateTimeTimeZone();
//        start.dateTime = startIso;
//        start.timeZone = "India Standard Time";
//
//        DateTimeTimeZone end = new DateTimeTimeZone();
//        end.dateTime = endIso;
//        end.timeZone = "India Standard Time";
//
//        event.start = start;
//        event.end = end;
//
//        // Enable Teams meeting
//        OnlineMeetingInfo meetingInfo = new OnlineMeetingInfo();
//        event.onlineMeeting = meetingInfo;
//
//        Event createdEvent = graphClient.me().events()
//                .buildRequest()
//                .post(event);
//
//        return createdEvent.onlineMeeting.joinUrl;
        return " Successfully created Microsoft Teams meeting (stub link) ";
    }

    // ---------- ZOOM ----------
    public String createZoomMeeting(CandidateInterviewSchedulerRequest request)  {
//        String oauthToken = getZoomOAuthToken(); // Replace with OAuth flow
//
//        OkHttpClient client = new OkHttpClient();
//
//        // Convert Date to ISO8601 UTC
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
//        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
//        String startIso = sdf.format(request.getInterviewDate());
//
//        JSONObject meetingDetails = new JSONObject();
//        meetingDetails.put("topic", "Interview with " + request.getInterviewName());
//        meetingDetails.put("type", 2); // scheduled
//        meetingDetails.put("start_time", startIso);
//        meetingDetails.put("timezone", "Asia/Kolkata");
//        meetingDetails.put("duration", 30);
//
//        RequestBody body = RequestBody.create(
//                meetingDetails.toString(),
//                MediaType.parse("application/json")
//        );
//
//        Request httpRequest = new Request.Builder()
//                .url("https://api.zoom.us/v2/users/me/meetings")
//                .addHeader("Authorization", "Bearer " + oauthToken)
//                .post(body)
//                .build();
//
//        Response response = client.newCall(httpRequest).execute();
//        JSONObject responseJson = new JSONObject(response.body().string());
//
//        return responseJson.getString("join_url");
        return   " Successfully created Zoom meeting (stub link) ";
    }

//    // ---------- STUB AUTH HELPERS ----------
//    private Calendar getGoogleCalendarService() {
//        // TODO: Implement OAuth2 authentication for Google Calendar API
//        return null;
//    }
//
//    private GraphServiceClient<?> getGraphClient() {
//        // TODO: Implement Microsoft Graph API authentication
//        return null;
//    }
//
//    private String getZoomOAuthToken() {
//        // TODO: Implement Zoom OAuth flow and return access token
//        return "<zoom-oauth-token>";
//    }
}
