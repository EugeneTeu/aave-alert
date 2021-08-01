# aave-alert

## Delete webhook 

`curl -F "url=" https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook`

## Download schema from aave graphql endpoint 

```bash
yarn run apollo schema:download --endpoint=https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic graphql-schema.json
```

### Generate local types

```bash
 yarn run apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --includes=src/**/*.ts --tagName=gql --addTypename --globalTypesFile=src/types/graphql-global-types.ts types  
```