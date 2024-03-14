import http.server
import socketserver
import os

# Define the port you want the server to listen on
PORT = 8000

# Define the directory containing your HTML and CSS files
# Replace 'path_to_your_folder' with the actual path to your folder
DIRECTORY = 'docs/standalone_dendrogram'

# Create a custom request handler by subclassing the BaseHTTPRequestHandler
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Get the file path from the URL
        file_path = self.path[1:]

        # Check if the requested file exists in the directory
        if os.path.exists(os.path.join(DIRECTORY, file_path)):
            # Serve the requested file
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # If the file doesn't exist, return a 404 error
        self.send_response(404)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'File not found')

# Change the current working directory to the specified directory
os.chdir(DIRECTORY)

# Create a socket server with the custom request handler
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print("Server started at port", PORT)
    # Start the server and keep it running until interrupted
    httpd.serve_forever()