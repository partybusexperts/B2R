import os
import sys

# Ensure project root is importable when script lives in tmp/
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
if ROOT_DIR not in sys.path:
	sys.path.insert(0, ROOT_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
resp = client.post("/api/weather-check", json={"city": "Austin", "date": "2025-11-23"})
print("weather-check", resp.status_code, resp.json())
resp = client.get("/api/reviews")
print("reviews", resp.status_code, resp.json())
