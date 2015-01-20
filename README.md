# LMIS-Dashboard

Lightweight dashboard for LoMIS database views

## Server Configuration

There are 2 types of configuration options: secret and public options. Secret options can only be defined as environment
variables, while the public ones can either be configured through environment variables, in configuration files or
left off to use default values.

### Secret Options

For development, copy the file `config/local.env.sample.js` to `config/local.env.js` and set the values of the variables.
These variables will be exported to the environment when running `grunt serve` or `grunt test`.

In production, the required variables have to be set in the environment of the node process.

|Environment Variable|Description|Required|
|:-------------------|:----------|:-------|
|`SESSION_SECRET`|Secret key for encrypting session data|Yes|
| `COUCH_USER`|CouchDB user name for authenticated access|No|
|`COUCH_PASS`|CouchDB password for authenticated access|No|

### Public Options

Public options are all optional and are defined in the following way:

1. Use environment variable if defined
2. Else use option from configuration file if defined
3. Else use default value

|Environment Variable|Config Key|Default|Description|
|:-------------------|:---------|:------|:----------|
|`IP`|`ip`|`undefined`|IP to listen on. All ips (*) if undefined.|
|`PORT`|`port`|`9000`|Port to listen on.|
|`COUCH_HOST`|`couch.host`|`''`|CouchDB host in Url format. Local host if empty.|
|`COUCH_PORT`|`couch.port`|`5984`|CouchDB port.|

The name of the configuration file to load is defined in the following way:

1. If an environment variable `NODE_CONFIG` is defined, use its value
2. Else use the value of `NODE_ENV` if defined
3. Else use the value `development`

The file is then loaded from `config/environment/<file name>.js`.

## Users

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
