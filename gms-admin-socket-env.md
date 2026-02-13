# GMS Admin BO Socket Environment Setup

## Prerequisites

Before setting up the GMS Admin environment, ensure you have the following installed:

- **Node.js**: v20.x or higher (LTS recommended)
- **npm**: v11.x or higher (comes with Node.js)
- **Git**: Latest version
- **Make sure `gms-admin-node-mgp` repo clone on server**
- **PM2 or Docker for runtime environment**

## Step 2: Setup the PORTS
```sh
    # NODE_PORT is for gms admin bo socket appliaction port is should be present
    PORT=5500
```

## Step 5: Setup redis credentials
```sh
    # Ask for redis credenetials from admin
    # Make sure used the exact format
    # Make sure you use gms_cherry redis credetials
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
lsof -ti:5500 | xargs kill -9
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