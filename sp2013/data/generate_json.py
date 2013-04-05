import networkx as nx
from networkx.readwrite import json_graph
import json

data = json.loads(open('SP2013_SPL.raw.json').read())

P = nx.DiGraph()
O = nx.DiGraph()

p_k2_list = []
p_k3_list = []
p_k4_list = []

o_k2_list = []
o_k3_list = []
o_k4_list = []

def generate_graph(graph, top_name, k2_list, k3_list, k4_list, matches=[]):
    for d in data:
        if not d.get('Znesek') or d.get('Znesek') == "0":
            continue

        get = d.get
        
        # blc_id = get('BLC_ID')
        # blc = u"%s - %s" % (get('BLC_ID'), get('BLC_NAME'))

        k2_id = get('K2_ID')
        k2  = u"%s - %s" % (get('K2_ID'),  get('K2_NAME'))

        k3_id = get('K3_ID')
        k3  = u"%s - %s" % (get('K3_ID'),  get('K3_NAME'))
        
        k4_id = get('K4_ID')
        k4  = u"%s - %s" % (get('K4_ID'),  get('K4_NAME'))

        value = float(d.get('Znesek'))

        if k2_id in matches:

            graph.add_node(top_name, name=top_name)
            graph.add_node(k2_id, name=k2)
            graph.add_node(k3_id, name=k3)
            graph.add_node(k4_id, name=k4)

            graph.add_edge(k2_id, top_name, value=1)
            graph.add_edge(k3_id, k2_id,  value=1)    
            graph.add_edge(k4_id, k3_id,  value=value)

            if k2_id not in k2_list: k2_list.append(k2_id)
            if k3_id not in k3_list: k3_list.append(k3_id)
            if k4_id not in k4_list: k4_list.append(k4_id)

generate_graph(P, 'prihodki', p_k2_list, p_k3_list, p_k4_list, ['70', '71', '72', '73', '74', '78', '75', '50'])
generate_graph(O,  'odhodki', o_k2_list, o_k3_list, o_k4_list, ['40', '41', '42', '43', '45', '44', '55'])

def calc_weight(graph, node_list):
    for k in node_list:
        if graph.node.get(k):
            value = 0
            for p in graph.predecessors(k):
                value += graph.edge[p][k]['value']

            for s in graph.successors(k):
                graph.edge[k][s]['value'] = value

# we need to recalculate it from bottom-up
calc_weight(P, p_k3_list)
calc_weight(P, p_k2_list)
calc_weight(P, ['prihodki'])

calc_weight(O, o_k3_list)
calc_weight(O, o_k2_list)
calc_weight(O, ['odhodki'])

# in-place reverse odhodki
O = O.reverse()

PO = nx.union(P, O)

PO.remove_nodes_from(['73', '75', '72', '74', '702', '703', '701', '786', '784', '713', 
                      '720', '721', '722', '750', '751', '752', '730', '731', '740', '442', '443', '414'])

# PO.add_edge('prihodki', 'odhodki', value='11710700040')
for p in PO.successors('odhodki'):
    # print type(p) 

    PO.add_edge('prihodki', p, value=PO['odhodki'][p]['value'])
    PO.remove_edge('odhodki', p)

PO.remove_nodes_from(p_k4_list)
PO.remove_nodes_from(o_k4_list)

print P.number_of_nodes(), O.number_of_nodes(), PO.number_of_nodes()

nx.write_graphml(P,  'prihodki.graphml')
nx.write_graphml(O,  'odhodki.graphml')
nx.write_graphml(PO, 'skupaj.graphml')

tdata = json_graph.node_link_data(PO)

f = open('SP2013_SPL.json', 'w')
f.write(json.dumps(tdata, sort_keys=True, indent=4, separators=(',', ': ')))
f.close()
