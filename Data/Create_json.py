import pandas as pd
import json

books = pd.read_csv('books.csv')
books = books[['book_id','authors','image_url','title','original_publication_year']]
books['description'] = 'Descriptions.....'
books.original_publication_year = books.original_publication_year.apply(str)
books.columns = ['bID','author','image','name','year','description']
json_string = '['
i= 1
for i in books.index:
    fields=books.loc[i].to_json()
    x =  '{"model": "backend.Catalog","pk": \"'+str(i+1)+'\","fields":'+fields+'},'
    json_string += x
    i+=1
json_string = json_string[:-1]
json_string += ']'
df = json.loads(json_string)

with open('books.json', 'w', encoding='utf-8') as f:
    json.dump(df, f, ensure_ascii=False, indent=4)