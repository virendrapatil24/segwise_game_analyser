from sqlalchemy import (
    ARRAY,
    Boolean,
    Column,
    Date,
    Float,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from utils.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)


class GameData(Base):
    __tablename__ = "game_data"

    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, index=True, nullable=False)
    name = Column(String, nullable=False)
    release_date = Column(Date, nullable=True)
    required_age = Column(Integer, nullable=True)
    price = Column(Float, nullable=True)
    dlc_count = Column(Integer, nullable=True)
    about_the_game = Column(Text, nullable=True)
    supported_languages = Column(ARRAY(String), nullable=True)
    windows = Column(Boolean, nullable=True)
    mac = Column(Boolean, nullable=True)
    linux = Column(Boolean, nullable=True)
    positive = Column(Integer, nullable=True)
    negative = Column(Integer, nullable=True)
    score_rank = Column(Integer, nullable=True)
    developers = Column(String, nullable=True)
    publishers = Column(String, nullable=True)
    categories = Column(ARRAY(String), nullable=True)
    genres = Column(ARRAY(String), nullable=True)
    tags = Column(ARRAY(String), nullable=True)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
