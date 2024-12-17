import csv
from datetime import datetime
from typing import Optional

import requests
from dateutil import parser
from fastapi import APIRouter, Depends, HTTPException, Query
from models.db import GameData, SessionLocal
from sqlalchemy.orm import Session


def download_and_save_csv(file_url: str, db: Session):
    response = requests.get(file_url)
    response.raise_for_status()
    content = response.content.decode("utf-8").splitlines()
    reader = csv.DictReader(content)

    db.query(GameData).delete()
    for x_row in reader:
        row = {k.lower().replace(" ", "_"): v for k, v in x_row.items()}

        release_date_str = row.get("release_date", "")
        release_date = None

        if release_date_str:
            try:
                release_date = parser.parse(release_date_str, fuzzy=True).date()
            except ValueError:
                release_date = None

        if release_date is None:
            print(f"Skipping row with invalid date: {row}")

        game_data = GameData(
            app_id=int(row.get("appid")),
            name=row.get("name"),
            release_date=release_date,
            required_age=(
                int(row.get("required_age")) if row.get("required_age") else None
            ),
            price=float(row.get("price")) if row.get("price") else None,
            dlc_count=int(row.get("dlc_count")) if row.get("dlc_count") else None,
            about_the_game=row.get("about_the_game"),
            supported_languages=(
                row.get("supported_languages").split(",")
                if row.get("supported_languages")
                else []
            ),
            windows=(
                row.get("windows").lower() == "true" if row.get("windows") else None
            ),
            mac=row.get("mac").lower() == "true" if row.get("mac") else None,
            linux=row.get("linux").lower() == "true" if row.get("linux") else None,
            positive=int(row.get("positive")) if row.get("positive") else None,
            negative=int(row.get("negative")) if row.get("negative") else None,
            score_rank=int(row.get("score_rank")) if row.get("score_rank") else None,
            developers=row.get("developers"),
            publishers=row.get("publishers"),
            categories=(
                row.get("categories").split(",") if row.get("categories") else []
            ),
            genres=row.get("genres").split(",") if row.get("genres") else [],
            tags=row.get("tags").split(",") if row.get("tags") else [],
        )
        db.add(game_data)

    db.commit()
    db.close()


def query_data(
    db: Session,
    parameter: Optional[str] = None,
    value: Optional[str] = None,
    operator: Optional[str] = None,
):
    query = db.query(GameData)

    column = getattr(GameData, parameter, None)
    if column is None:
        raise HTTPException(status_code=400, detail=f"Invalid column name: {parameter}")

    try:
        if operator == "=":
            if isinstance(value, str):
                query = db.query(GameData).filter(column.ilike(f"%{value}%"))
            else:
                query = db.query(GameData).filter(column == value)
        elif operator == "<":
            query = db.query(GameData).filter(column < value)
        elif operator == ">":
            query = db.query(GameData).filter(column > value)
        elif operator == "<=":
            query = db.query(GameData).filter(column <= value)
        elif operator == ">=":
            query = db.query(GameData).filter(column >= value)
        else:
            raise HTTPException(status_code=400, detail="Unsupported operator.")

        results = query.all()
        return {"results": [row.__dict__ for row in results]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
