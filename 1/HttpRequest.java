import java.io.*;
import java.util.HashMap;

public class HttpRequest {
  //request line
  public String method;
  public String uri;
  public String HTTP_version;
  public HashMap<String, String> params;

  //request header fields
  public HashMap<String, String> headers;

  public void addHeader(String headerLine) {
    String []A = headerLine.split(": ", 2);
    headers.put(A[0], A[1]);
  }

  HttpRequest (String requestLine) {
    headers = new HashMap<String, String>();
    params = new HashMap<String, String>();

    String []A = requestLine.split(" ");
    method = A[0];
    String temp = A[1]; // Needed for param parsing
    HTTP_version = A[2];

    A = temp.split("\\?", 2);
    uri = A[0];
    if (A.length > 1) {     // we have params to parse!
      A = A[1].split("&");
      String []param;
      for (String s : A) {
        param = s.split("=");
        params.put(param[0], param[1]);
      }
    }
  }
}
