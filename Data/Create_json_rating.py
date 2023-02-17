import pandas as pd
import json
import lorem
import random
import names

reviews = pd.read_csv('ratings.csv')
reviews = reviews.head(1000000)
reviews.columns = ['uID','bID','rating']
reviews['review'] = 'Descriptions.....'
u_id = list(set(reviews.uID))
critic = [random.randint(0,1) for _ in range(0,len(u_id))]
UserCritic = pd.DataFrame({'uID':u_id,'critic':critic})
reviews = reviews.merge(UserCritic,on='uID',how='left')
likesno = [random.randint(0,10) for _ in range(0,len(reviews))]
reviews['likesno'] = likesno
likes = []
likeuser = []
likereview =[]
print('reviews {}'.format(int(len(reviews))))
j=0
for i in range(0,len(reviews)):
    likeuser.extend(random.sample(u_id,reviews.loc[i,'likesno']))
    temp = [i] * reviews.loc[i,'likesno']
    likereview.extend(temp)
    likes.append([i])
    if i % 10000 == 0:
        print('reviews {}'.format(int(i)))
reviews['likes'] = likes
ReviewLikes = pd.DataFrame({'user':likeuser,'review':likereview})

json_string = '['
i= 1
print('likes')
for i, row in reviews.iterrows():
    row['review'] = lorem.sentence()
    fields=row.to_json()
    x =  '{"model": "backend.Review","pk": \"'+str(i+1)+'\","fields":'+fields+'},'
    json_string += x
    if i % 10000 == 0:
        print('likes {} of {}'.format(int(i),int(len(reviews))))    
json_string = json_string[:-1]
json_string += ']'
df = json.loads(json_string)

with open('reviews.json', 'w', encoding='utf-8') as f:
    json.dump(df, f, ensure_ascii=False, indent=4)

json_string = '['
i= 1
for i, row in UserCritic.iterrows():
    fields=row.to_json()
    x =  '{"model": "backend.UserCritic","pk": \"'+str(i+1)+'\","fields":'+fields+'},'
    json_string += x
    if i % 10000 == 0:
        print('Usercritic {} of {}'.format(int(i),int(len(UserCritic))))    
json_string = json_string[:-1]
json_string += ']'
df = json.loads(json_string)

with open('UserCritic.json', 'w', encoding='utf-8') as f:
    json.dump(df, f, ensure_ascii=False, indent=4)

json_string = '['
i= 1
for i, row in ReviewLikes.iterrows():
    fields=row.to_json()
    x =  '{"model": "backend.ReviewLikes","pk": \"'+str(i+1)+'\","fields":'+fields+'},'
    json_string += x
    if i % 10000 == 0:
        print('ReviewLikes {} of {}'.format(int(i),int(len(ReviewLikes))))    
json_string = json_string[:-1]
json_string += ']'
df = json.loads(json_string)

with open('ReviewLikes.json', 'w', encoding='utf-8') as f:
    json.dump(df, f, ensure_ascii=False, indent=4)




chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@$#%0123456789'
def password_checker(passwd):
        SpecialSym =['$', '@', '#', '%']
        result = True
        if (len(passwd) < 6) | len(passwd) > 20:
            result = False
        if not any(char.isdigit() for char in passwd):
            result = False
        if not any(char.isupper() for char in passwd):
            result = False
        if not any(char.islower() for char in passwd):
            result = False
        if not any(char in SpecialSym for char in passwd):
            result = False
        return result
print('users')
json_string = '['
i = 1
for row in u_id:
    correct = False
    while not correct:
        password = ''
        for _ in range(0,random.randint(7,21)):
            password += random.choice(chars)
        correct = password_checker(password)
    x =  '{"model": "auth.User","pk": \"'+str(i+1)+'\","fields": {"id": \"'+str(row)+'\" ,"username": \"'+names.get_first_name()+str(i)+'\" ,"password":\"'+password+'\"}},'
    json_string += x
    if i % 10000 == 0:
        print('uid {} of {}'.format(int(i),int(len(u_id))))
    i += 1
json_string = json_string[:-1]
json_string += ']'
df = json.loads(json_string)

with open('authUser.json', 'w', encoding='utf-8') as f:
    json.dump(df, f, ensure_ascii=False, indent=4)