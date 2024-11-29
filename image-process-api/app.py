from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import base64
import json
import cv2
import numpy as np
from factories.FilterFactory import FilterFactory
from services.IService import IService


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/filters")
async def getFilters():
    return JSONResponse(
        content=[
            "Median",
            "Gaussian",
            "Wiener",
            "Denoise-bilateral",
            "Denoise-nl-means",
        ]
    )


@app.post("/applyToImage/")
async def applyToImage(
    file: UploadFile = File(...),
    filters: str = Form(...),
):
    contents = await file.read()
    np_array = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_GRAYSCALE)
    try:
        filters_data = json.loads(filters)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON in filters"}
    _, buffer = cv2.imencode(".jpg", image)
    originalImage = base64.b64encode(buffer).decode("utf-8")
    result = [{"filter": "Orjinal", "image": originalImage}]

    services: List[IService] = FilterFactory().createInstances(*filters_data)
    for service in services:
        filtered_image = service.filterImage(image)
        _, buffer = cv2.imencode(".jpg", filtered_image)
        base64_image = base64.b64encode(buffer).decode("utf-8")
        result.append({"filter": service.getFilterName(), "image": base64_image})

    return JSONResponse(content={"filtered_images": result})


from typing import List
from pydantic import BaseModel


class DatasetFilterRequest(BaseModel):
    input_folder: str
    filter_name: str


@app.post("/applyToDataset")
async def apply_to_dataset(request: DatasetFilterRequest):
    input_folder = request.input_folder
    filter_name = request.filter_name

    output_folder = os.path.join(input_folder, "../outputImages", filter_name)
    os.makedirs(output_folder, exist_ok=True)

    images: List[str] = [
        f
        for f in os.listdir(input_folder)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ][:4]

    if not images:
        raise HTTPException(
            status_code=400, detail="No valid images found in the input folder."
        )

    service: IService = FilterFactory().createInstance(filter_name)

    for image_name in images:
        print("Processing:", image_name)
        image_path = os.path.join(input_folder, image_name)

        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            print(f"Failed to load image: {image_name}. Skipping...")
            continue

        filtered_image = service.filterImage(img)

        output_image_path = os.path.join(output_folder, f"{filter_name}_{image_name}")
        cv2.imwrite(output_image_path, filtered_image)

    return JSONResponse(
        content={"filtered_images": "Processing completed successfully."}
    )
