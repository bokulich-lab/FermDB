import json
from anytree import PostOrderIter
from anytree.importer import DictImporter
import pandas as pd
from itertools import chain
from pathlib import Path  



json_file_path = 'food_ontology.json'

with open(json_file_path, 'r') as j:
     contents = json.loads(j.read())

df = pd.read_excel('/Users/zsebechle/git/GlobalFermentedFoods/FermFood.xlsx')
df.columns = df.columns.str.replace(' ', '_') 

df_temp = df[['Product','Raw_material_ontology']]
convert_dict = {'Product': str,
                'Raw_material_ontology': str
                }
df_temp = df_temp.astype(convert_dict)
df_temp.Raw_material_ontology= df_temp.Raw_material_ontology.str.split(',')
df_temp = df_temp.explode('Raw_material_ontology')
df_temp['Raw_material_ontology'] = df_temp['Raw_material_ontology'].str.strip()
df_grouped = df_temp.groupby(['Raw_material_ontology'])['Raw_material_ontology'].count()


res_dict = dict()
res_dict['Materials'] = ''
for key1, key2_dict in contents.items():
     for key2, key3_dict in key2_dict.items():
          key2_new = key2.replace(' ', '_') 
          res_dict[key2_new] = key1
          for key3, leaf in key3_dict.items():
               key3_new = key3.replace(' ', '_') 
               res_dict[key3_new] = key2_new

          
with open('test_treemap.csv', 'w') as f:
    f.write("label,parent")
    for key in res_dict.keys():
        f.write("%s,%s\n" % (key, res_dict[key]))    
               
