from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from typing import List
import os
import base64
import json
import cv2
import numpy as np
from factories.FilterFactory import FilterFactory
from services.IService import IService
from typing import List
from pydantic import BaseModel

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})
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


class DatasetFilterRequest(BaseModel):
    input_folder: str
    filterName: str


@app.get("/checkDataset")
async def checkDataset(folderPath: str = ""):
    if not os.path.exists(folderPath):
        raise HTTPException(status_code=404, detail="Belirtilen klasör bulunamadı.")

    if not os.path.isdir(folderPath):
        raise HTTPException(status_code=400, detail="Belirtilen yol bir klasör değil.")

    validExtensions = (".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff")
    images = [
        file
        for file in os.listdir(folderPath)
        if file.lower().endswith(validExtensions)
    ]

    if not images:
        raise HTTPException(
            status_code=404, detail="Klasörde herhangi bir resim bulunamadı."
        )

    return JSONResponse(content={"imageCount": len(images)}, status_code=200)


@app.post("/applyToDataset")
async def applyToDataset(request: DatasetFilterRequest):
    try:
        inputFolder = request.input_folder
        filterName = request.filterName
        print(filterName)
        outputFolder = os.path.join(inputFolder, "../outputImages", filterName)
        os.makedirs(outputFolder, exist_ok=True)

        images: List[str] = [
            f
            for f in os.listdir(inputFolder)
            if f.lower().endswith((".png", ".jpg", ".jpeg"))
        ]

        if not images:
            raise HTTPException(
                status_code=400, detail="Klasörde herhangi bir resim bulunamadı."
            )
        try:
            service: IService = FilterFactory().createInstance(filterName)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        for imageName in images:
            print("Processing:", imageName)
            image_path = os.path.join(inputFolder, imageName)

            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                print(f"Resim yüklenemedi: {imageName}.")
                continue
            filtered_image = service.filterImage(img)

            output_image_path = os.path.join(outputFolder, f"{filterName}_{imageName}")
            cv2.imwrite(output_image_path, filtered_image)

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Beklenmedik bir hata meydana geldi"
        )

    return JSONResponse(
        content={
            "message": "İşlem başarılı bir şekilde tamamlandı",
        },
        status_code=200,
    )
