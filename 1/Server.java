import java.net.Socket;
import java.net.ServerSocket;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class Server {

  private static String html_map(HashMap<String, String> map) {
    StringBuilder sb = new StringBuilder();
    for (Map.Entry<String, String> entry : map.entrySet()) {
      sb.append("<strong>");
      sb.append(entry.getKey()); 
      sb.append(":</strong> ");
      sb.append(entry.getValue()); 
      sb.append("<br>");
    }
    return sb.toString();
  }

  public static void main(String[] arguments) throws Exception {

    ServerSocket serverSocket = new ServerSocket(8080);
    Socket clientConnection = null;
    do {
      clientConnection = serverSocket.accept();
      
      InputStream in = clientConnection.getInputStream();
      BufferedReader reader = new BufferedReader(
                                new InputStreamReader(in, "utf-8"));
      String line = reader.readLine();
      HttpRequest request = new HttpRequest(line);
      if (request.method.equals("GET")) {
        line = reader.readLine();
        while (line != null && !line.equals("")) {
          request.addHeader(line);
          line = reader.readLine();
        }
        OutputStreamWriter out = 
          new OutputStreamWriter(clientConnection.getOutputStream());
        if (request.uri.equals("/name")) {
          out.write("<html><body><strong>What do you hope to get out of ");
          out.write("the class?</strong><br><br>"); 
          out.write("<div>The time I put into it, with interest.<br><br>");
          out.write("--Edward Misback</div></body></html>");
        } else if (request.uri.equals("/params")) {
          out.write("<html><body>");
          out.write(html_map(request.params)); 
          out.write("</body></html>");
        } else if (request.uri.equals("/headers")) {
          out.write("<html><body>");
          out.write(html_map(request.headers)); 
          out.write("</body></html>");
        }
        out.flush();
        out.close();
      }
    } while (clientConnection != null);
  }
}
