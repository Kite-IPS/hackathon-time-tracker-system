
class Config:
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MYSQL_HOST = 'db'  # The service name from docker-compose.yml (db)
    MYSQL_USER = 'root'  # MySQL username
    MYSQL_PASSWORD = 'password'  # MySQL password
    MYSQL_DB = 'flaskdb'  # The database name
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False