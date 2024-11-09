import os
from contextlib import suppress
from pathlib import Path
import json
import pickle
from typing import Dict
import networkx as nx
import numpy as np
from shapely.geometry import Point, LineString, Polygon, MultiPolygon, mapping


DATA_PATH = Path("/app/data/")
os.makedirs(DATA_PATH, exist_ok=True)

# GeoJSON layer types
LAYER_TYPES = {
    "static": ["Автобусная остановка", "Subway"],
    "streets": "Road",
    "residence": "residence"
}


def get_version_folder(version: int) -> Path:
    """Creates and retrieves the folder for a specific graph version."""
    path = DATA_PATH / str(version)
    path.mkdir(parents=True, exist_ok=True)
    return path

def save_geojson(geojson: Dict, path: Path) -> None:
    """Saves a GeoJSON dictionary to a specified file path."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)
    print(f"GeoJSON saved to {path}")

def serialize_geometry(instance):
    """Serializes Shapely geometry objects into JSON-compatible formats."""
    if isinstance(instance, Point):
        return (instance.x, instance.y)
    if isinstance(instance, LineString):
        return [(x, y) for x, y in instance.coords]
    if isinstance(instance, Polygon):
        return [[(x, y) for x, y in instance.exterior.coords]]
    if isinstance(instance, MultiPolygon):
        return [[[(x, y) for x, y in geom.exterior.coords] for geom in instance.geoms]]
    return instance


def normalize_properties(data: dict) -> dict:
    """
    Normalize properties to ensure all values are JSON-compliant.
    - Convert `None` to `null`.
    - Convert `NaN`, `Infinity`, and `-Infinity` to `null`.
    """
    normalized_data = {}
    for key, value in data.items():
        if value is None or (isinstance(value, float) and (np.isnan(value) or np.isinf(value))):
            normalized_data[key] = None
        else:
            normalized_data[key] = value
    return normalized_data


def dump_graph_to_geojson(graph: nx.Graph, version: int = 0, save_separate_files: bool = False):
    """
    Dumps the given graph into GeoJSON format, with options to save by layers.

    Args:
        graph (nx.Graph): The input graph.
        version (int): Version number for the output folder.
        save_separate_files (bool): Whether to save separate GeoJSON files for each layer.
    """
    # Initialize feature collections for each layer
    layers = {
        "static": [],
        "streets": [],
        "residence": []
    }

    # Process Nodes
    for node, data in graph.nodes(data=True):
        # Ensure node is serialized correctly
        point = Point(node) if isinstance(node, tuple) else node

        with suppress(KeyError):
            data.pop('geometry', None)
        data = normalize_properties(data)
        node_feature = {
            "type": "Feature",
            "geometry": mapping(point),
            "properties": {k: serialize_geometry(v) for k, v in data.items()}
        }

        # Determine the layer type for the node
        node_type = data.get("Type", None)
        if node_type in LAYER_TYPES["static"]:
            layers["static"].append(node_feature)
        elif node_type == "Road":
            layers["streets"].append(node_feature)
        else:
            layers["residence"].append(node_feature)

    # Process Edges (All edges are considered as part of "streets" layer)
    for u, v, data in graph.edges(data=True):
        with suppress(KeyError):
            data.pop('geometry', None)
        data = normalize_properties(data)
        line = LineString([u, v])
        edge_feature = {
            "type": "Feature",
            "geometry": mapping(line),
            "properties": {k: serialize_geometry(v) for k, v in data.items()}
        }

        layers["streets"].append(edge_feature)

    # Saving GeoJSON files
    output_folder = get_version_folder(version)

    # Option 1: Save separate GeoJSON files for each layer
    if save_separate_files:
        for layer_name, features in layers.items():
            geojson = {
                "type": "FeatureCollection",
                "features": features
            }
            save_geojson(geojson, output_folder / f"{layer_name}_layer.geojson")
        print("Separate GeoJSON files for each layer have been saved.")

    # Option 2: Combine all layers into a single GeoJSON with "layer" property
    else:
        combined_features = []
        for layer_name, features in layers.items():
            for feature in features:
                feature["properties"]["layer"] = layer_name
                combined_features.append(feature)

        combined_geojson = {
            "type": "FeatureCollection",
            "features": combined_features
        }
        save_geojson(combined_geojson, output_folder / "combined_layers.geojson")
        print("Combined GeoJSON file with layers has been saved.")

# Example Usage
# dump_graph_to_geojson(G, version=0, save_separate_files=False)