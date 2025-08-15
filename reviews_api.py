from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import shutil
import json

app = FastAPI()

# CORS (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REVIEWS_FILE = "reviews.json"
MEDIA_DIR = "review_uploads"
os.makedirs(MEDIA_DIR, exist_ok=True)

@app.post("/api/reviews")
async def submit_review(
    name: str = Form(...),
    review: str = Form(...),
    content: Optional[str] = Form(None),
    rating: int = Form(...),
    photo: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
):
    # Save uploaded files
    photo_url = None
    video_url = None
    if photo:
        photo_path = os.path.join(MEDIA_DIR, photo.filename)
        with open(photo_path, "wb") as f:
            shutil.copyfileobj(photo.file, f)
        photo_url = f"/{MEDIA_DIR}/{photo.filename}"
    if video:
        video_path = os.path.join(MEDIA_DIR, video.filename)
        with open(video_path, "wb") as f:
            shutil.copyfileobj(video.file, f)
        video_url = f"/{MEDIA_DIR}/{video.filename}"
    # Save review to file
    review_entry = {
        "name": name,
        "review": review,
        "content": content,
        "rating": rating,
        "photo_url": photo_url,
        "video_url": video_url
    }
    if os.path.exists(REVIEWS_FILE):
        with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
            reviews = json.load(f)
    else:
        reviews = []
    reviews.append(review_entry)
    with open(REVIEWS_FILE, "w", encoding="utf-8") as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)
    return JSONResponse({"success": True, "review": review_entry})

@app.get("/api/reviews")
def get_reviews():
    if os.path.exists(REVIEWS_FILE):
        with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
            reviews = json.load(f)
    else:
        reviews = []
    return reviews
