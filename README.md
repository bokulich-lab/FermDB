# 🧀 FermDB 
> “A manually curated and referenced list of traditional fermented foods of the world.”

[![Publication Badge](https://img.shields.io/badge/Publication-Trends_in_Food_Science_%26_Technology-red?style=flat)](https://doi.org/10.1016/j.tifs.2024.104569)
[![Dashboard Badge](https://img.shields.io/badge/Interactive-Dashboard-blue?style=flat&link=https%3A%2F%2Fbokulich-lab.github.io%2FFermDB%2F)](https://bokulich-lab.github.io/FermDB/)
[![FFO Badge](https://img.shields.io/badge/FFO-Fermented%20Food%20Ontology-green?style=flat&logo=github)](https://github.com/bokulich-lab/Fermented-Food-Ontologies)
[![FermDB license badge](https://img.shields.io/badge/FermDB%20License-CC%20BY%204.0-blue?style=flat)](https://github.com/bokulich-lab/FermDB/blob/main/LICENSE_database.txt)
[![Dashboard  license badge](https://img.shields.io/badge/Dashboard%20License-BSD%203%20Clause-blue?style=flat)](https://github.com/bokulich-lab/FermDB/blob/main/LICENSE)

![Map figure](Figure1-map.png)
<br>

## 🌎 Visualization
The **FermDB** can be visualized and explored interactively at:

[![Dashboard Badge](https://img.shields.io/badge/Interactive-Dashboard-blue?style=flat&link=https%3A%2F%2Fbokulich-lab.github.io%2FFermDB%2F)](https://bokulich-lab.github.io/FermDB/)


## 💻 Suggesting a new fermented food or restructuring an existing entry
To submit a new entry for the FermDB please take into consideration the following guidelines :
<br>

- **Fermentation** : The most important aspect to consider is that the food listed is indeed fermented. To achieve this, it is necessary to consult the reference to find a reliable source from a peer-reviewed publication (if this is not listed in the table  yet), government webpage, book (if a complete description is present) or manufacturing protocol (which has to be directly generated by the producer). 

- **Location** : The region should be inspected and information corrected when necessary. In addition to the full country name, the regions and subregions have to be assigned based on the classification provided by the [Standard country or area codes for statistical use (M49)](https://unstats.un.org/unsd/methodology/m49/) of the United Nations (See the Geographic region structure page). Regions correspond to a hierarchy lower than the continent, see [map](https://unstats.un.org/sdgs/indicators/regional-groups/) for the reference. While subregions contain subdivisions, for example in Latin America and the Caribbean we have the Caribbean and Central America. Writing the name of the country in the “Country” column (eg. Bulgaria) and the code in “Country_code” (eg, 100) are the only necessary inputs since the rest are going to be filled in with a script.

- **Product (Name)** : should be inspected for name in English and recorded in “Product”. If available the name in the original language should be recorded including special characters (Name in original language column).

- **Description** : should contain no more than a paragraph (2-3 sentences) and should be in accordance with the reference, government webpage, or producer standard. This field should not contain more than 50 words and information already present in other fields should be avoided. Grammatical consistency is necessary and should be written in simple present tense. The ideal description should give an overview for a non-expert and contain complete sentences describing the food,  avoiding this field to become a list of attributes. Sentences should ideally focus on (1) Overall description of the food, especially for non-informative / self-explanatory names; (2) Particularities of the production (eg. traditional methods, time of the year when it is produced, steps for the elaboration of the product, etc); and (3) Particularities of location of production or geography (eg. town or place where it is produced).

- **Raw material ontology** : should be detailed and in accordance with the lowest level of the [latest fermented food ontology](https://github.com/bokulich-lab/Fermented-Food-Ontologies/blob/main/fermented_food_ontology.py) developed by the group. The lowest level in this ontology corresponds to one or more the terms included in one of the list (eg. "cow milk", "peanut"). If a raw material is missing it should be included in the ontology in the corresponding category after consulting with the fermDB team via a github [issue](https://github.com/bokulich-lab/Fermented-Food-Ontologies/tree/main). All ontological categories should be separated by a comma. The ontology uses an anatomical and fluid approach that should be considered when suggesting a new category, the lowest level should be as specific as possible.

- **Raw material additional information** : Details about the raw materials that are not captured in the ontology. It can include any details related to the particularities of an ingredient. For example, type of animal or plant, species, variety, etc.

- **Category** : The category should be assigned to one of the following: acid beverage, alcoholic beverage, beer, cheese, dairy product, fermented cereal, fermented fish, fermented fruit, fermented legumes, fermented meat, fermented roots, fermented vegetables, yogurt or wine.

- **References**: A valid reference from a peer-reviewed publication, gov websites, books, industrial manual. The reference has to be recorded in APA format.

- **Webpage reference** : Wikipedia webpages should be included when available.

This [template](https://docs.google.com/spreadsheets/d/15SadRPKCl3FXqv0erFPjhznRbReGbxtU5F0H06GFYnI/edit?usp=sharing) should be used and attached for submitting a new entry(ies) or reformatting exiting ones, a valid description or motivation should be also included. If the new entry includes new ontological categories an issue should also be created for the [Fermented Food Ontology Repository](https://github.com/bokulich-lab/Fermented-Food-Ontologies).
After submission the entry(ies) will be reviewed by the FermDB team and a decision will be made for its inclusion. The team might also require more details about individual entries, which will be then requested to the contributors. Contributors can also request to be included in the FermDB [about](https://bokulich-lab.github.io/FermDB/#about) page.


 
##  💾 Downloading the FermDB
The FermDB can be downloaded as a [XLSX](https://github.com/bokulich-lab/FermDB/blob/main/FermDB_data.xlsx) or tsv file.

##  📄 Copyright
- The FermDB and associated information (FermDB_data.xlsx) is released under a CC BY 4.0 license.
- The Dashboard used fo visualizing and exploring the FermDB is released under a BSD 3-Clause license.

## ✒️ Citing the FermDB
If you have used the FermDB please consider citing:

```
Hernández-Velázquez, R., Flörl, L., Lavrinienko, A., Sebechlebská, Z., Merk, L., Greppi, A., & Bokulich, N. A. (2024).
The future is fermented: Microbial biodiversity of fermented foods is a critical resource for food innovation and human health.
Trends in Food Science & Technology, 150, 104569. doi.org/10.1016/j.tifs.2024.104569
```

[![Publication Badge](https://img.shields.io/badge/Publication-Trends_in_Food_Science_%26_Technology-red?style=flat)](https://doi.org/10.1016/j.tifs.2024.104569)
