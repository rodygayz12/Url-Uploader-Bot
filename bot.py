import requests
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

# Replace with your Telegram bot's access token
BOT_TOKEN = "5859491010:AAHdjkcotSxo2CglZ-c_jD5uk_uMOsvBgAo"


def start(update, context):
    """Greets the user when they start the bot"""
    update.message.reply_text("Hi! I can upload files from URLs. Send me a URL and I'll try my best to upload it.")


def upload_url(update, context):
    """Attempts to upload the provided URL as a file"""
    url = update.message.text

    # Check if a valid URL is provided
    if not url.startswith("http"):
        update.message.reply_text("Please provide a valid URL.")
        return

    try:
        # Download the file from the URL
        response = requests.get(url, allow_redirects=True)
        response.raise_for_status()  # Raise an exception for bad status codes

        # Get the filename from the URL (optional)
        filename = url.split("/")[-1]

        # Send the downloaded file as a document
        context.bot.send_document(chat_id=update.message.chat_id, document=response.content, filename=filename)
        update.message.reply_text("File uploaded successfully!")

    except requests.exceptions.RequestException as e:
        # Handle download errors
        update.message.reply_text(f"An error occurred: {e}")


def main():
    """Starts the Telegram bot"""
    updater = Updater(token=BOT_TOKEN, use_context=True)
    dispatcher = updater.dispatcher

    # Register handlers for commands and messages
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, upload_url))

    updater.start_polling()
    updater.idle()


if __name__ == "__main__":
    main()
