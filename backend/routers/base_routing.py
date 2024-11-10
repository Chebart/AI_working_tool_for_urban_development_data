import asyncio
import logging
import shutil

from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List
from pathlib import Path
import json
import os

from backend.geojson_converter import LAYER_TYPES, dump_graph_to_geojson
from backend.file_parser import DATA_PATH, get_version_folder, save_geojson, sanitize_geojson
from backend.graph_builder import get_prepared_graph
from backend.graph_updater import update_loads_on_roads_graph


app = FastAPI()
router = APIRouter()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_next_version() -> int:
    """Finds the next available version number based on existing directories."""
    existing_versions = [int(folder.name) for folder in DATA_PATH.iterdir() if folder.is_dir() and bool(list(folder.iterdir()))]
    return max(existing_versions, default=-1) + 1


def load_geojson(path: Path) -> Dict:
    """Loads a GeoJSON file and returns it as a dictionary."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)



class GeoJSONModel(BaseModel):
    type: str
    features: List[Dict]

def create_new_version(layer: GeoJSONModel, layer_type: str, version: int):
    all_layers = set(LAYER_TYPES.keys())
    file_path = get_version_folder(version) / f"{layer_type}_layer.geojson"
    save_geojson(layer.model_dump(), file_path)
    logging.info(f"Saved: {file_path}")

    all_layers.discard(layer_type)
    for layer_left in all_layers:
        prev_version_path = get_version_folder(version - 1) / f"{layer_left}_layer.geojson"
        new_version_path = get_version_folder(version) / f"{layer_left}_layer.geojson"

        if not prev_version_path.exists():
            logging.warning(f"Previous version file does not exist: {prev_version_path}")
            continue

        geojson_data = load_geojson(prev_version_path)

        # sanitize_geojson(geojson_data)
        save_geojson(geojson_data, new_version_path)

        logging.info(f"Copied and sanitized: {layer_left}_layer.geojson")


async def update_graph(version: int):
    g = get_prepared_graph(version)
    print(f"Graph created")

    g = update_loads_on_roads_graph(g)
    print(f"Graph updated")

    dump_graph_to_geojson(g, version=version, save_separate_files=True)
    print(f"Graph saved as version {version}")


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


    # Save the GeoJSON data
    create_new_version(layer, layer_type, version)

    await update_graph(version)

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