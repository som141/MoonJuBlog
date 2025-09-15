package blog.moonju.moonjublogapi.dto;

public class CommonDtos {
    public record SimpleSuccess(String code, String message) {
        public static SimpleSuccess ok(){ return new SimpleSuccess("su","success"); }
    }
    public record ErrorResponse(String code, String message) {
        public static ErrorResponse signInFailed(){ return new ErrorResponse("sf","sign in failed."); }
        public static ErrorResponse dbError(){ return new ErrorResponse("de","database error."); }
        public static ErrorResponse badRequest(){ return new ErrorResponse("EE","bad request."); }
        public static ErrorResponse emailDuplicated(){ return new ErrorResponse("EE","email duplicated."); }
        public static ErrorResponse notFound(){ return new ErrorResponse("EE","not found."); }
    }
}
