import pandas as pd
import re


df_tsv = pd.read_csv('FermDB_data_old.tsv', sep='\t', encoding='utf-8')




df_new = df_tsv[['Country_code', 'Category', 'Product',
       'Original Name', 'Description', 'Raw material ontology', 'Raw material',
       'Reference', 'Webpage reference']]

df_expanded = df_new.assign(Country=df_new['Country_code'].str.split(',')).explode('Country')

rows_with_nan_any = df_expanded[df_expanded['Country'].isna()]

df_expanded = df_expanded.dropna(subset=['Country'])
df_expanded['Country'] = df_expanded['Country'].str.strip()
df_expanded['Country'] = df_expanded['Country'].astype('str')


pd.set_option('display.max_rows', None)  
pd.set_option('display.max_columns', None)  
#print(df_expanded['Country'])

dtype_dict = {
    'country-code': 'str'
    
}


df_country = pd.read_csv('country.csv',dtype=dtype_dict)


dtype_dict = {
    'M49 Code': 'str'
    
}


df_country_new = pd.read_csv('country_new.csv',sep = ';',dtype = dtype_dict)

print(df_country_new.columns)


df_merged = pd.merge(df_expanded, df_country_new, left_on='Country', right_on = 'M49 Code', how='left')

columns_to_keep = ['Category', 'Product', 'Original Name', 'Description',
       'Raw material ontology', 'Raw material', 'Reference',
       'Webpage reference', 'Region Name','Region Code','Sub-region Name','Sub-region Code','Intermediate Region Name','Intermediate Region Code', 'Country or Area', 'M49 Code','Country']



df_merged = df_merged[columns_to_keep]
df_merged = df_merged.astype(str)

df_grouped = df_merged.groupby('Product').agg(lambda x: ', '.join(x))
df_grouped = df_grouped.reset_index()
df_grouped = df_grouped.astype(str)

def remove_duplicate_words(text):
    if isinstance(text, str):  # Check if the cell contains a string
        words = text.split(', ')  # Split the text into words based on commas
        seen = set()  # Create a set to track seen words
        unique_words = [word for word in words if not (word in seen or seen.add(word))]
        return ','.join(unique_words)
    return text

# Apply the function to each element in the DataFrame
df_grouped = df_grouped.applymap(lambda x: remove_duplicate_words(x))




df_grouped = df_grouped.rename(columns={'Country': 'Country_code', 'name': 'Country',
                                        'Region Name': 'Continent', 'Region Code': 'Continent Code',
                                        'Sub-region Name': 'Region', 'Sub-region Code': 'Region Code',
                                        'Intermediate Region Name':'Subregion',
                                        'Intermediate Region Code': 'Subregion Code',
                                        'Country or Area':'Country'})


df_grouped = df_grouped[['Continent','Continent Code','Region','Region Code','Subregion','Subregion Code','Country','Country_code','Category','Product','Original Name','Description','Raw material ontology','Raw material','Reference','Webpage reference']]
df_grouped = df_grouped.replace('nan', '')
df_grouped = df_grouped.replace('nan, nan', '')
df_grouped = df_grouped.replace('nan, nan, nan', '')
df_grouped = df_grouped.replace('nan, nan, nan, nan', '')
df_grouped = df_grouped.replace('nan, nan, nan, nan, nan', '')

df_grouped['Category'] = df_grouped['Category'].str.strip().str.lower()

categories = df_grouped['Category'].unique()
#print(categories)

ontologies = df_grouped['Raw material ontology'].unique()

#print(ontologies)


#pd.set_option('display.max_rows', None)  
#pd.set_option('display.max_columns', None)  #





df_grouped.to_csv('FermDB_data.tsv', sep='\t', encoding='utf-8', index=False)



# Reset the index of the expanded DataFrame
#df_expanded = df_expanded.reset_index(drop=True)

# Print the expanded DataFrame
#print(df_expanded)

#def is_three_digit_number(value):
#    return bool(re.match(r'^\d{3}$', value))

# Apply the function to the 'Code' column and check if all values match
#df_expanded['Is_Three_Digit'] = df_expanded['Country'].apply(is_three_digit_number)

# Check if all entries in 'Is_Three_Digit' are True
#all_three_digit = df_expanded['Is_Three_Digit'].all()

#print("DataFrame with check column:")
#print(df_expanded)
#print("\nDoes the column only contain 3-digit numbers?", all_three_digit)