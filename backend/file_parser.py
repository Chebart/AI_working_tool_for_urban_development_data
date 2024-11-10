import os
import tempfile
from contextlib import suppress
from pathlib import Path
import json
import pickle
from typing import Dict

import numpy as np
import pandas as pd
import geopandas as gpd

BASE_PATH = Path('/app/') if os.getenv('IN_DOCKER') else Path('../')
print("BASE_PATH: ", BASE_PATH, "; children: ", list(BASE_PATH.iterdir()))
DATA_PATH = BASE_PATH / 'data'
os.makedirs(DATA_PATH, exist_ok=True)



import math

def sanitize_geojson(data: dict):
    """
    Recursively sanitize GeoJSON data to remove invalid float values like NaN or Infinity.
    """
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (float, int)):
                if math.isnan(value) or math.isinf(value):
                    data[key] = 0.0  # Replace invalid float with 0.0
            elif isinstance(value, (list, dict)):
                sanitize_geojson(value)
    elif isinstance(data, list):
        for i, item in enumerate(data):
            if isinstance(item, (float, int)):
                if math.isnan(item) or math.isinf(item):
                    data[i] = 0.0  # Replace invalid float with 0.0
            elif isinstance(item, (list, dict)):
                sanitize_geojson(item)



def merge_transport_datasets(bus_df: gpd.GeoDataFrame, subway_df: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    subway_df["Type"] = "Subway"

    subway_df.rename(columns={"Text": "Name"}, inplace=True)

    subway_df = subway_df.drop(columns=["Number"])
    bus_df = bus_df.drop(columns=["TrStopId"])
    bus_df.rename(columns={"TrType": "Type"}, inplace=True)

    merged_df = pd.concat([bus_df, subway_df], ignore_index=True)
    merged_gdf = gpd.GeoDataFrame(merged_df, geometry="geometry")
    return merged_gdf


def get_version_folder(version: int) -> Path:
    """Creates and retrieves the folder for a specific graph version."""
    path = DATA_PATH / str(version)
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_street_json(version: int) -> str:
    file = DATA_PATH / f"Streets_{version}очередь.geojson"
    assert file.exists()
    return file

def get_house_json(version: int) -> str:
    file = DATA_PATH / f"House_{version}очередь_ЖК.geojson"
    assert file.exists()
    return file

def get_transport_points_gdf() -> gpd.GeoDataFrame:
    social_gdf = merge_transport_datasets(
        bus_df=gpd.read_file(DATA_PATH / 'Остановки_ОТ.geojson'),
        subway_df=gpd.read_file(DATA_PATH / 'Выходы_метро.geojson')
    )
    return social_gdf



def save_geojson(geojson: Dict, path: Path) -> None:
    """Saves a GeoJSON dictionary to a specified file path."""
    # with tempfile.TemporaryDirectory(dir=DATA_PATH.as_posix()) as temp_dir:
    #     temp_path = Path(temp_dir) / 'temp.geojson'
    #     with open(temp_path, encoding="utf-8", mode="w") as f:
    #         json.dump(geojson, f, indent=2, ensure_ascii=False)
    #
    #     # Load the GeoJSON file (assuming it's in EPSG:4326)
    #     gdf = gpd.read_file(temp_path)
    #     print(f"DataFrame CRS is: {gdf.crs.srs}")
    #
    #     # Transform the GeoDataFrame to EPSG:32637
    #     gdf = gdf.to_crs(epsg=4326)
    #
    #     # Save the transformed GeoDataFrame to a new GeoJSON file
    #     gdf.to_file(path, driver="GeoJSON")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)
    print(f"GeoJSON saved to {path}")