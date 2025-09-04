# MicroBridge Infrastructure

This directory contains all infrastructure configuration and deployment files for the MicroBridge platform.

## Directory Structure

```
infrastructure/
├── docker/                    # Docker configurations
│   ├── docker-compose.yml     # Main compose file for development/production
│   ├── docker-compose.monitoring.yml  # Monitoring stack configuration
│   └── Dockerfile.api         # Backend API container definition
├── monitoring/                # Monitoring and observability
│   ├── prometheus.yml         # Prometheus configuration
│   ├── grafana/              # Grafana dashboards and configs
│   └── alerts/               # Alert configurations
└── scripts/                  # Deployment and maintenance scripts
    ├── deploy.sh             # Production deployment script
    └── backup.sh             # Database backup script
```

## Quick Start

### Development Environment
```bash
# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Start with monitoring
docker-compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.monitoring.yml up -d
```

### Production Deployment
```bash
# Deploy to production
./infrastructure/scripts/deploy.sh

# Monitor with Grafana
# Access: http://localhost:3001
```

## Services

- **API Backend**: Go 1.21 with Gin framework
- **Frontend**: Next.js 15.1.6 with React 19
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Maintenance

- Database backups run automatically every 6 hours
- Logs are retained for 30 days
- Monitoring alerts configured for system health

For detailed deployment instructions, see the deployment guide in `/docs/guides/deployment-guide.md`.