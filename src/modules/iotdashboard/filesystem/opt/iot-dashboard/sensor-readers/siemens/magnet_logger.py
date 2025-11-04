import logging
from logging.handlers import RotatingFileHandler

class MagnetLogger:
    def __init__(self, log_file="magnet.log", max_bytes=5*1024*1024, backup_count=5):
        self.logger = logging.getLogger("MagnetLogger")
        self.logger.setLevel(logging.INFO)

        # Avoid adding multiple handlers if the logger is initialized multiple times
        if not self.logger.handlers:
            handler = RotatingFileHandler(
                log_file,
                maxBytes=max_bytes,
                backupCount=backup_count
            )
            formatter = logging.Formatter('%(asctime)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log(self, message):
        self.logger.info(message)
