
import pandas as pd 


df = pd.read_excel('FermDB_data.xlsx')
df.columns = df.columns.str.replace(' ', '_') 
df = df[
     ['Country_code',
      'Category',
      'Product'
     ]
]
df['Country_code'] = df['Country_code'].apply(lambda x : str(x).split(','))


flatdata_ontology = pd.DataFrame([( index, value) for ( index, values) 
                         in df[ 'Country_code' ].items() for value in values], 
                             columns = [ 'index', 'Country_code']).set_index( 'index' ) 
  
df = df.drop( 'Country_code', axis = 1 ).join( flatdata_ontology) 
df['Country_code'] = df['Country_code'].apply(lambda x : x.strip())
df['Category'] = df['Category'].fillna('other')

df.to_csv('Map_category.csv',sep = ',')

level0 = df.groupby(['Country_code'], group_keys=True
                ).sum().reset_index(['Country_code'])
level0['combined']= level0['Country_code'] 

level1 = df.groupby(['Country_code','Category'], group_keys=True
                ).sum().reset_index(['Country_code','Category'])
level1['combined']= level1['Country_code'] + '.' + level1['Category']

level2 = df.groupby(['Country_code','Category','Product'], group_keys=True
                ).sum().reset_index(['Country_code','Category','Product'])
level2['combined']= level2['Country_code'] + '.' + level2['Category'] + '.' + level2['Product']


df_res = pd.concat([level0['combined'],level1['combined'],level2['combined']])
df_res.to_csv('DendrogramData.csv',sep = ',')
