#%%
import os
from pathlib import Path

import numpy as np
import pandas as pd
import geopandas as gpd

import networkx as nx
import osmnx as ox
from libpysal import weights
import matplotlib.pyplot as plt
import momepy
from pydantic import UUID1
from shapely.geometry import Polygon, Point
from copy import deepcopy

from backend.file_parser import get_version_folder, DATA_PATH

#%%
#%%
PROJECTED_CRS = 32637
GEOGRAPHIC_CRS = 4326
PADDING = 0.001  # Padding in degrees
#%%

#%%
#%%
from typing import Tuple

CropBox = Tuple[float, float, float, float]

def _crop_gdf(gdf: gpd.GeoDataFrame, crop: CropBox) -> gpd.GeoDataFrame:
    x_min, y_min, x_max, y_max = crop
    crop_region = Polygon([(x_min, y_min), (x_max, y_min), (x_max, y_max), (x_min, y_max)])
    return gdf[gdf.geometry.within(crop_region)]


def _select_residence_region(residence_gdf: gpd.GeoDataFrame, padding: float = PADDING) -> tuple:
    x_min, y_min, x_max, y_max = residence_gdf.total_bounds
    x_min -= padding
    y_min -= padding
    x_max += padding
    y_max += padding
    return x_min, y_min, x_max, y_max

def _get_area_occupied(crop_box: np.ndarray) -> float:
    return (crop_box[3] - crop_box[1]) * (crop_box[2] - crop_box[0]) * 10000

def _get_graph(gdf: gpd.GeoDataFrame) -> nx.MultiGraph:
    gdf = gdf.iloc[:]
    # if not gdf.crs.is_projected:
    #     print(f"DataFrame CRS is: {gdf.crs.srs} - not projected. Converting to {PROJECTED_CRS}...")
    #     gdf.to_crs(epsg=PROJECTED_CRS, inplace=True)
    return momepy.gdf_to_nx(gdf, approach="primal")


#%%


def _find_closest_node(point, graph):
    def euclidean_distance(node):
        x, y = node
        return np.sqrt(
                (x - point[0]) ** 2 + (y - point[1]) ** 2
        )
    return min(graph.nodes(), key=euclidean_distance)
#%%
from uuid import uuid4
#%%
def _add_node(row: pd.Series, graph: nx.MultiGraph) -> None:
    centroid_point = (row["geometry"].centroid.x, row["geometry"].centroid.y)

    # Find the closest node in the street network
    closest_node = _find_closest_node(centroid_point, graph)

    # Add the building access point as a new node in the graph
    graph.add_node(centroid_point, **row.to_dict())
    # print(f"added node: {centroid_point}")

    # Calculate the weight (distance) between the new node and the closest existing node
    weight = ((closest_node[0] - centroid_point[0]) ** 2 +
              (closest_node[1] - centroid_point[1]) ** 2) ** 0.5
    if weight:
        # Add an edge between the access point and the closest node in the street network
        graph.add_edge(centroid_point, closest_node, weight=weight, EdgeId=uuid4().int % 10 ** 8, )
        # print(f"added edge with weight: {weight}")
    else:
        pass
        # print(f"did not add edge due to zero weight")

def _ensure_weights(graph: nx.MultiGraph) -> None:
    for u, v, data in graph.edges(data=True):
        if 'weight' in data:
            continue
        elif 'mm_len' in data:
            # print(f"Found mm_len...")
            data['weight'] = data['mm_len']
            # print(f"Set edge weight to {data['weight']}")
        else:
            # Fallback: calculate weight based on geometry length
            print(f"Calculating weight...")
            line = data.get('geometry')
            if line:  # Check if geometry is present
                data['weight'] = line.length
            else:
                data['weight'] = 1  # Default weight if no length data available
            print(f"Set edge weight to {data['weight']}")


def _ensure_types(graph: nx.MultiGraph) -> None:
    for n, data in graph.nodes(data=True):
        data['Type'] = data.get('Type') or 'Road'


def _read_dataframes(version: int) -> Tuple[gpd.GeoDataFrame, gpd.GeoDataFrame, gpd.GeoDataFrame]:
    print(f"Reading geojson files from {get_version_folder(version)}...")
    streets = gpd.read_file(
        get_version_folder(version) / "streets_layer.geojson"
    )
    transport_points = gpd.read_file(
        get_version_folder(version) / "static_layer.geojson"
    )
    transport_points.fillna(value="subway", inplace=True)
    residential_complex = gpd.read_file(
        get_version_folder(version) / "residence_layer.geojson"
    )
    residential_complex.drop(['District', 'Street', 'Number'], axis=1, inplace=True, errors='ignore')

    # Drop all rows where pedestrian can't walk
    streets = streets[streets['Foot'] == 1]
    return streets, transport_points, residential_complex


def get_prepared_graph(version: int, to_projection: bool = False) -> nx.MultiGraph:
    streets, transport_points, residential_complex = _read_dataframes(version)
    crop = _select_residence_region(residential_complex)

    print(f"Crop: {crop}")

    #%%
    streets = _crop_gdf(streets, crop)
    transport_points = _crop_gdf(transport_points, crop)

    if streets.crs is None:
        streets.set_crs(epsg=GEOGRAPHIC_CRS, inplace=True)
    if residential_complex.crs is None:
        residential_complex.set_crs(epsg=GEOGRAPHIC_CRS, inplace=True)
    if transport_points.crs is None:
        transport_points.set_crs(epsg=GEOGRAPHIC_CRS, inplace=True)
    if to_projection:
        projected_streets = streets.to_crs(epsg=PROJECTED_CRS)
        projected_residence = residential_complex.to_crs(epsg=PROJECTED_CRS)
        projected_transport_points = transport_points.to_crs(epsg=PROJECTED_CRS)
    else:
        projected_streets = streets
        projected_residence = residential_complex
        projected_transport_points = transport_points
    G = _get_graph(projected_streets)
    for idx, row in projected_residence.iterrows():
        _add_node(row, G)
    for idx, row in projected_transport_points.iterrows():
        _add_node(row, G)
    _ensure_types(G)
    _ensure_weights(G)

    return G

