# Base-Camp — Smart Employee Onboarding & Identity Service

> A serverless, AWS-native employee onboarding system that automates identity provisioning, document collection, and multi-stage onboarding workflows — with real-time tracking via a web-based HR dashboard.

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![HTML](https://img.shields.io/badge/Frontend-HTML%2FJS-blue)](./frontend)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [AWS Services Used](#aws-services-used)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Interface](#ui)
- [Backend (Lambda & Step Functions)](#backend)
- [Environment Variables](#environment-variables)
- [License](#license)

---

<a name="overview"></a>
## Overview

**Base-Camp** streamlines the entire employee onboarding lifecycle using a fully serverless AWS architecture. HR teams can initiate onboarding, track progress in real-time, and manage identity provisioning — all through a clean web dashboard.

Key capabilities:
- Automated multi-stage onboarding workflows via AWS Step Functions
- Identity and access provisioning using Amazon Cognito
- Secure document collection and storage
- Real-time status tracking via an HR web dashboard

---

<a name="architecture"></a>
## Architecture

```
HR Dashboard (Frontend)
        │
        ▼
  Amazon API Gateway
        │
        ▼
  AWS Lambda Functions
   ┌────┴────┐
   │         │
   ▼         ▼
AWS Step   Amazon
Functions  Cognito
   │         │
   ▼         ▼
Amazon    Identity &
DynamoDB  Access Mgmt
   │
   ▼
Amazon S3
(Documents)
```

The frontend HR dashboard communicates with the backend via API Gateway, which triggers Lambda functions. AWS Step Functions orchestrate the multi-stage onboarding workflow while Cognito handles identity provisioning for new employees.

---

<a name="aws-services-used"></a>
## AWS Services Used

| Service | Purpose |
|---|---|
| **AWS Lambda** | Serverless compute for onboarding logic |
| **AWS Step Functions** | Multi-stage workflow orchestration |
| **Amazon DynamoDB** | Employee records and onboarding state storage |
| **Amazon Cognito** | Employee identity provisioning and authentication |
| **Amazon API Gateway** | RESTful API layer for frontend–backend communication |
| **Amazon S3** | Secure document storage |
| **Amazon CloudFront** | High Speed CDN |
| **AWS IAM** | Role-based access control |

---

<a name="features"></a>
## Features

- **Automated Onboarding Workflows** — Step Functions orchestrate multi-stage onboarding (account creation → document collection → access provisioning → policy signoff → Manager introduction meet → completion)
- **Identity Provisioning** — Automatically create and manage employee identities in Amazon Cognito
- **Document Collection** — Collect and store onboarding documents securely in S3
- **HR Dashboard** — Web interface for HR teams to initiate and monitor onboarding in real-time
- **Employee Onboaridng Portal** - Web interface where employees submit personal details/preferences
- **Real-time Status Tracking** — Live updates on each employee's onboarding stage
- **Serverless & Scalable** — No infrastructure to manage; scales automatically with demand
- **Secure by Default** — Environment variables for secrets, IAM roles for least-privilege access

---

<a name="project-structure"></a>
## Project Structure

<p align="center"><img width="612" height="410" alt="image" src="https://github.com/user-attachments/assets/ce7dbda7-5d53-440b-b705-2d1ba3f095b4" /></p>

---

<a name="getting-started"></a>
## Getting Started

### Prerequisites

- AWS Account with appropriate permissions
- [AWS CLI](https://aws.amazon.com/cli/) configured
- Node.js (for Lambda functions)
- A modern web browser (for dashboards)

### 1. Clone the Repository

```bash
git clone https://github.com/Rajith-07/Base-Camp.git
cd Base-Camp
```

### 2. Configure AWS Services

Set up the required AWS services in your account:

```bash
# Configure AWS CLI
aws configure

# Deploy Lambda functions
cd backend/lambdas
# Deploy each Lambda function via AWS Console or AWS CLI
```

### 3. Set Environment Variables

Define process.env.<XXX> variables within the Configuration > Environment variables section of the AWS Lambda console

### 4. Deploy Step Functions

Deploy the state machine from the `backend/state-machine/` directory via the AWS Console or AWS CLI:

```bash
aws stepfunctions create-state-machine \
  --name "EmployeeOnboardingWorkflow" \
  --definition file://backend/state-machine/hrms-onboarding-workflow.json \
  --role-arn <YOUR_STEP_FUNCTIONS_ROLE_ARN>
```

### 5. Launch the Frontend

Open the Employee Onboarding forms in your browser:

```bash
cd frontend/dashboards
open employee-onboarding-form.html
# Or serve it via a static hosting service (S3 + CloudFront)
```

To Open HR dashboard:
```bash
cd frontend/dashboards
open hr-dashboard.html
# Or serve it via a static hosting service (S3 + CloudFront)
```
---

<a name="ui"></a>
## User Interface
### Employee Onboarding Form
Employees submit their personal details which generates an UUID as reference with an automated mail receipt using amazon SES.

<img width="49%" height="1017" alt="image" src="https://github.com/user-attachments/assets/b11cec88-c158-4cb0-9001-384c53c1f195" />
<img width="49%" height="1002" alt="image" src="https://github.com/user-attachments/assets/49e30ee9-1274-4172-98d9-cf99a6002ba2" />

<p align="center">
<img width="49%" alt="image" src="https://github.com/user-attachments/assets/790e5e7f-29bb-4e0e-927b-51aac1727221" />
</p>

### HR Dashboard
<img width="49%" height="1006" alt="image" src="https://github.com/user-attachments/assets/870de8c0-72f6-4556-95fb-75f227d3dacf" />
<img width="49%" height="1015" alt="image" src="https://github.com/user-attachments/assets/f3c84eda-15ce-4e4e-9400-793e0985a722" />

<img width="49%" height="1018" alt="image" src="https://github.com/user-attachments/assets/88271e47-6ea5-4d46-bf5f-2878aa09ad7c" />
<img width="49%" height="1021" alt="image" src="https://github.com/user-attachments/assets/ab10a271-345d-4ab0-9e57-a44f55029397" />



---

<a name="backend"></a>
## Backend (Lambda & Step Functions)

The backend consists of AWS Lambda functions triggered by API Gateway and orchestrated by Step Functions.

**Onboarding Workflow Stages:**

```
1. Initiate Onboarding
        ↓
2. Create Cognito Identity
        ↓
3. Provision Access & Roles
        ↓
4. Collect Documents (S3)
        ↓
5. Store Records (DynamoDB)
        ↓
6. Notify Completion
```

Each stage is an individual Lambda function, and the state machine manages transitions, retries, and error handling.

---

<a name="environment-variables"></a>
## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# AWS Region
AWS_REGION=us-east-1

# DynamoDB
DYNAMODB_TABLE_NAME=EmployeeOnboarding

# Cognito
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# S3
S3_BUCKET_NAME=base-camp-documents

# Step Functions
STATE_MACHINE_ARN=arn:aws:states:us-east-1:xxxxxxxxxxxx:stateMachine:EmployeeOnboardingWorkflow

# API Gateway
API_GATEWAY_ENDPOINT=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

> Never commit `.env` files to version control. The `.gitignore` is already configured to exclude them.

---

<a name="license"></a>
## License

This project is licensed under the [MIT License](./LICENSE).
