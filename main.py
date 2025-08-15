



from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import moviepy.editor as mp
import tempfile
import os
import shutil
import uuid
import json
from typing import Optional


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


STATIC_DIR = "static"
os.makedirs(STATIC_DIR, exist_ok=True)

# Review storage
REVIEWS_FILE = "reviews.json"
MEDIA_DIR = "review_uploads"
os.makedirs(MEDIA_DIR, exist_ok=True)

# --- Review Submission Endpoint ---
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
        "video_url": video_url,
        "status": "pending"  # moderation required
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

# --- Get Reviews Endpoint ---
@app.get("/api/reviews")
def get_reviews():
    # Only return approved reviews
    if os.path.exists(REVIEWS_FILE):
        with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
            reviews = json.load(f)
    else:
        reviews = []
    return [r for r in reviews if r.get("status") == "approved"]

# Admin endpoint to list all reviews (including pending)
@app.get("/api/reviews/all")
def get_all_reviews():
    if os.path.exists(REVIEWS_FILE):
        with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
            reviews = json.load(f)
    else:
        reviews = []
    return reviews

# Admin endpoint to approve a review by index
@app.post("/api/reviews/approve/{index}")
def approve_review(index: int):
    if not os.path.exists(REVIEWS_FILE):
        return JSONResponse({"error": "No reviews found"}, status_code=404)
    with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
        reviews = json.load(f)
    if index < 0 or index >= len(reviews):
        return JSONResponse({"error": "Invalid review index"}, status_code=400)
    reviews[index]["status"] = "approved"
    with open(REVIEWS_FILE, "w", encoding="utf-8") as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)
    return {"success": True, "review": reviews[index]}


@app.post("/api/slideshow")
async def create_slideshow(images: list[UploadFile] = File(...)):
    try:
        target_size = (1920, 1080)
        # Create a unique static subfolder for this slideshow
        slideshow_id = f"slideshow_{uuid.uuid4()}"
        slideshow_dir = os.path.join(STATIC_DIR, slideshow_id)
        os.makedirs(slideshow_dir, exist_ok=True)

        image_paths = []
        for idx, image in enumerate(images):
            image_data = await image.read()
            img = Image.open(io.BytesIO(image_data))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
            static_image_path = os.path.join(slideshow_dir, f"img_{idx}.jpg")
            img_resized.save(static_image_path, format="JPEG")
            image_paths.append(static_image_path)

        video_path = os.path.join(slideshow_dir, "slideshow.mp4")
        clip = mp.ImageSequenceClip(image_paths, durations=[2] * len(image_paths))
        clip.write_videofile(video_path, fps=24)

        # Return a browser-accessible URL
        video_url = f"/static/{slideshow_id}/slideshow.mp4"
        return JSONResponse(content={"message": "Slideshow created successfully", "video_url": video_url})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/static/{folder}/{filename}")
async def get_video(folder: str, filename: str):
    file_path = os.path.join(STATIC_DIR, folder, filename)
    print(f"[static] Serving file: {file_path}")
    if not os.path.exists(file_path):
        print(f"[static] File not found: {file_path}")
    return FileResponse(file_path)