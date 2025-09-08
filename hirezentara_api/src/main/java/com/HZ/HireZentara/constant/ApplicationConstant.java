package com.HZ.HireZentara.constant;

public class ApplicationConstant {

    //status

    public static final String SUCCESS = "Success";
    public static final String FAILURE = "Failure";
    public static final String ERROR = "Error";
    public static final String PENDING = "Pending";
    public static final String IN_PROGRESS = "In Progress";
    public static final String COMPLETED = "Completed";
    public static final String ACTIVE = "Active";
    public static final String INACTIVE = "Inactive";
    public static final String APPROVED = "Approved";
    public static final String REJECTED = "Rejected";
    public static final String CANCELLED = "Cancelled";
    public static final String FAILED = "Failed";
    public static final String INVALID_REQUEST = "Invalid Request";

    //status code
    public static final int SUCCESS_200 = 200;
    public static final int CREATED_201 = 201;
    public static final int NO_CONTENT_204 = 204;
    public static final int BAD_REQUEST_400 = 400;
    public static final int UNAUTHORIZED_401 = 401;
    public static final int FORBIDDEN_403 = 403;
    public static final int NOT_FOUND_404 = 404;
    public static final int CONFLICT_409 = 409;
    public static final int INTERNAL_SERVER_ERROR_500 = 500;
    public static final int SERVICE_UNAVAILABLE_503 = 503;
    public static final int FAILURE_400 = 400;

    //Messages
    public static final String AUTHORIZATION="Authorization";
    public static final String ADMIN = "ADMIN";
    public static final String BASIC = "Basic ";
    public static final String INVALID_CLIENT_ID_ERROR_MESSAGE = "Invalid Client ID";
    public static final String NO_AUTH_MESSAGE = "No Authorization header provided";
    public static final String PAGE_TOKEN = "Page-Token";
    public static final String SESSION_ID = "Session-Id";
    public static final String INPUT_OBJECT_CAN_NOT_BE_NULL = "Input object can not be null";
    public static final String EMPTY_STRING = "";
    public static final String CANDIDATE_PORTAL = "CANDIDATE";
    public static final String CANDIDATE = "CANDIDATE";
    public static final String AUTH_FAILED = "Authentication failed. Invalid username or password.";
    public static final String LOG_IN_SUCCESS = "Login successful.";
    public static final String LOGOUT_SUCCESS_MSG = "Logout successfully.";
    public static final String LOGOUT_FAILED_MSG = "Logout failed. Invalid session.";
    public static final String USERS_NOT_FOUND_MESSAGE = "Users not found.";

    //error codes
    public static final int HZ_196 = 196;
    public static final int HZ_195 = 195;
    public static final int HZ_193 = 193;
    public static final int HZ_192 = 192;
    public static final int HZ_1011 = 1011;
    public static final int HZ_1012 = 1012;
    public static final int HZ_1013 = 1013;
    public static final int HZ_1014 = 1014;
    public static final int HZ_1015 = 1015;
    public static final int HZ_1016 = 1016;
    public static final int HZ_1017 = 1017;
    public static final int HZ_1018 = 1018;
    public static final int HZ_1019 = 1019;
    public static final int HZ_1020 = 1020;
    public static final int HZ_1021 = 1021;



    //regular expression
    public static final String REGEXP ="^[0-9]{10}$";
    public  static final String ADMIN_PWD_REG_EXP = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()+=_{}|:;<>,.?\\/~\\[\\]\\-]).{8,64}$";
    public static final String ALPHA_NUMERIC_REQ_EXP = "^(?![0-9\\s]+$)[\\p{L}0-9\\s]+$";
    public static final int CAPTCHA_WIDTH = 200;
    public static final int CAPTCHA_HEIGHT = 50;
    public static final int CAPTCHA_CHAR_LENGTH = 6;
    public static final char[] DEFAULT_CHARS = new char[] {  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','a', 'b', 'c', 'd',
            'e', 'f', 'g', 'h', 'k', 'i','j','k','l','m', 'n', 'o','p','q', 'r', 's','t','u','v','w', 'x', 'y','z',
            '0','1','2', '3', '4', '5', '6', '7', '8','9' };
    public static final String FORMAT_TYPE = "png";

}
