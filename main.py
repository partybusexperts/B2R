

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import moviepy.editor as mp
import tempfile
import os
import shutil
import uuid


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