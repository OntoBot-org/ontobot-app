import firebase_admin
from firebase_admin import credentials,firestore

# Fetch the service account key JSON file contents
cred = credentials.Certificate('../keys/firestore-key.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred)

# ref = firestore.reference('Database reference')
# print(ref.get())

db = firestore.client()

doc_ref = db.collection('').document('')
doc_ref.set()
