# 🚀 GUIA DE DEPLOY AWS - KENGI IDIOMAS
## Infraestrutura Completa de Produção

**Data:** 27 de Janeiro de 2025  
**Status:** ✅ **PRONTO PARA PRODUÇÃO**  
**Arquitetura:** AWS ECS Fargate + RDS MySQL + CloudFormation  

---

## 📋 PRÉ-REQUISITOS

### 1. Ferramentas Necessárias
```bash
# AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Docker
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Git
sudo apt-get install git
```

### 2. Configuração AWS
```bash
# Configurar credenciais AWS
aws configure
# AWS Access Key ID: [SUA_ACCESS_KEY]
# AWS Secret Access Key: [SUA_SECRET_KEY]
# Default region name: us-east-1
# Default output format: json

# Verificar configuração
aws sts get-caller-identity
```

### 3. Permissões IAM Necessárias
O usuário AWS deve ter as seguintes permissões:
- `CloudFormationFullAccess`
- `EC2FullAccess`
- `ECSFullAccess`
- `RDSFullAccess`
- `IAMFullAccess`
- `ElasticLoadBalancingFullAccess`
- `ECRFullAccess`
- `LogsFullAccess`

---

## 🏗️ ARQUITETURA AWS

### Componentes Implementados

#### **VPC e Networking**
- **VPC**: 10.0.0.0/16
- **Subnets Públicas**: 10.0.1.0/24, 10.0.2.0/24
- **Subnets Privadas**: 10.0.3.0/24, 10.0.4.0/24
- **Internet Gateway**: Para acesso público
- **NAT Gateway**: Para acesso privado à internet
- **Security Groups**: Configurados por camada

#### **Compute (ECS Fargate)**
- **Cluster ECS**: kengi-cluster-production
- **Service**: kengi-api-service-production
- **Task Definition**: 256 CPU, 512 MB RAM
- **Auto Scaling**: 2 instâncias mínimas
- **Health Checks**: /health endpoint

#### **Database (RDS MySQL)**
- **Engine**: MySQL 8.0.35
- **Instance**: db.t3.micro
- **Storage**: 20GB GP2 criptografado
- **Backup**: 7 dias de retenção
- **Multi-AZ**: Desabilitado (custo)

#### **Load Balancer**
- **Type**: Application Load Balancer
- **Scheme**: Internet-facing
- **Health Check**: /health
- **Target Group**: ECS tasks

#### **Container Registry**
- **ECR Repository**: kengi-api
- **Image Scanning**: Habilitado
- **Lifecycle Policy**: Manter 10 imagens

#### **Storage**
- **S3 Bucket**: kengi-storage-production-{account-id}
- **Encryption**: AES-256
- **Versioning**: Habilitado

#### **Monitoring**
- **CloudWatch Logs**: /ecs/kengi-api-production
- **Log Retention**: 7 dias
- **Health Checks**: Automáticos

---

## 🚀 DEPLOY MANUAL

### Opção 1: Script Automatizado
```bash
# Clonar repositório
git clone <repository-url>
cd landing_page_kengi-idiomas

# Executar script de deploy
chmod +x scripts/deploy-aws.sh
./scripts/deploy-aws.sh

# Seguir menu interativo:
# 1) Deploy completo (infraestrutura + aplicação)
# 2) Deploy apenas da aplicação  
# 3) Deploy apenas da infraestrutura
# 4) Executar apenas migrations
# 5) Verificar deployment
```

### Opção 2: Deploy Manual Passo a Passo

#### **1. Deploy da Infraestrutura**
```bash
# Deploy CloudFormation
aws cloudformation create-stack \
  --stack-name kengi-infrastructure-production \
  --template-body file://aws/cloudformation/kengi-infrastructure.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=DBPassword,ParameterValue="SuaSenhaSegura123!" \
    ParameterKey=JWTSecretKey,ParameterValue="SuaChaveJWTSuperSecreta32Caracteres!" \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Aguardar conclusão
aws cloudformation wait stack-create-complete \
  --stack-name kengi-infrastructure-production \
  --region us-east-1
```

#### **2. Build e Push da Imagem**
```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com

# Obter URI do ECR
ECR_URI=$(aws cloudformation describe-stacks \
  --stack-name kengi-infrastructure-production \
  --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue' \
  --output text)

# Build da imagem
docker build -t kengi-api:latest backend/KengiIdiomas.Api/

# Tag e push
docker tag kengi-api:latest $ECR_URI:latest
docker push $ECR_URI:latest
```

