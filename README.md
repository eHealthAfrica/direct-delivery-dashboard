LMIS-Dashboard
==============

Lightweight dashboard for LoMIS database views

Users
=====

The application loads the users from the '_users' db on the configured CouchDB server. To create a new user, add a new
document to the '_users' db with the following structure:

```
{
   "_id": "org.couchdb.user:[user name]",
   "password": "[password]",
   "name": "[user name]",
   "roles": [],
   "type": "user",
   "access": {
       "level": "[access level]",
       "items": []
   }
}
```

Replace `[user name]` (used also in `_id`) and `[password]` with the corresponding values. Then set `[access level]` to
`state`, `zone`, `lga`, `ward` or `facility` and fill the `access.items` array with the names of the items that the user
should have access to (states, zones, lgas, wards or facilities based on the access level).
