import json
import pandas as pd

json_file_path = 'food_ontology.json'
with open(json_file_path, 'r') as j:
     contents = json.loads(j.read())

df = pd.read_excel('/Users/zsebechle/git/FermDB1/Fermented_food2.xlsx')
df.columns = df.columns.str.replace(' ', '_') 
df = df[
     ['Country_code',
      'Category',
      'Product',
      'Raw_material_ontology'
     ]
]
df['Country_code'] = df['Country_code'].apply(lambda x : str(x).strip().split(','))
df['Raw_material_ontology'] = df['Raw_material_ontology'].apply(lambda x : str(x).strip().split(','))
df['Raw_material_ontology'] = df['Raw_material_ontology'].apply(lambda row_series : [x.lower().lstrip().replace(' ','_') for x in row_series])
df['Product'] = df['Product'].apply(lambda x: str(x).strip().replace(' ','_'))
df['Category'] = df['Category'].apply(lambda x: str(x).strip().replace(' ','_'))



flatdata_ontology = pd.DataFrame([( index, value) for ( index, values) 
                         in df[ 'Raw_material_ontology' ].items() for value in values], 
                             columns = [ 'index', 'Raw_material_ontology']).set_index( 'index' ) 
  
df = df.drop( 'Raw_material_ontology', axis = 1 ).join( flatdata_ontology) 


df1 = pd.DataFrame.from_records(
    [
        (level1, level2, level3, leaf , l)
        for level1, level2_dict in contents.items()
        for level2, level3_dict in level2_dict.items()
        for level3, leaf in level3_dict.items()
        for  l in leaf
    ],
    columns=['Level0', 'Level1', 'Level2', 'Level3','Level4']
)
df1 = df1[['Level0', 'Level1', 'Level2','Level4']]
df1['Level4'] = df1['Level4'].apply(lambda x : x.lower().lstrip().replace(' ','_'))



df_merge = df.merge(df1, left_on = 'Raw_material_ontology', right_on = 'Level4', how = 'inner')
df_merge.to_csv('Raw_ontology_table.csv',sep = ',')

