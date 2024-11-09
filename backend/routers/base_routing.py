import logging

from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List
from pathlib import Path
import json
import os

from backend.geojson_converter import DATA_PATH, get_version_folder, save_geojson
app = FastAPI()
router = APIRouter()



def get_next_version() -> int:
    """Finds the next available version number based on existing directories."""
    existing_versions = [int(folder.name) for folder in DATA_PATH.iterdir() if folder.is_dir()]
    return max(existing_versions, default=-1) + 1

def save_geojson(geojson: Dict, path: Path) -> None:
    """Saves a GeoJSON dictionary to a specified file path."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)

def load_geojson(path: Path) -> Dict:
    """Loads a GeoJSON file and returns it as a dictionary."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)



class GeoJSONModel(BaseModel):
    type: str
    features: List[Dict]


@router.get("/get_layer/{layer_type}/{version}")
async def get_layer(layer_type: str, version: int):
    """
    Fetches a GeoJSON file for a given layer type and version.
    
    Args:
        layer_type (str): Type of layer (e.g., 'static', 'streets', 'residence').
        version (int): Version number.

    Returns:
        JSONResponse: The content of the GeoJSON file.
    """
    logging.warning(f"Received {layer_type} {version}")
    file_path = get_version_folder(version) / f"{layer_type}_layer.geojson"
    logging.warning(f"Loading {file_path}")
    if not file_path.exists():
        logging.warning(f"File does not exist: {file_path}")
        raise HTTPException(status_code=404, detail=f"GeoJSON file not found for layer '{layer_type}' and version '{version}'")

    geojson_data = load_geojson(file_path)
    return JSONResponse(content={"success": True, "data": geojson_data})


@router.post("/new_version/{layer_type}")
async def new_version(layer: GeoJSONModel, layer_type: str):
    """
    Creates a new version folder and saves the provided GeoJSON data.

    Args:
        layer (GeoJSONModel): GeoJSON data to be saved.
        layer_type (str): Type of layer (e.g., 'static', 'streets', 'residence').

    Returns:
        JSONResponse: The new version number and success status.
    """
    version = get_next_version()
    file_path = get_version_folder(version) / f"{layer_type}_layer.geojson"

    # Save the GeoJSON data
    save_geojson(layer.dict(), file_path)

    return JSONResponse(content={"success": True, "version": version})


@router.get("/get_available_versions")
async def get_available_versions():
    """
    Retrieves a list of available versions.

    Returns:
        JSONResponse: A list of version numbers.
    """
    versions = [int(folder.name) for folder in DATA_PATH.iterdir() if folder.is_dir()]
    versions.sort()  # Ensure the list is sorted

    return JSONResponse(content={"success": True, "versions": versions})

# Include the router in the FastAPI app
app.include_router(router)