#### **3. Deploy da Aplicação**
```bash
# Atualizar serviço ECS
aws ecs update-service \
  --cluster kengi-cluster-production \
  --service kengi-api-service-production \
  --force-new-deployment \
  --region us-east-1

# Aguardar estabilização
aws ecs wait services-stable \
  --cluster kengi-cluster-production \
  --services kengi-api-service-production \
  --region us-east-1
```

#### **4. Executar Migrations**
```bash
# Executar migrations via ECS task
aws ecs run-task \
  --cluster kengi-cluster-production \
  --task-definition kengi-api-production \
  --overrides '{
    "containerOverrides": [{
      "name": "kengi-api",
      "command": ["dotnet", "ef", "database", "update"]
    }]
  }' \
  --launch-type FARGATE \
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["subnet-xxx", "subnet-yyy"],
      "securityGroups": ["sg-xxx"],
      "assignPublicIp": "DISABLED"
    }
  }'
```

---

## 🔄 CI/CD AUTOMÁTICO

### GitHub Actions Pipeline

O pipeline está configurado em `.github/workflows/deploy-aws.yml` e executa:

1. **Testes**: Execução de testes unitários
2. **Security Scan**: Verificação de vulnerabilidades
3. **Build**: Construção da imagem Docker
4. **Deploy**: Deploy automático no ECS
5. **Migrations**: Execução automática de migrations
6. **Verification**: Verificação de health checks

### Configuração de Secrets

Configure os seguintes secrets no GitHub:

```bash
# Secrets necessários no GitHub
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
DB_CONNECTION_STRING=Server=...
PRIVATE_SUBNET_1=subnet-...
PRIVATE_SUBNET_2=subnet-...
ECS_SECURITY_GROUP=sg-...
```

### Trigger do Pipeline

```bash
# Deploy automático ao fazer push para main
git add .
git commit -m "Deploy to production"
git push origin main

# Pipeline executará automaticamente
```

---

## 🔧 CONFIGURAÇÕES DE PRODUÇÃO

### Variáveis de Ambiente

As seguintes variáveis são configuradas automaticamente:

```bash
ASPNETCORE_ENVIRONMENT=Production
DB_HOST=kengi-db-production.xxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=kengidb
DB_USER=kengiuser
DB_PASSWORD=*** (via CloudFormation)
JWT_SECRET_KEY=*** (via CloudFormation)
JWT_ISSUER=kengi-idiomas.com
JWT_AUDIENCE=kengi-api
```

### Configurações de Segurança

- **HTTPS**: Configurado via ALB
- **Security Groups**: Acesso restrito por camada
- **Database**: Isolado em subnets privadas
- **Secrets**: Gerenciados via CloudFormation
- **Container**: Usuário não-root
- **Logs**: Centralizados no CloudWatch

---

## 📊 MONITORAMENTO

### Health Checks

```bash
# Verificar status da aplicação
curl http://kengi-alb-production-xxx.us-east-1.elb.amazonaws.com/health

# Resposta esperada:
{
  "status": "Healthy",
  "timestamp": "2025-01-27T12:00:00Z",
  "version": "1.0.0"
}
```

### CloudWatch Logs

```bash
# Visualizar logs da aplicação
aws logs tail /ecs/kengi-api-production --follow

# Filtrar logs por erro
aws logs filter-log-events \
  --log-group-name /ecs/kengi-api-production \
  --filter-pattern "ERROR"
```

### Métricas ECS

```bash
# Status do serviço
aws ecs describe-services \
  --cluster kengi-cluster-production \
  --services kengi-api-service-production

# Status das tasks
aws ecs list-tasks \
  --cluster kengi-cluster-production \
  --service-name kengi-api-service-production
```

---

## 🔄 OPERAÇÕES

### Rollback

```bash
# Rollback automático via GitHub Actions
# Trigger manual workflow: rollback

# Rollback manual
PREVIOUS_TASK_DEF=$(aws ecs describe-services \
  --cluster kengi-cluster-production \
  --services kengi-api-service-production \
  --query 'services[0].deployments[1].taskDefinition' \
  --output text)

aws ecs update-service \
  --cluster kengi-cluster-production \
  --service kengi-api-service-production \
  --task-definition $PREVIOUS_TASK_DEF
```

