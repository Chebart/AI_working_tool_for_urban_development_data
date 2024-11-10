import networkx as nx


apartment_occupancy_ratio = 3

# Доля населения по категориям
population_distribution = {
    "children_and_seniors": 0.15,  # Дети и пенсионеры (15%)
    "adults_personal_transport": 0.30,  # Взрослые (30%) - передвижение на личном транспорте вне района
    "adults_public_transport": 0.45,  # Взрослые (45%) - передвижение на ОТ вне района
    "adults_carsharing": 0.10,  # Взрослые (10%) - используют каршеринг, СИМ
}


color_by_load = {
    (0, 160): 'green',  # '00A552'   
    (161, 320): 'yellow',  # F7F429
    (321, 480): 'orange',  #оранжевый FFA721
    (481, 640): 'red',  # красный FE0117
    (641, 800): 'bordovyi',  # бордовый D60028
    (800, 100000): 'bordovyi'  # , 800): 'bordovyi'  # бордовый D60028
}


def get_all_nodes_by_type(graph, node_type):
    matching_nodes = []
    for node, attributes in graph.nodes(data=True):
        if 'Type' in attributes and attributes['Type'] == node_type:
            matching_nodes.append((node, attributes))
    return matching_nodes


def create_supernode(graph, node_list):
    graph.add_node('superNode', Type='SuperNode')
    for current_node, attrs in node_list:
        graph.add_edge(current_node, 'superNode', weight=0)
    return 'superNode'


def set_defaults_edges(G):
    for edge in G.edges:
        # print(edge)
        a, b, ln = edge
        if 'color' in G[a][b][0]:
            continue
        G[a][b][0]['color'] = 'green'
        G[a][b][0]['load'] = 0
    return G


def calc_load_on_roads(G, source_node_types, target_node_type, load_from_node):
    source_nodes = []
    for source_node_type in source_node_types:
        source_nodes += get_all_nodes_by_type(G, source_node_type)
    target_nodes = get_all_nodes_by_type(G, target_node_type)
    
    super_node = create_supernode(G, source_nodes)

    G = set_defaults_edges(G)
    
    path_from_bus_stop = nx.single_source_dijkstra_path(G, source=super_node, weight='weight')

    for target, attrs in target_nodes:
        if target not in path_from_bus_stop:
            print(f'{source_node_types} is not from this stop', target)
            continue
        current_path = list(path_from_bus_stop[target])
        for i in range(len(current_path)-1):
            a, b = (current_path[i], current_path[i+1])
            new_load = G[a][b][0]['load'] + load_from_node(attrs)
            nx.set_edge_attributes(G, {(a,b, 0):{'load': new_load}})
            G[a][b][0]['load'] += load_from_node(attrs)
            for level, color in color_by_load.items():
                bottom, top = level
                if bottom <= G[a][b][0]['load'] <= top:
                    nx.set_edge_attributes(G, {(a,b, 0):{'color': color}})
    G.remove_node(super_node)
    return G


def load_from_home_to_stop(attrs): 
    count_livers_in_home = attrs['Apartments'] * apartment_occupancy_ratio
    load_from_home = count_livers_in_home * population_distribution['adults_public_transport']
    return load_from_home

def load_from_home_to_school(attrs): 
    count_livers_in_home = attrs['Apartments'] * apartment_occupancy_ratio
    load_from_home = count_livers_in_home * population_distribution['children_and_seniors']
    return load_from_home

def calc_pedestrian_load(G):
    # ['Жилые дома', 'Школы', 'Административные сооружения', 'Дошкольные', 'Известный по назначению', 'Автобусная остановка']

    G = calc_load_on_roads(G, ['Автобусная остановка'], 'Жилые дома', load_from_home_to_stop)
    G = calc_load_on_roads(G, ['Школы', 'Дошкольные'], 'Жилые дома', load_from_home_to_school)
  
    # for edge in G.edges(data=True, keys=True):
    #     print(edge)
    return G


def update_loads_on_roads_graph(G):
    return calc_pedestrian_load(G)
