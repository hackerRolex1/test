# GMS Admin BO Environment Setup

## Prerequisites

Before setting up the GMS Admin environment, ensure you have the following installed:

- **Node.js**: v20.x or higher (LTS recommended)
- **npm**: v11.x or higher (comes with Node.js)
- **Git**: Latest version
- **Make sure `gms-admin-node-mgp` repo clone on server**
- **PM2 or Docker for runtime environment**

## Step 1: Setup the MongoDB Connections String
```sh
    # This connections id for gds_live mongodb
    DB_URL=mongodb+srv://<user-name>:<password>@<db-url>/<db-name>
```

## Step 2: Setup the PORTS
```sh
    # NODE_PORT is for gms admin bo node appliaction ports is should be present
    NODE_PORT=3009

    # OMS_PORT is for OMS-Player-Portal PORT [ Use when running on ip or http]
    OMS_PORT=2087
```

## Step 3: Setup the AWS Credentials
```sh
    # Please take aws credentials from admin
    ACCESS_KEY_ID = <acces key>
    SECRET_ACCESS_KEY = <secret acces key>
    REGION = <ap-northeast-1>
```
## Step 4: Setup the secret key
```sh
    # Paste the jwt secret key and patner auth secret key's
    JWT_SECRETKEY=<secret text>
    PATNER_AUTH_SEC_KEY=<secret text>
    JWT_EXPIRES_IN=5d
    JWT_COOKIE_EXPIRES_IN=5000
```
## Step 5: Setup redis credentials
```sh
    # Ask for redis credenetials from admin
    # Make sure used the exact format
    REDIS_HOST=<connection string>
    REDIS_PORT=<port-number>
    REDIS_USERNAME=<user-name>
    REDIS_PASSWORD=<redis-pass>

    # Make sure this is always true
    OTHER_REDIS = true
```


## Troubleshooting

### Common Issues

**Issue: Port already in use**
```bash
# Find and kill the process using port 3000
lsof -ti:3009 | xargs kill -9
```

**Issue: Dependencies installation fails**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue: Environment variables not loading**
- Ensure `.env` file is in the root directory
- Restart the development server after making changes to `.env`
- Check that variable names start with `REACT_APP_` (for React apps)

## Next Steps

- Review the project structure and architecture
- Set up database connections (if applicable)
- Configure additional services (Redis, message queues, etc.)
- Review coding standards and contribution guidelines