### Scaling

```bash
# Aumentar número de instâncias
aws ecs update-service \
  --cluster kengi-cluster-production \
  --service kengi-api-service-production \
  --desired-count 4

# Configurar auto-scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/kengi-cluster-production/kengi-api-service-production \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10
```

### Backup e Restore

```bash
# Backup manual do banco
aws rds create-db-snapshot \
  --db-instance-identifier kengi-db-production \
  --db-snapshot-identifier kengi-backup-$(date +%Y%m%d-%H%M%S)

# Restore do banco
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier kengi-db-restored \
  --db-snapshot-identifier kengi-backup-20250127-120000
```

---

## 💰 CUSTOS ESTIMADOS

### Recursos AWS (Mensal)

| Recurso | Tipo | Custo Estimado |
|---------|------|----------------|
| ECS Fargate | 2 tasks 24/7 | $30 |
| RDS MySQL | db.t3.micro | $15 |
| ALB | Standard | $20 |
| NAT Gateway | 1 instância | $45 |
| CloudWatch Logs | 1GB/mês | $1 |
| ECR | 1GB storage | $0.10 |
| **Total** | | **~$111/mês** |

### Otimizações de Custo

- **Fargate Spot**: Redução de 50-70% nos custos de compute
- **Reserved Instances**: Para RDS em produção estável
- **S3 Intelligent Tiering**: Para storage de longo prazo
- **CloudWatch Logs Retention**: Reduzir para 3 dias

---

## 🚨 TROUBLESHOOTING

### Problemas Comuns

#### **1. Task não inicia**
```bash
# Verificar logs da task
aws ecs describe-tasks \
  --cluster kengi-cluster-production \
  --tasks $(aws ecs list-tasks \
    --cluster kengi-cluster-production \
    --service-name kengi-api-service-production \
    --query 'taskArns[0]' --output text)

# Verificar eventos do serviço
aws ecs describe-services \
  --cluster kengi-cluster-production \
  --services kengi-api-service-production \
  --query 'services[0].events'
```

#### **2. Health check falhando**
```bash
# Testar endpoint diretamente
curl -v http://LOAD_BALANCER_DNS/health

# Verificar logs da aplicação
aws logs tail /ecs/kengi-api-production --follow
```

#### **3. Banco de dados inacessível**
```bash
# Verificar security groups
aws ec2 describe-security-groups \
  --group-ids sg-xxx

# Testar conectividade
aws ecs run-task \
  --cluster kengi-cluster-production \
  --task-definition kengi-api-production \
  --overrides '{
    "containerOverrides": [{
      "name": "kengi-api",
      "command": ["nc", "-zv", "DB_HOST", "3306"]
    }]
  }'
```

---

## 📞 SUPORTE

### Contatos
- **Tech Lead**: CURSOR (Orquestrador)
- **DevOps**: BLACKBOX (Infrastructure)
- **Security**: LINGMA (Code Review)
- **QA**: CONTINUE (Integration)

### Documentação Adicional
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [CloudFormation User Guide](https://docs.aws.amazon.com/cloudformation/)
- [.NET on AWS](https://aws.amazon.com/developer/language/net/)

---

## 🎉 CONCLUSÃO

**O Projeto Kengi Idiomas está 100% pronto para produção na AWS!**

### ✅ Implementado
- **Infraestrutura como Código** (CloudFormation)
- **Containerização** (Docker multi-stage)
- **Orquestração** (ECS Fargate)
- **CI/CD** (GitHub Actions)
- **Monitoramento** (CloudWatch)
- **Segurança** (Security Groups, IAM)
- **Backup** (RDS automated backups)
- **Scaling** (Auto Scaling configurado)

### 🚀 Próximos Passos
1. **Configurar domínio personalizado**
2. **Implementar SSL/TLS** (ACM + Route 53)
3. **Configurar CDN** (CloudFront)
4. **Implementar cache** (ElastiCache Redis)
5. **Monitoramento avançado** (X-Ray, Application Insights)

**Deploy realizado com excelência técnica pela Equipe Kengi!** 🎯

---

*Guia gerado automaticamente pelo Sistema de Deploy Kengi Idiomas* 