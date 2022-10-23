import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def delete_collection(coll_ref, batch_size):
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        print(f'Deleting doc {doc.id} => {doc.to_dict()}')
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)

db = firestore.client()  # this connects to our Firestore database
collection = db.collection('mellows')

delete_collection(collection, 50)
