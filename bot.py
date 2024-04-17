import logging
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from telegram.ext import Updater, CommandHandler, MessageHandler, filters, BotCommandError
from progress.bar import Bar

# Replace with your Telegram bot token
BOT_TOKEN = '7087733832:AAElTO6xQ3Lmc0MLlOKZkS8JVhe28SuzGBA'

# Function to handle incoming messages
def handle_message(update, context):
    chat_id = update.effective_chat.id

    if not update.message.text.startswith('http'):
        context.bot.send_message(chat_id, 'Please send a message containing a direct link.')
        return
    url = update.message.text

    try:
        # Download the file with progress bar
        response = context.bot.get_file(url)
        filename = url.split('/')[-1]

        download_bar = Bar('Downloading: ', max=int(response.file_size))
        with open(filename, 'wb') as f:
            for chunk in response.download(chunk_size=1024):
                if chunk:
                    f.write(chunk)
                    download_bar.update(len(chunk))
        download_bar.finish()

        # Upload the file with progress bar
        upload_bar = Bar('Uploading: ', max=int(response.file_size))
        with open(filename, 'rb') as f:
            context.bot.send_document(chat_id, f, filename=filename, progress_callback=lambda sent, total: upload_bar.update(sent))
        upload_bar.finish()

        context.bot.send_message(chat_id, 'File uploaded successfully!')

    except BotCommandError as e:
        if e.error_code == 409:
            logging.warning('Multiple bot instances detected. Restarting bot.')
            restart_bot(context.updater)
        else:
            logging.error(f'Error downloading or uploading file: {e}')
            context.bot.send_message(chat_id, 'Error downloading or uploading file.')

    finally:
        # Clean up downloaded file
        if os.path.exists(filename):
            os.remove(filename)


# Function to restart the bot (handles 409 Conflict)
def restart_bot(updater):
    updater.stop()
    updater.start_polling()


# Function to serve a basic HTTP request
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Bot is running!')


# Start HTTP server in a separate thread
def start_http_server():
    with HTTPServer(('', 8080), SimpleHTTPRequestHandler) as httpd:
        logging.info('HTTP server listening on port 8080')
        httpd.serve_forever()


# Configure logging
logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)

def main():
    # Start HTTP server in a separate thread
    http_server_thread = threading.Thread(target=start_http_server)
    http_server_thread.start()

    updater = Updater(token=BOT_TOKEN, use_context=True)
    dispatcher = updater.dispatcher

    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))

    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    main()
